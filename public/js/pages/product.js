$(document).ready(function() {
    
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
            { "data" : null}
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
            },
            {
                "targets": -1,
                "data": null,
                "defaultContent": `<button class="waves-effect waves-light btn btn-small">Edit</button>`
            }            
        ],
        responsive: true
        
    } );
    $('select').formSelect();

    $('#product_table tbody').on( 'click', 'button', function () {
        let data = table.row( $(this).parents('tr') ).data();
        

        let modal1 = M.Modal.getInstance($('#modal1'));
        $('#uxid_text').val(data.uxid);
        $('#uxid_val').val(data.uxid);
        modal1.open();
    } );
} );