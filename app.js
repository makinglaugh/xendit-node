const express = require('express')
const app = express()
const port = 3000
var MongoClient = require('mongodb').MongoClient;
var os = require('os');

app.get('/ostype', function(req, res) {
 MongoClient.connect("mongodb://xendit-mongo:27017/xenditdb", function (err, db) {
     if(err) throw err;
 var dbo = db.db("xenditdb");
 dbo.collection('logging').insert({date: new Date(Date.now()).toISOString()}, function(err, r) {

 console.log("query executed");
 });

 });
 res.send("OS Type: "+os.type()+"\nOS Platform: "+os.platform()+"\nOS Release "+os.release())
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
