$(document).ready(function() {

    loadInit();
    cekLogin(['admin']);
    loadPlugin();
    let url = "/api/all_transit";  
    let selectedId;

    table = $('#transit_table').DataTable( {
        
        
        "ajax" : url,
        "columns": [
            { "data": "id" },
            { "data": "nama" },
            { "data": "uxid" },
            { "data": "jumlah" },
            { 
                data: 'id',
                render: function ( data, type, row ) {
                    return `
                    <button class="waves-effect waves-light btn red btn-small" data-id="`+data+`"><i class="material-icons left">delete</i>Hapus</button>`;                    
                } 
            }
        ],
        "columnDefs": [
                     
            {
                "targets": [0],
                "visible": false,
                "searchable": false
            },
            {
                "targets": [2],
                "visible": false,
                "searchable": false
            }
        ],
        responsive: true,
        "dom": '<"row"<"#filtering.col s12 m6"><"col s12 m6"f>r>tip'
    });

    

    table.on("click", "button", function () {            
        selectedId = $(this).attr('data-id');
        db.ref('transit/'+selectedId).remove();
        toast('Produk Transit berhasil dihapus!');
        location.href = "/admin/transit";
        
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
            location.href = '/admin/transit';    
        });

    });

    $('#addTransitBtn').click(function(){
        $('#modal2').modal({               
            'onCloseStart':
                function(){
                    $('#nama_produk_text').val("");
                    $('#uxid_transit').val("");
                    $('#jumlah_text').val("");                     
            }
        });                              
        modal2 = M.Modal.getInstance( $('#modal2'));
        modal2.open();
    });

    $('#closeModalBtn2').on('click', function(){
        modal2.close();
       
    });
   

});