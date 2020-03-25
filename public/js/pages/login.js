

$(document).ready(function(){  
    loadInit();  

    auth.onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
        //   location.href = '/admin';
        console.log(user);
        
          // ...
        } else {
          // User is signed out.
          // ...
          toast('Silahkan Login');
          
        }
      });
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
                delayRedirect('/login', 1);
            }else if(data === 'unmatch'){
                toast('Password Tidak Sama!');            
            }else{
                toast(data);
            }
        });
        
    });

    $('#loginForm').on('submit', function(event){
        event.preventDefault();
        var values = {};
        $.each($('#loginForm').serializeArray(), function(i, field) {
            values[field.name] = field.value;
        });
        console.log(values);
        

        auth.signInWithEmailAndPassword(values.email, values.password).catch(function(error){
            toast(error.code + ':' +  error.message);
        }).then(function(){
            let user = auth.currentUser;
            if(user){
                location.href = '/admin';
                // user.getIdToken(true).then(function(idToken){
                //     $.post('/cek_token', {id_token: idToken})
                //     .done(function(data){
                //         if(data === 'login_success'){
                //             auth.signOut().then(function(){
                //                 toast('Login Berhasil!');
                //                 location.href = '/admin';
                //             }).catch(function(error){
                //                 toast(error.code + ':' + error.message);
                //             });
                //         }else{
                //             toast(data);
                //         }
                       
                //     });
                // }).catch(function(error){
                //     toast(error.code + ':' + error.message);
                // });
                
            }else{
                toast('User Tidak Ditemukan!')
            }
        });
        return false;
                   
        
    });


    
    
});



