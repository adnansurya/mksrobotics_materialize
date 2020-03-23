$( document ).ready(function() {

  $('.sidenav').sidenav();
  $('select').formSelect();
  $('.modal').modal();
  $(".dropdown-trigger").dropdown({
    hover : true
  });

});



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







