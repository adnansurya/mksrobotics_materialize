const functions = require('firebase-functions');
const express = require('express');
var path = require("path");
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session')
var randomstring = require("randomstring");
var firebase_admin = require('firebase-admin');

var path = require('path');
var serviceAccount = require(path.join(__dirname, 'mksrobotics-firebase-adminsdk-ns7lo-c8869b32c9.json'));


firebase_admin.initializeApp({
  credential: firebase_admin.credential.cert(serviceAccount),
  databaseURL: "https://mksrobotics.firebaseio.com",
  databaseAuthVariableOverride: null
});

const db = firebase_admin.database();
const auth = firebase_admin.auth();

const app = express();
const web_name = 'Makassar Robotics';



app.use('/static', express.static(path.join(__dirname, '../public')));
app.set('view engine', 'ejs');

app.set('trust proxy', 1);
app.use(cookieSession({
    name: 'session', 
    secret: randomstring.generate(),
    maxAge: 60 * 60 * 1000
       
}));

let users;


app.get('/', (req,res) => {
    res.render('pages/store', {page : 'home', web_name : web_name, isLogin : req.session.user});    
});

app.get('/store', (req,res) => {
    res.render('pages/store', {page : 'store', web_name : web_name, isLogin : req.session.user});    
});

app.get('/project', (req,res) => {
    res.render('pages/blank', {page : 'project', web_name : web_name, isLogin : req.session.user});    
});


app.get('/login', (req,res) => {
    // console.log('LOGIN : ' + req.session.logged_name);
    
   
    res.render('pages/login', {page : 'login', web_name : web_name});    
   
    
});


app.post('/daftar', (req,res) =>{
    // auth.createUser
    let dataUser = req.body;
    dataUser.roles = 'customer';
    let email = dataUser.email_new;
    let password = dataUser.password_new;
    let password2 = dataUser.repeat_password;
    delete dataUser.email_new;
    delete dataUser.password_new;
    delete dataUser.repeat_password;
    dataUser.email = email;
    
    
    if(password === password2){        
        auth.createUser({
            email : email,
            password : password,
            displayName : dataUser.nickname,
        }).catch(function(error) {
                    // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            res.send(errorCode + ' : ' + errorMessage);           
        }).then(function(userRecord){
            db.ref('users/'+ userRecord.uid ).set(dataUser).catch(function(error){
                res.send(error.code + ' : ' + error.message);   
            }).then(function(){
                res.send('berhasil');
            });
            
        });
    }else{
        res.send('unmatch');
    }

    
    
});

app.post('/cek_token', (req,res) => {
    let token = req.body.id_token;
 
    auth.verifyIdToken(token)
    .then(function(decodedToken) {
        let uid = decodedToken.uid;
        // console.log(uid);
        
        // req.session.uid = uid; 
        // auth.getUser(uid)
        // .then(function(userRecord) {
        // // See the UserRecord reference doc for the contents of userRecord.
        //   console.log('Successfully fetched user data:', userRecord.toJSON());
        //   user = userRecord.providerData[0];
                    
        // })
        // .catch(function(error) {
        //   console.log('Error fetching user data:', error);
        //   res.send(error.code + ':' + error.message);

        // });
        db.ref('users/'+ uid).once('value').then(function(snap){
            req.session.user = snap.val();
            
            res.send('login_success');  
        });
       
      
    }).catch(function(error) {
        // Handle error
        console.log('error verify' + error);
        res.send(error);
    });

});

app.get('/logout', (req,res) => {
    // res.render('pages/blank', {page : 'blank', web_name : web_name}); 
    delete req.session.user;
    
    res.redirect('/login');

});




app.get('/blank', (req,res) => {
    res.render('pages/blank', {page : 'blank', web_name : web_name});    
});

app.get('/api/all_product', function(req, res){
    var items = [];
    var products = {
        data : []
    };
    let product_data, description;
    
    db.ref('product_data').once('value').then(function(snapshot){
        product_data = snapshot.val();

        return db.ref('description').once('value');    
        
    }).then(function(snapshot){ 
        description = snapshot.val();

        for(var product in product_data){
            let oneProduct = product_data[product];
            let uxid = oneProduct.uxid;

            if(description[uxid]){
                oneProduct.details = description[uxid].details;
                oneProduct.picture = description[uxid].picture;                 
            }
            products['data'].push(oneProduct);                
        }
    
    
        return res.send(JSON.stringify(products));    
    });    
});

app.get('/api/search_product/:keyword', function(req, res){
    let keyword = req.params.keyword.toLowerCase();
    var items = [];
    var products = {
        data : []
    };
    let product_data, description;
    db.ref('product_data').once('value').then(function(snapshot){
        product_data = snapshot.val();

        return db.ref('description').once('value');    
    }).then(function(snapshot){ 
        description = snapshot.val();

       
        for(var product in product_data){
            let oneProduct = product_data[product];
            let uxid = oneProduct.uxid;

            if(description[uxid]){
                oneProduct.details = description[uxid].details;
                oneProduct.picture = description[uxid].picture;                 
            }
            if(oneProduct.name.toLowerCase().search(keyword) > -1){
                products['data'].push(oneProduct);
            }
                            
        }
      
        res.send(JSON.stringify(products));
    });
});

app.get('/api/product_page/:start/:limit', function(req, res){
    let start = req.params.start;
    let limit = parseInt(req.params.limit);
    var items = [];
    var products = {
        data : []
    };
    
    let product_data, description;
    db.ref('product_data').orderByKey().startAt(start).limitToFirst(limit).once('value').then(function(snapshot){  
        
        product_data = snapshot.val();

        return db.ref('description').once('value');
    }).then(function(snapshot){ 
        description = snapshot.val();

        for(var product in product_data){
            let oneProduct = product_data[product];
            let uxid = oneProduct.uxid;

            if(description[uxid]){
                oneProduct.details = description[uxid].details;
                oneProduct.picture = description[uxid].picture;                 
            }
            products['data'].push(oneProduct);                
        }
    
        return res.send(JSON.stringify(products));    
    });
});

app.get('/api/filter_product/:category', function(req, res){
    let category = req.params.category;
    var items = [];
    var products = {
        data : []
    };
    let product_data, description;
    db.ref('product_data').orderByChild('category').equalTo(category).once('value').then(function(snapshot){         
            product_data = snapshot.val();

            return db.ref('description').once('value');    
            
        }).then(function(snapshot){ 
            description = snapshot.val();

            for(var product in product_data){
                let oneProduct = product_data[product];
                let uxid = oneProduct.uxid;
    
                if(description[uxid]){
                    oneProduct.details = description[uxid].details;
                    oneProduct.picture = description[uxid].picture;                 
                }
                products['data'].push(oneProduct);                
            }
           return res.send(JSON.stringify(products));    
    });    
});



const admin = require('./admin.js');


app.use('/admin', admin);
exports.apps = functions.https.onRequest(app);

