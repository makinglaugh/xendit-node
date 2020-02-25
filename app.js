const express = require('express')
const app = express()
const port = 3000
var MongoClient = require('mongodb').MongoClient;
var os = require('os');

app.get('/ostype', function(req, res) {
 MongoClient.connect("mongodb://xendit-mongo:27017/xenditdb", function (err, db) {
     if(err) throw err;
 var dbo = db.db("xenditdb");
 var myobj = { time: "Company Inc" };
 dbo.collection("logging").insertOne({date: new Date(Date.now()).toISOString()}, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    db.close();
    });
 };

 res.send("OS Type: "+os.type()+"\nOS Platform: "+os.platform()+"\nOS Release "+os.release())
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
