$(document).ready(function() {
    
    $('#product_table').DataTable( {
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
            { "data": "uxid" }
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
        
    } );
    $('select').formSelect();
} );