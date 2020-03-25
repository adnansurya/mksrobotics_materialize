$(document).ready(function() {
    loadInit();
    cekLogin(['admin']);
    loadPlugin();
    
    $('#picture_text').val("");
    $('#details_text').val("");
    $('#product_pic').attr("alt", "");
    $('#product_pic').attr("src", "");

    let selectedId, selectedName;
    let selectedDesc = null;
    let modal1;
    const db = firebase.database();
    // let url = "http://localhost:5000/api/all_product";  //test
    let url = "https://mksrobotics.web.app/api/all_product";  //deploy
    let table = $('#product_table').DataTable( {
        
        "ajax" : url,
        "columns": [
            { "data": "name" },
            { "data": "category" },
            { 
                data: 'basePrice',
                render: function ( data, type, row ) {
                    return rupiah.format(data);
                } 
            },                      
            { 
                data: 'sellPrice',
                render: function ( data, type, row ) {
                    return rupiah.format(data);
                } 
            },
            { "data": "stockAmount" },
            { "data": "unit" },
            { "data": "code" },   
            { "data": "type" },          
            { "data": "uxid" },
            { 
                data: 'uxid',
                render: function ( data, type, row ) {
                    return `<button class="waves-effect waves-light btn btn-small" data-id="`+data+`" data-name="`+row['name']+`">Edit</button>`;
                } 
            }
        ],
        "columnDefs": [
                     
            {
                "targets": [ 6 ],
                "visible": false,
                "searchable": true
            },
            {
                "targets": [ 7 ],
                "visible": false
            },
            {
                "targets": [ 8 ],
                "visible": false
            }         
        ],
        responsive: true
        
    } );
   
    $('select').formSelect();
    
  
    table.on("click", "button", function () {            
        selectedId = $(this).attr('data-id');
        selectedName = $(this).attr('data-name');
   
        $('#uxid_val').val(selectedId);
      
        
        
        db.ref('description/'+selectedId).once('value').then(function(snapshot){
            selectedDesc = snapshot.val();
            

            
            
            return initModal();
        });
        
    });

    $('#editProduk').on('submit', function(event){
        event.preventDefault();
        var values = {};
        $.each($('#editProduk').serializeArray(), function(i, field) {
            values[field.name] = field.value;
        });

        db.ref('description/'+ values.uxid).set({
            picture : values.picture,
            details : values.details.trim()
        }).catch(function(error){
            toast(error.message);
        }).then(function(){
            toast('Data Produk berhasil diubah!');
            modal1.close();
        });

    });

    $('#modal1').modal({
        'onOpenEnd': 
            function(){   
                $('#nama_text').val(selectedName);
                M.textareaAutoResize($('#nama_text')); 
                                 
                if(selectedDesc != null){
                         
                     
                    $('#picture_text').val(selectedDesc.picture);
                    M.textareaAutoResize($('#picture_text'));
                    $('#details_text').val(selectedDesc.details.trim());
                    M.textareaAutoResize($('#details_text'));
                    $('#product_pic').attr("alt", selectedDesc.picture);
                    $('#product_pic').attr("src", selectedDesc.picture);
                    $('.materialboxed').materialbox();
                   
                }
               
            },
        'onCloseStart':
            function(){
            
                $('#picture_text').val("");
                $('#details_text').val("");
                $('#uxid_val').val("");
                $('#nama_text').val("");
                $('#product_pic').attr("alt", "");
                $('#product_pic').attr("src", "");
                M.textareaAutoResize($('#picture_text'));
                M.textareaAutoResize($('#details_text'));
                M.textareaAutoResize($('#nama_text')); 
                
            }
    });


    function initModal(){            
        modal1 = M.Modal.getInstance( $('#modal1'));
        modal1.open();
    }

    $('#closeModalBtn').on('click', function(){
        modal1.close();
    });
   
  
   
    $('#picture_text').change(function(){
        pic_url = $(this).val();              
        $('#product_pic').attr("src", pic_url);
        $('#product_pic').attr("alt", pic_url);
        $('.materialboxed').materialbox();               
    });
    
} );