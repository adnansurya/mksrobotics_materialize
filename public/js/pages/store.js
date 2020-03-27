

$( document ).ready(function() {
  loadInit();
  cekLogin(['all']);
  loadPlugin();
  let totalProduct, totalPage, lastUpdated;
  let selectedId, selectedName, selectedDetails;
  let category = 'SEMUA';
  let currentPage = 1;
  let perPage = parseInt( $('#itemPerPage').val());
  let search_query = "";

 

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

    $('#search').change(function(){
        search_query = capitalFirstLetter($(this).val());
        if(search_query != ""){
          category = 'SEARCH';
          loadProduct();
        }
        
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

  let jsonProduct;
  function loadProduct(){
    
    perPage = parseInt($('#itemPerPage').val());
    
    
    $('#productLoad').removeClass('hide');
    $('#productDiv').empty();
    

    
    if(category === "SEMUA"){
      // $('#itemPerPage').parent().parent().closest('div').removeClass('hide');
      totalPage = Math.floor(totalProduct / perPage);
      
      if(totalProduct % perPage != 0){
        totalPage += 1;
      }
    
      loadPagination(totalPage);
      let startItem = perPage * (currentPage-1)
      startItem = startItem.toString();

      
      $.get("/api/product_page/"+startItem+"/"+perPage, function(data, status){              
        jsonProduct = JSON.parse(data).data;     
        appendProduct(jsonProduct);
      });      

    }else if(category === "SEARCH"){

      $.get("/api/search_product/"+search_query, function(data, status){
        jsonProduct = JSON.parse(data).data;     
        appendProduct(jsonProduct);
      });

    }else{
      $.get("/api/filter_product/"+category.replace('/', '%2F'), function(data, status){             
        jsonProduct = JSON.parse(data).data;     
        appendProduct(jsonProduct);
      });    
    }   
  }
  // let allDesc;
  function appendProduct(all){
    console.log(jsonProduct);
    
    
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
    
    //  db.ref('description').once('value').then(function(snapshot){        
    //     allDesc = clone(snapshot.val());

    // }).then(function(){

      Object.keys(all).some(function(value, index, _arr) {
        let data = all[value];
        if(category === 'SEMUA' || (category !== 'SEMUA' &&  index>= startItem)){
 
       
        if(data.picture == null || data.picture == undefined){
          data.picture = '/img/logo.png'         
        }
        if(data.details == null || data.details == undefined){
          data.details = 'Belum Tersedia';
        }
         
           
           $('#productDiv').append(
             `<div class="col l3 m4 s6">
               <div class="card hoverable">
                 <div class="card-image grey">
                   <div class="valign-wrapper my-responsive-card">
                    <img src="`+data.picture+`" alt="`+data.name+`" class="responsive-img materialboxed" data-caption="`+data.name+`" style="padding: 10px;">
                   </div>
                  
                   <a data-target="modal2" data-id="`+index+`" class="btn-floating halfway-fab waves-effect waves-light green modal-trigger my-details" style="right: 12px;"><i class="material-icons">subject</i></a>                                                           
                 </div>
                 <div class="card-content" style="padding: 10px; margin-top: 8px;">        
                   <p class="truncate">
                   `+ data.name+`
                   </p>
                   <p>`+ rupiah.format(data.sellPrice) +`<small> / `+ data.unit+`</small></p>
                   <p class="right-align">Stok :<b> `+data.stockAmount+`</b></p>  
                 </div>           
               </div>
             </div>`
           );
         // });
        
        
        }
 
       if(category !== 'SEMUA'){
         return index === endItem;      
       }
          
     });
    // }).then(function(){
      $('.materialboxed').materialbox();
      $('.fixed-action-btn').floatingActionButton();
      $('#productLoad').addClass('hide'); 
      $('select').formSelect();
    // });
    
   
    
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
                  <a href="#logo-container">
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
      pageNumber += `<a href="#logo-container">`+ i + `</a></li>`;    
    }
  
    let arrowRight = `<li `; 
  
    if(currentPage >= total){
      arrowRight += `class="disabled"`;
    }
    arrowRight += `>
                  <a href="#logo-container">
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



 
  $('#productDiv').on('click','a', function(){  
    selectedId = $(this).attr('data-id');
    selectedName = jsonProduct[selectedId].name;    
    

    if(jsonProduct[selectedId].details == null || jsonProduct[selectedId].details == undefined){
      selectedDetails = 'Belum ada keterangan';  
            
    }else{
      
      selectedDetails = jsonProduct[selectedId].details; 
     
    }

    $('#modal2').modal({
      'onOpenStart': 
          function(){  
           
            let details = selectedDetails.trim();
  
            
            let new_details = details.replace(new RegExp('\r?\n','g'), '<br>');
            $('#product_text').text(selectedName);
            $('#details_text').html(new_details);
          
          }
    });
  
    
  });

  

});

function toast(pesan){
  M.toast({html: pesan});
}







