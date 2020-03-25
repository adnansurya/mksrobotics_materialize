let loggedUser = null;

var auth;
var db;
function loadInit(){
  auth = firebase.auth();
  db = firebase.database();
 
}

function cekLogin(roles){

  auth.onAuthStateChanged(function(user) {
    if (user) {
  
     db.ref('users/'+ user.uid).once('value').then(function(snapshot){
        loggedUser = snapshot.val();
        if(roles.indexOf(loggedUser.roles) == -1 && roles.indexOf('all') == -1 ){
          location.href = '/login';
        }
       
      }).then(loginMenu).then(loadPlugin);
    } 
       
  });
}

function logout(){
  auth.signOut().then(function() {
    // delayRedirect('/login', 1);
    console.log(auth.currentUser);
    
  }).catch(function(error) {
   toast(error.message)
   console.log(error);
   
  });
  
}

// $('#logoutBtn').on('click', function(){
//   logout();
// });


function loginMenu(){

  // console.log(loggedUser.roles);
  if(loggedUser){
    if(loggedUser.roles == 'admin'){
      $('#menuDiv').append(`
          <li><a class="dropdown-trigger" data-target="dropdown2"><i class="material-icons left">stars</i>Admin<i class="material-icons right">arrow_drop_down</i></a></li>                  
          <ul id="dropdown2" class="dropdown-content">    
            <li><a href="/admin/product">Product</a></li>
          </ul> 
      `);
    }    
    $('#menuDiv').append(`
      <li><a class="dropdown-trigger" data-target="dropdown1"><i class="material-icons left">face</i>Hai, `+loggedUser.nickname+`  <i class="material-icons right">arrow_drop_down</i></a></li>                  
      <ul id="dropdown1" class="dropdown-content">
        <li><a href="#!">Profil</a></li>            
        <li class="divider"></li>
        <li><a href="/logout">Logout</a></li>
      </ul> 
    `);
  }else{
    $('#menuDiv').append(`
      <li><a href="/login"><i class="material-icons left">account_circle</i>Login</a></li> 
    `);
  } 
}

function loadMenu(){
  $('#menuDiv').append(`
    <li><a href="/login"><i class="material-icons left">account_circle</i>Login</a></li> 
  `);
}


function loadPlugin(){
  $('.sidenav').sidenav();
  $('select').formSelect();
  $('.modal').modal(); 
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







