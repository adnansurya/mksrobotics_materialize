var express = require('express');
var router = express.Router();
const web_name = 'Makassar Robotics';


let logger = function(req, res, next) {

  console.log('ADMIN : ' + req.session.logged_name);
    
  if(req.session.logged_name && req.session.logged_uid){

    console.log(new Date(), req.url)

    next();
  }else{
    res.redirect('/login');
  }
   
} 

router.use('/static', express.static('../public'));

router.get('/',logger, (req,res) => {
    res.render('pages/admin', {page : 'admin', web_name : web_name});    
});

module.exports = router;