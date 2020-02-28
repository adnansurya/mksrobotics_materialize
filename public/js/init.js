

$( document ).ready(function() {
  console.log( "ready!" );

  $('.sidenav').sidenav();
  $('select').formSelect();
  $('.fixed-action-btn').floatingActionButton();
  $('.modal').modal();


  const db = firebase.database()
  let totalProduct, totalPage, lastUpdated;

  loadProperties(); 

  db.ref('category').once('value').then(function(snapshot){
    $('.categoryDiv').append(
      `<p style="margin-top: 5px;margin-bottom: 5px;">
        <label>
          <input class="with-gap" name="category" type="radio" value="SEMUA" checked/>
          <span style="padding-left: 25px;">SEMUA KATEGORI</span>
        </label>
      </p>`
    );
    snapshot.forEach(function(oneSnap){
      let data = oneSnap.val()
      $('.categoryDiv').append(
        `<p style="margin-top: 5px;margin-bottom: 5px;">
          <label>
            <input class="with-gap" name="category" type="radio" value="`+ data.name+`" />
            <span class="text-blue" style="padding-left: 25px;">` +  data.name + `</span>
          </label>
        </p>`
      );
    });
    $('#categoryLoad').addClass('hide');
    $('#webCategory input').on('change', function() {
      let selectedCategory = $('input[name=category]:checked', '#webCategory').val()
      loadProduct(selectedCategory, 10, 1);
   });
  });

  function loadProperties(){
    db.ref('properties').once('value').then(function(snapshot){
      let data = snapshot.val()
      lastUpdated = data.last_sync
      totalProduct = data.product_total        
      $('#lastUpdateTxt').text("Update : " + lastUpdated);
      loadProduct("SEMUA",10,1);
    });
  }


  function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
  }


  function loadProduct(category, perPage, currentPage){

    $('#productLoad').removeClass('hide');
    $('#productDiv').empty();
    let allSnap;
    
    if(category === "SEMUA"){
      totalPage = Math.round(totalProduct / perPage);
      if(totalProduct % perPage != 0){
        totalPage += 1;
      }
      console.log(totalPage);
      db.ref('product_data').orderByKey().startAt('10').limitToFirst(10).once('value').then(function(snapshot){    
        allSnap = clone(snapshot.val());        
        appendProduct(allSnap);            
      });
    }else{
      db.ref('product_data').orderByChild('category').equalTo(category).once('value').then(function(snapshot){    
        allSnap = clone(snapshot.val());        
        appendProduct(allSnap);
      });
    }   
  }

  function appendProduct(all){

    Object.keys(all).forEach(function(k) {
       let data = all[k];
       $('#productDiv').append(
        `<div class="col l3 m4 s6">
          <div class="card hoverable">
            <div class="card-image">
              <img src="img/logo.png" alt="" class="responsive-img" style="padding: 10px;">                                                   
            </div>
            <div class="card-content" style="padding: 10px;">        
              <p class="truncate">
               `+ data.name+`
              </p>
              <p>Rp.`+ data.sellPrice+`<small>/ `+ data.unit+`</small></p>
              <p class="right-align">Stok :<b> `+data.stockAmount+`</b></p>  
            </div>           
          </div>
        </div>`
      );
          
    });
    $('#productLoad').addClass('hide');
  

  });
  


});





