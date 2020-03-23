var express = require('express');
var router = express.Router();
const web_name = 'Makassar Robotics';


let logger = function(req, res, next) {

  // console.log(isLogin.name);
    
  if(req.session.user){

    // console.log(new Date(), req.url)

    next();
  }else{
    res.redirect('/login');
  }
   
} 

router.use('/static', express.static('../public'));

router.get('/', logger, (req,res) => {
    // console.log("LOGGED :"  + req.session.uid);
        
    res.render('pages/admin', {page : 'admin', web_name : web_name, isLogin : req.session.user});    
});




module.exports = router;