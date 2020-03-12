

$(document).ready(function(){    

    $('.modal').modal(); 
    
    $('#daftarForm').on('submit', function(event){
        event.preventDefault();
        var values = {};
        $.each($('#daftarForm').serializeArray(), function(i, field) {
            values[field.name] = field.value;
        });      
        $.post('/daftar', values)
        .done(function( data ) {
            // toast(data);
           
            if(data === 'berhasil'){
                toast('Pendaftaran Berhasil!');
                delayRedirect('/login', 2);
            }else if(data === 'unmatch'){
                toast('Password Tidak Sama!');            
            }else{
                toast(data);
            }
        });
        
    });


    
    
});



