const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

app.set('view engine', 'hbs');
app.use('/static', express.static('static'));
app.use(bodyParser.json());

app.get('/register', function(req, res){
    res.render('page-register');
});


app.listen(8080, function(){ // Set app to listen for requests on port 3000
    console.log('Listening on port 8080!'); // Output message to indicate server is listening
});