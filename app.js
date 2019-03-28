const http = require('http')
var express = require('express')
var session = require('express-session')
var expressValidator = require('express-validator')
var ejs = require('ejs')
var bodyParser = require('body-parser')
var server = http.createServer(app)
var port = 5000
var app = require('express')();
var mysql =require('mysql')
var path = require('path')


var db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'projet_restaurant'
})

db.connect((err) => {
    if(!err)
    console.log('connexion reussi')
    else
    console.log(err.message)
}) 



app.use(express.static('views'));

app.use(session({
    secret : ' chat du clavier ' , 
    resave : false , 
    saveUninitialized : false , 
    cookie : {  secure : false }   
  } ) )
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.set('view engine', 'ejs' );
app.get('/',function(req, res) {
    db.query('SELECT * FROM plats',function(err,result){
        if(!err){
            console.log(result)
            res.render('index', {plats: result});
        }
        else
        console.log(err.message)
       
    })
    
})
app.get('/index2',function(req, res) {
    db.query(`SELECT categories.nom AS categorie, plats.*
             FROM plats
             INNER JOIN categories
             ON categories.id = plats.id_cat`,
            function(err,plats){
                if(!err)
                {
                    db.query('SELECT * FROM categories', function(error, categories){
                        if(!error){
                           res.render('index2', {
                               categories: categories, 
                               plats: plats 
                           })
                        }
                    })
                    
                    console.log(plats)
                }
            else
              console.log(err.message)
    })

})


app.get('/index3',function(req,res){
    res.render('index3');
})
 app.get('/index4',function(req,res){
     res.render('index4');
 });

 app.get('/index5/plat/:id',function(req,res){
     res.render('index5');
 })

app.post('/traitement',function(req, res) {
    console.log(req.body)
   let value = [req.body.name, req.body.firstname, req.body.email, req.body.password, req.body.phone]
    db.query('INSERT INTO client(nom,prenom,email,mdp,telephone) values(?, ?, ?, ?,?)',value,(err,results) =>{

        if(!err)
        res.send('donne pris en charge')
        else
        console.log(err.message)
        res.send('enregistrement echoue')
   
    })
    
})

app.post('/auth',function(req, res) {
    console.log(req.body)
    let value =[req.body.email, req.body.np, req.body.city, req.body.phone]
        db.query('INSERT INTO commande(id_plats,telephone,np,city) values(?,?,?,?)',value,(err,results) => {

        if(!err)
        res.send('commande effectué')
        else

        console.log(err.message)
        res.send('commande echoué')
    })
})

app.post('/connection',function(req, res) {
    console.log(req.body)
     var email = req.body.email;
     var password =  req.body.password;
        if(email && password){
        db.query('SELECT * FROM client WHERE email = ? AND mdp = ?',  [email, password], function(error, results) {

            if(error) throw error
            console.log(results)

            if(results.length > 0) {

                req.session.email = email
               
                console.log('tout va bien')
                res.render('commande');
            }
            else
            {
                res.send('email incorrecte');
            }
             res.end();
        });
    } else
    {
        res.send('entrer votre mot de passe!');
      res.end();
    }
    
});


app.listen(5000,(err) =>{
    if(!err)
    console.log('connecté')
    else
    console.log(err.message)
})