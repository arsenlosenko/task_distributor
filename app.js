var express = require ('express');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var pg = require('pg');
var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

var config = "postgres://dron:1111@127.0.0.1:5432/tasks_distributor_db";

app.listen(2000,function (req,res) {
    console.log("Server started on port 2000.");
})

app.get('/login',function (req,res) {
    /* pg.connect(config, function(err, client, done) {
     if(err) {
     return console.error('error fetching client from pool', err);
     }
     client.query('select login from "user" inner join role on role.id="user".id_role where role.id=1', function(err, result) {
     if(err) {
     return console.error('error running query', err);
     }*/
    res.render('login.html');
    //res.send(result.rows);
    //, {user:result.rows}
    //done();
    /*});
     });*/
});