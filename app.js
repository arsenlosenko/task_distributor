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
//змінні тимчасові для звязку між post-ми
var email;
var pass;
var login_flag=undefined;
var task_name;
var task_description;
var task_deadline;
var current_user_id;
//налаштування сервера
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname)));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
//
app.listen(2000,function (req,res) {
    console.log("Супер сервер Дефолтного Льохи стартував на порті 2000.");
});

app.get('/',function (req,res) {
    res.render('login.html');
});

app.post('/login',function (req,res) {//для входу в сиситему
    if(login_flag==1) {//для входу зареєстрованого користувача
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
                    //передача результату запиту в json файл для відправки на front-end
                    var parseUser = JSON.stringify(result.rows);
                    fs.writeFile('user.json', parseUser, function(){
                        if (err){
                            return console.log(err);
                        }
                    })
                }
                done();
            });
        });
    }
    if(login_flag==0){//для реєстрації
        if(pass=="" || email==""){//перевірка "пустих" юзерів
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
                        //передача результату запиту в json файл для відправки на front-end
                        var parseUser = JSON.stringify(result.rows);
                        fs.writeFile('user.json', parseUser, function(){
                            if(err){
                                return console.log(err);
                            }
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

app.get('/create.html',function (req,res) {//для відкриття форми створення завдання
    res.render('create.html');
});

app.post('/create-task', upload.any(), function (req,res) {//підтверження створення завдання
    //file_path=req.files[0].path;    воно мало працювати :)
    task_name=req.body.name;
    task_description=req.body.description;
    task_deadline = req.body.deadline;
    pg.connect(config, function (err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
        client.query("select * from users where login=$1 and password=$2", [email, pass], function (err, result) {
            if (err) {
                return console.error('error running query', err);
            }
            current_user_id = result.rows[0].id_role;
            if(current_user_id==1) {
                client.query("insert into alfa_task(name,description,deadline) values($1,$2,$3)", [task_name, task_description, task_deadline], function (err, result) {
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
                    // Створення файлу з результатами запиту
                    fs.writeFile('data.json', parsedData, function () {
                        if (err) {
                            return console.log(err);
                        }
                    });
                    done();
                });
            }
            if(current_user_id==2){
                //тут мав бути код для додавання бета-тасків тімлідом
            }
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
            // Перетворення результатів запиту на json
            var parsedData = JSON.stringify(result.rows);
            // Створення файлу з результатами запиту 
            fs.writeFile('data.json', parsedData, function(){
                if(err){
                    return console.log(err);
                }
            });
            done();
        });
    });
});
