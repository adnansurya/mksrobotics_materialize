$(document).ready(function() {
    loadInit();
    cekLogin(['admin']);
    loadPlugin();
    
    
    $('#picture_text').val("");
    $('#details_text').val("");
    $('#product_pic').attr("alt", "");
    $('#product_pic').attr("src", "");

    let selectedId, selectedName, selectedAct;
    let selectedDesc = null;
    let modal1, modal2;
    const db = firebase.database();
    let perPage = 10;
    let table
   
    let url = "/api/all_product";  
    

    initTable(perPage);

    function initTable(rowPerPage){
        table = $('#product_table').DataTable( {
        
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
                        return `
                        <button class="waves-effect waves-light btn btn-small" data-act="edit" data-id="`+data+`" data-name="`+row['name']+`">Edit</button><br>
                        <button class="waves-effect waves-light btn orange darken-3 btn-small" data-act="transit" data-id="`+data+`" data-name="`+row['name']+`">Transit</button>`;
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
            responsive: true,
            "dom": '<"row"<"#filtering.col s12 m6"><"col s12 m6"f>r>tip',
            "pageLength": rowPerPage          
            
        } );
    }

    $("#filtering").append(`
        <form id="filterDiv" action="#">
            <div class="row">
                <div class="col s12">
                    <p "margin-bottom: 0px;margin-top: 0px;">Produk Per halaman</p>
                </div>
                <div class="col s3">
                    <p>
                        <label>
                        <input name="group1" type="radio" value="10" checked />
                        <span>10</span>
                        </label>
                    </p>
                </div>
                <div class="col s3">
                    <p>
                        <label>
                        <input name="group1" type="radio" value="25" />
                        <span>25</span>
                        </label>
                    </p>
                </div>
                <div class="col s3">
                    <p>
                        <label>
                        <input name="group1" type="radio" value="50" />
                        <span>50</span>
                        </label>
                    </p>
                </div>
                <div class="col s3">
                    <p>
                        <label>
                        <input name="group1" type="radio" value="100" />
                        <span>100</span>
                        </label>
                    </p>
                </div>
            </div>
        </form>
       
    `);
    

    $('#filterDiv input').on('change', function() {
        perPage =  parseInt($('input[name=group1]:checked', '#filterDiv').val());
      
        
        $('#product_table').DataTable().page.len(perPage).draw();
        
        
     });

  
    
  
    table.on("click", "button", function () {            
        selectedId = $(this).attr('data-id');
        selectedName = $(this).attr('data-name');
        selectedAct = $(this).attr('data-act');       
        
        if(selectedAct == "edit"){
            $('#uxid_val').val(selectedId);
            $('#nama_text').val(selectedName);
    
            
            M.textareaAutoResize($('#nama_text')); 
            
            
            db.ref('description/'+selectedId).once('value').then(function(snapshot){
                selectedDesc = snapshot.val();
                
                
                $('#modal1').modal({
                    'onOpenStart': 
                        function(){   
                            
                                             
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
                
                return initModal();
            });
        }else if(selectedAct == "transit"){
             
            $('#modal2').modal({               
                'onCloseStart':
                    function(){
                        $('#nama_produk_text').val("");
                        $('#uxid_transit').val("");
                        $('#jumlah_text').val("");                     
                }
            });   
                        
            $('#nama_produk_text').val(selectedName);
            $('#uxid_transit').val(selectedId);
            modal2 = M.Modal.getInstance( $('#modal2'));
            modal2.open();
        }
       
        
    });

    function initModal(){            
        modal1 = M.Modal.getInstance( $('#modal1'));
        modal1.open();
    }

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

    $('#transitProduk').on('submit', function(event){
        event.preventDefault();
        var values = {};
        $.each($('#transitProduk').serializeArray(), function(i, field) {
            values[field.name] = field.value;
        });

        // var newPostKey = db.ref('transit').push().key;

        db.ref('transit').push({
            uxid : values.uxid,
            nama : values.nama_produk,
            jumlah : values.jumlah
        }).catch(function(error){
            toast(error.message);
        }).then(function(){
            toast('Produk Transit berhasil ditambah!');
            modal2.close();    
        });

    });

   


   

    $('#closeModalBtn').on('click', function(){
        modal1.close();
       
    });
    $('#closeModalBtn2').on('click', function(){
        modal2.close();
       
    });
   
  
   
    $('#picture_text').change(function(){
        pic_url = $(this).val();              
        $('#product_pic').attr("src", pic_url);
        $('#product_pic').attr("alt", pic_url);
        $('.materialboxed').materialbox();               
    });
    
} );