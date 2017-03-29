var express = require ('express');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var pg = require('pg');
var path = require('path');
var app = express();
var config = "postgres://dron:1111@127.0.0.1:5432/tasks_distributor_db";
var email;
var pass;
var login_flag=undefined;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname)));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.listen(2000,function (req,res) {
    console.log("Server started on port 2000.");
});

app.get('/',function (req,res) {
    res.render('login.html');
});

app.post('/login',function (req,res) {
    //console.log("in post: "+login_flag);
    if(login_flag==1) {
        //console.log("log: " +email+"  "+pass);
        pg.connect(config, function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            client.query("select * from users where login=$1 and password=$2", [email, pass], function (err, result) {
                if (err) {
                    return console.error('error running query', err);
                }
                if (result.rowCount < 1) {
                    res.render('login.html');
                }
                else {
                    res.render('index.html', {current_user: result.rows});
                }
                done();
            });
        });
    }
    if(login_flag==0){
        //console.log("register "+email+"  "+pass);
        pg.connect(config, function(err, client, done) {
            if(err) {
                return console.error('error fetching client from pool', err);
            }
            client.query("insert into users(login,password,id_role) values($1,$2,$3)", [email, pass,3], function(err, result) {
                if(err) {
                    return console.error('error running query', err);
                }
                client.query("select * from users where login=$1 and password=$2", [email, pass], function (err, result) {
                    res.render('index.html', {current_user: result.rows});
                });

                //console.log("хули")
                done();
            });
        });
    }
});

app.post('/', function (req,res){
    email=req.body.email;
    pass=req.body.pass;
    login_flag=req.body.button;
    //console.log(login_flag);
 });
app.get('/index', function (req,res) {
    res.render('index.html');
});
app.get('/create.html',function (req,res) {
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

