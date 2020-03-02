

$( document ).ready(function() {
  $('.sidenav').sidenav();
  $('select').formSelect();
  $('.fixed-action-btn').floatingActionButton();
  $('.modal').modal();
  


  const db = firebase.database();
 

  
  let totalProduct, totalPage, lastUpdated;
  let category = 'SEMUA';
  let currentPage = 1;
  let perPage = parseInt( $('#itemPerPage').val());

 

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
    loadProperties();
    $('#itemPerPage').on('change', function(){
      currentPage = 1;
      loadProduct();
    }); 
    $('#webCategory input').on('change', function() {
      category = $('input[name=category]:checked', '#webCategory').val();
      currentPage = 1;
      loadProduct();
   });
  });

  function loadProperties(){
    db.ref('properties').once('value').then(function(snapshot){
      let data = snapshot.val()
      lastUpdated = data.last_sync
      totalProduct = data.product_total        
      $('#lastUpdateTxt').text("Update : " + lastUpdated);
      currentPage = 1;
      loadProduct();
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


  function loadProduct(){
    
    perPage = parseInt($('#itemPerPage').val());
    
    
    $('#productLoad').removeClass('hide');
    $('#productDiv').empty();
    let allSnap;
    
    if(category === "SEMUA"){
      // $('#itemPerPage').parent().parent().closest('div').removeClass('hide');
      totalPage = Math.floor(totalProduct / perPage);
      
      if(totalProduct % perPage != 0){
        totalPage += 1;
      }
    
      loadPagination(totalPage);
      let startItem = perPage * (currentPage-1)
      startItem = startItem.toString();
      
      db.ref('product_data').orderByKey().startAt(startItem).limitToFirst(perPage).once('value').then(function(snapshot){    
        allSnap = clone(snapshot.val());        
        appendProduct(allSnap);            
      });
    }else{
      // $('#itemPerPage').parent().parent().closest('div').addClass('hide');      
      db.ref('product_data').orderByChild('category').equalTo(category).once('value').then(function(snapshot){    
        allSnap = clone(snapshot.val());        
        appendProduct(allSnap);
      });
    }   
  }

  function appendProduct(all){
    let startItem = 0;
    let endItem = 0;
    if(category !== 'SEMUA'){
      let totalItem = Object.keys(all).length;
      
      totalPage = Math.floor(totalItem / perPage);
      if(totalItem % perPage !== 0){
        totalPage += 1;
      }
      loadPagination(totalPage, currentPage);
      startItem = perPage * (currentPage-1)
      endItem = startItem + perPage - 1;
    }
    
    
    Object.keys(all).some(function(value, index, _arr) {
       let data = all[value];
       if(category === 'SEMUA' || (category !== 'SEMUA' &&  index>= startItem)){
       
        $('#productDiv').append(
          `<div class="col l3 m4 s6">
            <div class="card hoverable">
              <div class="card-image grey">
                <img src="img/logo.png" alt="" class="responsive-img materialboxed" data-caption="`+data.name+`" style="padding: 10px;">
                <a class="btn-floating halfway-fab waves-effect waves-light green" style="right: 12px;"><i class="material-icons">list</i></a>                                                           
              </div>
              <div class="card-content" style="padding: 10px; margin-top: 8px;">        
                <p class="truncate">
                `+ data.name+`
                </p>
                <p>Rp.`+ data.sellPrice+`<small> / `+ data.unit+`</small></p>
                <p class="right-align">Stok :<b> `+data.stockAmount+`</b></p>  
              </div>           
            </div>
          </div>`
        );
       }

      if(category !== 'SEMUA'){
        return index === endItem;      
      }
           
    });
    
    $('#productLoad').addClass('hide'); 
    $('.materialboxed').materialbox();     
  }

  $('#mobileProductFilterBtn').on('click', function(){
    category = $('input[name=category]:checked', '#mobileCategory').val()
    currentPage = 1;
    loadProduct();
  });

  function loadPagination(total){
  
    $('.pageNum').empty();
    let arrowLeft = `<li `; 
  
    if(currentPage <= 1){
      arrowLeft += `class="disabled"`;
    }
    arrowLeft += `>
                  <a href="#!">
                    <i class="material-icons">chevron_left</i>
                  </a>
                </li>`;
                
      
    let pageNumber = '';
    for(i=1;i<=total;i++){
      if(i === currentPage){
        pageNumber += `<li class="blue darken-1 active">`;
      }else{
        pageNumber +=`<li class="waves-effect">`;
      }
      pageNumber += `<a href="#!">`+ i + `</a></li>`;    
    }
  
    let arrowRight = `<li `; 
  
    if(currentPage >= total){
      arrowRight += `class="disabled"`;
    }
    arrowRight += `>
                  <a href="#!">
                    <i class="material-icons">chevron_right</i>
                  </a>
                </li>`;
  
    $('.pageNum').append(arrowLeft+pageNumber+arrowRight);
    
  }

  $('.pageNum').on('click','a', function(){
    let clickedPage = $(this).text()
    let clickedParent =  $(this).parent('li');
    let disableStatus = clickedParent.hasClass('disabled');

    if(isNaN(clickedPage)){       
      if(!disableStatus){       
        let indicator = $(this).children()[0].innerHTML;
        if(indicator === 'chevron_right'){
          currentPage++;
        }else if(indicator === 'chevron_left'){
          currentPage--;
        }
      }    
    }else{
      currentPage = parseInt(clickedPage);
   
    }
  
    if(!disableStatus){          
      loadProduct();
    }   
    
  });

});

function toast(pesan){
  M.toast({html: pesan});
}







