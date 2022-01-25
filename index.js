const express = require('express');
const bodyParser = require('body-parser');
const { Worker, parentPort } = require('worker_threads');

const worker = new Worker("./sender.js", {});
worker.on("exit", (code) => {
    if (code !== 0)
    {
        console.error(`Sender thread failed with exit code ${code}`)
    }
});

//import jsf from 'json-schema-faker';
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.post('/submit', function(req, res) {
    worker.postMessage(req.body);
    res.redirect('/');
});

app.post("/stop", function(req, res) {
    console.log("Stopping!");
    worker.postMessage({stop: true});
    res.redirect("/");
})

app.get('/', function(req, res) {
    
    res.render('index.html');
});

app.listen(port, function() {
    console.log('running nodejs on port '+ port);
});