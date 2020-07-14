var express = require('express');
var router = express.Router();
const web_name = 'Makassar Robotics';

var path = require('path');
// let db_admin;

router.use('/static', express.static(path.join(__dirname, '../public')));

let logger = function(req, res, next) {

  // console.log(isLogin.name);
    
  if(req.session.user){

    // console.log(new Date(), req.url)

    next();
  }else{
    res.redirect('/login');
  }
   
}

let log_admin = function(req, res, next) {

  // console.log(isLogin.name);
  // console.log(new Date(), req.url)
    
  if(req.session.user){
    if(req.session.user.roles === 'admin'){
      next();
    }else{
      res.redirect('/login');
    }  
  }else{
    res.redirect('/login');
  }
   
} 



router.get('/', (req,res) => {
    // console.log("LOGGED :"  + req.session.uid);
        
    res.render('pages/admin', {page : 'admin', web_name : web_name});    
});

router.get('/product', (req,res) => {
  // console.log("LOGGED :"  + req.session.uid);
      
  res.render('pages/product', {page : 'product', web_name : web_name});    
});


router.get('/transit', (req,res) => {
  // console.log("LOGGED :"  + req.session.uid);
      
  res.render('pages/transit', {page : 'transit', web_name : web_name});    
});



router.post('/edit_product', (req,res) =>{
  let data = req.body;
  console.log(data);
  
  
  db_admin.ref('description/'+ data.uxid).set({
      picture : data.picture,
      details : data.details
  }).catch(function(error){
      res.send(error.message);
  }).then(function(){
      res.redirect('/admin/product');
  });
});




module.exports = router;
// module.exports = function(db){
//   db_admin = db;
//   // do as you wish
//   // this runs in background, not on each
//   // request

//   return router;
// }
