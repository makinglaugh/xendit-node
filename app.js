const express = require('express')
const app = express()
const port = 3000
var os = require('os');

app.get('/ostype', function(req, res) {
 res.send("OS Type: "+os.type()+"\nOS Platform: "+os.platform()+"\nOS Release "+os.release())
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
