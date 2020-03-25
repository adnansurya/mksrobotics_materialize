

var auth;
var db;
function loadInit(){
  auth = firebase.auth();
  db = firebase.database();
 
}

function cekLogin(roles){

  auth.onAuthStateChanged(function(user) {
    let loggedUser = null;
    if (user) {
        
     db.ref('users/'+ user.uid).once('value').then(function(snapshot){
        loggedUser = snapshot.val();
        
        if(roles.indexOf(loggedUser.roles) == -1 &&  roles.indexOf('all') == -1){
          location.href = '/login';
        }

        return loginMenu(loggedUser);
       
      }).then(function(){
        return loadPlugin();
      });
    }else{
      
      if( roles.indexOf('all') == -1 ){
        location.href = '/login';
      }else{
        loginBtn();
      }
     
    } 
       
  });
 
  
}

function logout(){
  auth.signOut().then(function() {
    // delayRedirect('/login', 1);
    return delayRedirect('/login', 1);
    
  }).catch(function(error) {
   toast(error.message)
   console.log(error);
   
  });
  
}




function loginMenu(user){

  // console.log(loggedUser.roles);
  if(user){
    if(user.roles == 'admin'){
      $('#menuDiv').append(`
          <li><a class="dropdown-trigger" data-target="dropdown2"><i class="material-icons left">stars</i>Admin<i class="material-icons right">arrow_drop_down</i></a></li>                  
          <ul id="dropdown2" class="dropdown-content">    
            <li><a href="/admin/product">Product</a></li>
          </ul> 
      `);
      $('#nav-mobile').append(`
        <li><div class="divider"></div></li>
        <li><a class="subheader">Admin</a></li>
        <li><a href="/admin/product"><i class="material-icons left">list_alt</i>List Produk</a></li>  
      `);
    }    
    $('#menuDiv').append(`
      <li><a class="dropdown-trigger" data-target="dropdown1"><i class="material-icons left">face</i>Hai, `+user.nickname+`  <i class="material-icons right">arrow_drop_down</i></a></li>                  
      <ul id="dropdown1" class="dropdown-content">
        <li><a href="#!">Profil</a></li>            
        <li class="divider"></li>
        <li><a href="#" onclick="logout()">Logout</a></li>
      </ul> 
    `);
    $('#mobileDiv').append(`
      <a href="#user"><img class="circle white" src="/img/logo.png"></a>      
      <a href="#name"><span class="white-text name">`+ user.nama+` </span></a>
      <a href="#email"><span class="white-text email">`+user.roles+` </span></a>
    `);
    $('#nav-mobile').append(`
      <li><div class="divider"></div></li>
      <li><a class="subheader">Akun</a></li>        
      <li><a href="#"><i class="material-icons left">face</i>Profil</a></li>                  
      <li><a href="#" onclick="logout()"><i class="material-icons left">exit_to_app</i>Logout</a></li>
  `);
   
  }else{
   
    
   loginBtn();
  } 
}

function loginBtn(){
  $('#menuDiv').append(`
    <li><a href="/login"><i class="material-icons left">account_circle</i>Login</a></li> 
  `);
  $('#mobileDiv').append(`
    <a href="/login"><img class="circle white" src="/img/logo.png"></a>
    <a href="/login"><span class="white-text name">Makassar Robotics</span></a>      
    <a href="/login"><span class="white-text email">Login</span></a>
  `);       
}


function loadPlugin(){
  $('.sidenav').sidenav();
  $('select').formSelect();
  // $('.modal').modal(); 
  $(".dropdown-trigger").dropdown({
    hover :true
  });
}

function toast(pesan){
  M.toast({html: pesan});
}

function delayRedirect(link, seconds){
  setTimeout(openLink(link), seconds*1000);
}

function openLink(url){
  location.href = url;
}

function capitalFirstLetter(word){
  return word.charAt(0).toUpperCase() +word.slice(1)
}

const rupiah = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 0
})







