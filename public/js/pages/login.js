

$(document).ready(function(){  
    loadInit();
    loadPlugin()  

    let daftar = false;
    auth.onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
          if(!daftar){
            location.href = '/admin';
          }
         
        // console.log(user);
        
          // ...
        } else {
          // User is signed out.
          // ...
          toast('Silahkan Login');
          
        }
      });
    $('.modal').modal(); 
    
    $('#daftarForm').on('submit', function(event){
        daftar = true;
        event.preventDefault();
        var values = {};
        $.each($('#daftarForm').serializeArray(), function(i, field) {
            values[field.name] = field.value;
           
        });      
              
        auth.createUserWithEmailAndPassword(values.email_new, values.password_new).catch(function(error) {
          
            toast(error.code + ":" + error.message);

        }).then(function(){
            let new_user = auth.currentUser;

            let email = values.email_new;
            delete values.email_new;
            delete values.password_new;
            delete values.repeat_password;
            values.email = email;
            values.roles = 'customer';
                     
            return db.ref('users/'+ new_user.uid ).set(values).catch(function(error){
                toast(error.code + ' : ' + error.message);   
            });
        }).then(function(){
            auth.signOut().catch(function(error) {
                toast(error.message)                           
            });
            toast('Pendaftaran Berhasil');
           
            $('#daftarForm')[0].reset();
          
            let modal1 = M.Modal.getInstance($('#daftar_modal'));
            modal1.close();            
            
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



