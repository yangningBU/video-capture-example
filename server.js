var express = require('express')
var app = express();
var path = require('path');
const port = 8888;

app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`);
})

app.use(express.static('public'))

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/public/index.html'));
})