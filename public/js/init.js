

$( document ).ready(function() {
  console.log( "ready!" );

  $('.sidenav').sidenav();
   
  

  const db = firebase.database()

  db.ref('category').once('value').then(function(snapshot){
    snapshot.forEach(function(oneSnap){
      let data = oneSnap.val()
      $('#categoryDiv').append(
        `<p>
          <label>
            <input class="with-gap" name="category" type="radio" />
            <span>` +  data.name + `</span>
          </label>
        </p>`
      );
    });
    $('#categoryLoad').addClass('hide');
  });

  
  db.ref('product_data').orderByKey().limitToFirst(20).once('value').then(function(snapshot){
    snapshot.forEach(function(oneSnap){
      let data = oneSnap.val() 

      $('#productDiv').append(
        `<div class="col l3 m4 s6">
          <div class="card">
            <div class="card-image">
              <img src="img/logo.png" alt="" class="responsive-img" style="padding: 10px;">              
            </div>
            <div class="card-content" style="padding: 10px;">        
              <p>
                <b>`+ data.name+`</b>
              </p>
              <p>Rp.`+ data.sellPrice+`<small>/ `+ data.unit+`</small></p>
              <p></p>
            </div>
          </div>
        </div>`
      );
          
    });
    $('#productLoad').addClass('hide');
  

  });
  


});





