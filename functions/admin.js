var express = require('express');
var router = express.Router();
const web_name = 'Makassar Robotics';

var path = require('path');

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



router.get('/', logger, (req,res) => {
    // console.log("LOGGED :"  + req.session.uid);
        
    res.render('pages/admin', {page : 'admin', web_name : web_name, isLogin : req.session.user});    
});

router.get('/product', log_admin, (req,res) => {
  // console.log("LOGGED :"  + req.session.uid);
      
  res.render('pages/product', {page : 'product', web_name : web_name, isLogin : req.session.user});    
});




module.exports = router;