function loadInit(){
  $('.sidenav').sidenav();
  $('select').formSelect();
  $('.modal').modal(); 
  $(".dropdown-trigger").dropdown({
    hover : true
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







