var express = require ('express');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var pg = require('pg');
var path = require('path');
var multer  = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null,  file.originalname );
    }
});
var upload = multer( { storage: storage } );

//для передачі даних у файл
var fs = require('fs');
var app = express();
var config = "postgres://dron:1111@127.0.0.1:5432/tasks_distributor_db";
//var config = "postgres://arsen:1111@127.0.0.1:5432/task_distributor";
var email;
var pass;
var login_flag=undefined;
var task_name;
var task_description;
var task_deadline;
var file_path;
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

    if(login_flag==1) {
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
                    console.log('User data: ');
                    console.log(result.rows);
                    var parseUser = JSON.stringify(result.rows);
                    console.log(parseUser);
                    fs.writeFile('user.json', parseUser, function(){
                        if (err){
                            return console.log(err);
                        }
                        console.log('user data saved');
                    })
                }
                done();
            });
        });
    }
    if(login_flag==0){
        if(pass=="" || email==""){
            res.render('login.html');
        }
        else {
            pg.connect(config, function (err, client, done) {
                if (err) {
                    return console.error('error fetching client from pool', err);
                }
                client.query("insert into users(login,password,id_role) values($1,$2,$3)", [email, pass, 3], function (err, result) {
                    if (err) {
                        return console.error('error running query', err);
                    }
                    client.query("select * from users where login=$1 and password=$2", [email, pass], function (err, result) {
                        res.render('index.html', {current_user: result.rows});
                        console.log('User data: ')
                        console.log(result);
                        var parseUser = JSON.stringify(result.rows);
                        console.log(parseUser);
                        fs.writeFile('user.json', parseUser, function(){
                            if(err){
                                return console.log(err);
                            }
                            console.log('User data saved');
                        })

                    });
                    done();
                });
            });
        }
    }
});

app.post('/', function (req,res){
    email=req.body.email;
    pass=req.body.pass;
    login_flag=req.body.button;
 });

app.get('/create.html',function (req,res) {
    res.render('create.html');
});

app.post('/create', upload.any(),  function (req,res) {
    res.render('create.html');
    //console.log("path motherfucker: "+req.files[0].path);
    file_path=req.files[0].path;
});

app.post('/create-task',function (req,res) {
    task_name=req.body.name;
    task_description=req.body.description;
    task_deadline = req.body.deadline;
    console.log("back: "+task_name+" "+task_description+" "+task_deadline);
    console.log(file_path);
    pg.connect(config, function (err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
        client.query("insert into alfa_task(name,description,deadline,file_url) values($1,$2,$3,$4)", [task_name, task_description, task_deadline, file_path], function (err, result) {
            if (err) {
                return console.error('error running query', err);
            }
            done();
        });
        client.query("select * from alfa_task", function (err, result) {
            if (err) {
                return console.error('error running query', err);
            }
            // Перетворення результатів запиту на json
            var parsedData = JSON.stringify(result.rows);
            console.log(parsedData);
            // Створення файлу з результатами запиту
            fs.writeFile('data.json', parsedData, function(){
                if(err){
                    return console.log(err);
                }
                console.log('file saved');
            });
            done();
        });
    });
});

app.get('/index',function (req,res) {
    pg.connect(config, function (err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
        client.query("select * from alfa_task", function (err, result) {
            if (err) {
                return console.error('error running query', err);
            }
            res.render('index.html', {tasks: result.rows});
            console.log(result.rows);
            // Перетворення результатів запиту на json
            var parsedData = JSON.stringify(result.rows);
            console.log(parsedData);
            // Створення файлу з результатами запиту 
            fs.writeFile('data.json', parsedData, function(){
                if(err){
                    return console.log(err);
                }
                    console.log('file saved');
            });
            done();
        });
    });
});
/*app.post('/create',function (req,res) {
    console.log("back2: "+task_name+" "+task_description+" "+task_deadline);
    pg.connect(config, function (err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
        client.query("insert into alfa_task(name,description,deadline) values($1,$2,$3)", [task_name, task_description, task_deadline], function (err, result) {
            if (err) {
                return console.error('error running query', err);
            }
            client.query("select * from alfa_task where name=$1 and description=$2 and deadline=$3", [task_name, task_description, task_deadline], function (err, result) {
                res.render('index.html', {new_task: result.rows});
            });
            done();
        });
    });
});*/

