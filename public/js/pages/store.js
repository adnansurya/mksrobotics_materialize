

$( document ).ready(function() {
  loadInit();
  cekLogin(['all']);
  loadPlugin();
  let totalProduct, totalPage, lastUpdated;
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
    }else if(category === "SEARCH"){
      db.ref('product_data').orderByChild('name').startAt(search_query).endAt(search_query+"\uf8ff").once("value").then(function(snapshot){    
        allSnap = clone(snapshot.val());
        console.log(allSnap);
        if(allSnap != null){
          appendProduct(allSnap);  
        }else{
          $('#productLoad').addClass('hide'); 
        }
                
                 
      });
    }else{
      // $('#itemPerPage').parent().parent().closest('div').addClass('hide');      
      db.ref('product_data').orderByChild('category').equalTo(category).once('value').then(function(snapshot){    
        allSnap = clone(snapshot.val());        
        appendProduct(allSnap);
      });
    }   
  }
  let allDesc;
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
    
     db.ref('description').once('value').then(function(snapshot){        
        allDesc = clone(snapshot.val());

    }).then(function(){

      Object.keys(all).some(function(value, index, _arr) {
        let data = all[value];
        if(category === 'SEMUA' || (category !== 'SEMUA' &&  index>= startItem)){
 
       
        if(allDesc[data.uxid] == null || allDesc[data.uxid] == undefined){
          desc = {
                  picture :'/img/logo.png',
                  details : 'Belum Tersedia'
                } 
        }else{
          desc = allDesc[data.uxid];
        }
           
           $('#productDiv').append(
             `<div class="col l3 m4 s6">
               <div class="card hoverable">
                 <div class="card-image grey">
                   <div class="valign-wrapper my-responsive-card">
                    <img src="`+desc.picture+`" alt="`+data.name+`" class="responsive-img materialboxed" data-caption="`+data.name+`" style="padding: 10px;">
                   </div>
                  
                   <a data-target="modal2" data-id="`+data.uxid+`" data-name="`+data.name+`" class="btn-floating halfway-fab waves-effect waves-light green modal-trigger my-details" style="right: 12px;"><i class="material-icons">list</i></a>                                                           
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
    }).then(function(){
      $('.materialboxed').materialbox();
      $('.fixed-action-btn').floatingActionButton();
      $('#productLoad').addClass('hide'); 
    });
    
   
    
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

  let selectedId, selectedName, selectedDetails;
  $('#productDiv').on('click','a', function(){  
    selectedId = $(this).attr('data-id');
    selectedName = $(this).attr('data-name');

    if(allDesc[selectedId] == null || allDesc[selectedId] == undefined){
      selectedDetails = 'Belum ada keterangan';  
            
    }else{
      if(allDesc[selectedId]['details'] != null && allDesc[selectedId]['details'] != undefined){
        selectedDetails = allDesc[selectedId]['details'];
        console.log(selectedDetails);
      }else{
       selectedDetails = 'Belum ada keterangan'; 
      }
    }
  
    
  });

  $('#modal2').modal({
    'onOpenStart': 
        function(){  
         
        
          $('#product_text').text(selectedName);
          $('#details_text').val(selectedDetails);
          M.textareaAutoResize($('#details_text'));
        }
  });

});

function toast(pesan){
  M.toast({html: pesan});
}







