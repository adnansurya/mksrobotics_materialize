const functions = require('firebase-functions');
const express = require('express');
var path = require("path");


const app = express();
const web_name = 'Makassar Robotics';


app.use('/static', express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs');


app.get('/blank', (req,res) => {
    res.render('pages/blank');    
});

exports.apps = functions.https.onRequest(app);
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
