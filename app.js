var express = require ('express');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var pg = require('pg');
var path = require('path');
var app = express();
var sing_in_flag;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname)));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
var config = "postgres://dron:1111@127.0.0.1:5432/tasks_distributor_db";

app.listen(2000,function (req,res) {
    console.log("Server started on port 2000.");
});

app.get('/',function (req,res) {
    res.render('login.html');
});

app.post('/login',function (req,res) {
    if(sing_in_flag) res.render('index.html');
    else res.render('login.html');
});

app.post('/', function (req,res){
    var email=req.body.email;
    var pass=req.body.pass;
    pg.connect(config, function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }
        client.query("select * from users where login=$1 and password=$2", [email, pass], function(err, result) {
            if(err) {
                return console.error('error running query', err);
            }
            if(result.rowCount<1){
                sing_in_flag=false;
            }
            else{
                sing_in_flag=true;
                res.send({user: result.rows});
            }
        done();
        });
    });
 });
app.get('/index', function (req,res) {
    res.render('index.html');
});
app.get('/create',function (req,res) {
    res.render('create.html');
});
/*app.post('/index', function (req,res){
    var login=req.body.email.value;
    var password=req.body.pass.value;
    pg.connect(config, function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('select * from "user" where login="'+login+'" and password="'+password+'";', function(err, result) {
        if(err) {
            return console.error('error running query', err);
        }
        //res.render('index.html', {user:result.rows});
        res.send(result.rows);
        //, {user:result.rows}
        done();
        });
     });
});*/

