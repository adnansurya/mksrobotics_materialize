

$(document).ready(function(){
    const auth = firebase.auth();

    $('.modal').modal();  
    
    let nama, nickname, hp, job, instansi, email, password, password2;
    
    $('#daftar_btn').on('click', function(){       

        nama = $('#nama_text').val();
        nickname = $('#nickname_text').val();
        hp = $('#hp_text').val();
        job = $('#job_text').val();
        instansi = $('#instansi_text').val();
        email = $('#email_new_text').val();
        password = $('#password_new_text').val();
        password2 = $('#repeat_password_text').val();

        // alert(nama+hp+job+instansi+email+password+password2);
        if(isKosong() === false){
            
            if(password === password2){         
                createUser(email, password);

            }else{
                toast('Password tidak sama!');
            }
        }
     

    });

    function createUser(email, password){
        let success = true;
        auth.createUserWithEmailAndPassword(email, password).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            toast(errorCode + ' : ' + errorMessage);
            success = false;
            // ...
        }).then(function(){
            if(success){               
                cekUser();
            }
        });        
      
    }

    function cekUser(){
        auth.onAuthStateChanged(function(user) {
            if (user) {          
                user.updateProfile({
                    displayName: nickname

                }).then(function(){
                    toast(user.displayName);
                    isiData(user, hp, job, instansi);

                }).catch(function(error){
                    toast(error.message);

                });
            }
            
        });
    }


    function isiData(user, hp, job, instansi){
        
        let success = true;
        db.ref('users/' + user.uid).set({
            email : user.email,
            nama :  nama,
            nickname : user.displayName,
            hp : hp,
            pekerjaan : job,
            instansi : instansi,
            role : 'customer'
        }).catch(function(error){        
            toast(error.message); 
            success = false;                                                   
            
        }).then(function(){
            if(success){
                auth.signOut().then(function() {                    
                    toast('Pendaftaran Berhasil!');
                    location.href = '/login';   
    
                }).catch(function(error) {
                    toast(error.message);
    
                });
            }
           
        });

    }
    


    function isKosong(){
        let empty = false;
        let form = $('.daftar');         

        for(i=0; i<form.length; i++){
            let keterangan = form[i].labels[0].textContent;
            let isinya = form[i].value;        
            if(isinya == ""){
                empty = true;

                toast(keterangan + " tidak boleh kosong!");
                return empty;
            }
        }
        return empty;
          
    }


    $('#login_btn').on('click', function(){
        let success = true;
        email = $('#email_txt').val();
        password = $('#password_txt').val();

        auth.signInWithEmailAndPassword(email, password).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            toast(errorCode + ' : ' + errorMessage);
            success = false;
            // ...
        }).then(function(){
            if(success){
               let user = auth.currentUser;
                if (user) {          
                    user.getIdToken(/* forceRefresh */ true).then(function(idToken) {

                        $.post('/cek_token', {id_token : idToken})
                        .done(function( data ) {
                            if(data === 'login_success'){
                                auth.signOut().then(function() {                    
                                    toast('Login Berhasil!');
                                    location.href = '/admin';
                    
                                }).catch(function(error) {
                                    toast(error.message);
                                    location.href = '/login';
                    
                                });
                                
                            }
                          });
                        
                    }).catch(function(error){
                        toast(error.message);
                    });
                }else{
                    toast('tidak ada user');
                }
            }
        });
    });
});



