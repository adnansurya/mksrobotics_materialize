const functions = require('firebase-functions');
const express = require('express');
var path = require("path");
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session')
var randomstring = require("randomstring");
var admin = require('firebase-admin');

var path = require('path');
var serviceAccount = require(path.join(__dirname, 'mksrobotics-firebase-adminsdk-ns7lo-c8869b32c9.json'));


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://mksrobotics.firebaseio.com",
  databaseAuthVariableOverride: null
});

const db = admin.database();
const auth = admin.auth();

const app = express();
const web_name = 'Makassar Robotics';

app.use('/static', express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.set('trust proxy', 1);
app.use(cookieSession({
    name: 'session', 
    secret: randomstring.generate(),
    maxAge: 60 * 60 * 1000
       
}));

app.get('/', (req,res) => {
    res.render('pages/product', {page : 'produk', web_name : web_name});    
});

app.get('/login', (req,res) => {
    console.log('LOGIN : ' + req.session.logged_uid);
    
    if(req.session.logged_uid && req.session.logged_name){
        res.redirect('/admin');
    }else{
        res.render('pages/login', {page : 'login', web_name : web_name});    
    }
    
});

app.post('/cek_token', (req,res) =>{
    let token = req.body.id_token;
 
    auth.verifyIdToken(token)
    .then(function(decodedToken) {
        let uid = decodedToken.uid;
        auth.getUser(uid)
        .then(function(userRecord) {

            // See the UserRecord reference doc for the contents of userRecord.
            //   console.log('Successfully fetched user data:', userRecord.toJSON());
          user = userRecord.providerData[0];

          req.session.logged_uid = uid;
          req.session.logged_name = user.displayName;
          res.send('login_success');        
        })
        .catch(function(error) {
          console.log('Error fetching user data:', error);

        });
      
    }).catch(function(error) {
        // Handle error
        console.log('error verify' + error);
        res.redirect('/login');
    });

});

app.get('/blank', (req,res) => {
    res.render('pages/blank', {page : 'blank', web_name : web_name});    
});


const adminpath = require('./admin.js');
app.use('/admin', adminpath);

exports.apps = functions.https.onRequest(app);

