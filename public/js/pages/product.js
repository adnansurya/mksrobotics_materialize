$(document).ready(function() {
    let selectedId, selectedName;
    let table = $('#product_table').DataTable( {
        "ajax": "http://localhost:5000/api/all_product",
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
                    return `<button class="waves-effect waves-light btn btn-small modal-trigger uxid" href="#modal1" data-id="`+data+`" data-name="`+row['name']+`">Edit</button>`;
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
        
    });

    $('#modal1').modal({
        'onOpenStart': 
            function(){                        
                $('#nama_text').val(selectedName);
                $('#uxid_val').val(selectedId);
            }
    });
   
    $('#picture_text').change(function(){
        pic_url = $(this).val();              
        $('#product_pic').attr("src", pic_url);
        $('.materialboxed').materialbox();               
    });
    
} );