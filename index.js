const express = require("express");
const bcrypt = require("bcrypt");
const session = require('express-session');
const sequelize = require("sequelize");
const sqlite3 = require("sqlite3").verbose();
const models = require("./models");
const passport = require('passport');
const cors = require('cors');
var fs = require('fs'), ini = require('ini')

const { Strategy: LocalStrategy, } = require('passport-local');

var bodyParser = require('body-parser');
var User = require("./models/").User;
require('dotenv').config()


const app = express();

app.set('view engine', 'ejs');
app.use(express.static("assets"));

app.use(require("express-session")({
  secret: "Miss white is my cat",
  resave: false,
  saveUninitialized: false
}));



app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  console.log("+=+=+=+=+=+=+")
  console.log(res.locals.currentUser);
  console.log("+=+=+=+=+=+=+")
  console.log(req.user);
  next();
})
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());




models.sequelize.sync().then(function() {
  console.log('connected to database')
}).catch(function(err) {
  console.log(err)
});

app.listen(3001, () => {
  console.log("Serveur démarré (http://localhost:3001/) !");
});


passport.serializeUser(function(req, user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
      return done(null, user);
});

passport.use( new LocalStrategy(function(username, password, done) {

  User.findOne( { where: { login: username} }).then( function (user, err) {
      bcrypt.compare(password, user.password).then(  function (valid, err) { 


        if (valid) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Incorrect password' });
        }
      });
    }).catch(function(err) {
      return done(null, false, { message: 'Incorrect username' });
    });

}));





app.post('/', passport.authenticate('local', { successRedirect: '/success',
                                                    failureRedirect: '/error' }));




app.get('/', (req, res) => {
  res.render('pages/login');
});

app.get('/success', (req, res) => {
  res.redirect('/home');
});



app.get('/home', (req, res) => {
  
  var config = ini.parse(fs.readFileSync('./test.ini', 'utf-8'))

  res.render('pages/index',{
    hostname: config.Config.hostname,
    masque: config.Config.masque,
    passerelle: config.Config.passerelle,
    ipserveur: config.Config.ipserveur,
  });
});



app.get("/init", async (req, res) => {


  hash_admin = await bcrypt.hash( process.env.ADMIN, 10);
  // Create Admin 
  await User.create({
    login: "admin",
    password: hash_admin,
    role: 1
  });

  // Create User
  await User.create({
    login: "guest",
    password: hash_admin,
    role: 0
  });
  
  
  res.status(200).json({ test: "user" });
  
});


app.get("/all", async (req, res) => {
  User.findAll().then(function(users){
    console.log(users);
    res.send({error:false,message:'users list',data:users});
  }).catch(function(err){
    console.log('Oops! something went wrong, : ', err);
  });
  
});


app.get("/error", async (req, res) => {

    res.status(200).json({ test: "user" });
  
});


app.post("/update-ini", async (req, res) => {

  const body = req.body;

  var config = ini.parse(fs.readFileSync('./test.ini', 'utf-8'))

  if (!body.dhcp) {
    config.Config.hostname = body.hostname
    config.Config.masque = body.mask
    config.Config.passerelle = body.gateway  
  } else {
    config.Config.passerelle = body.dhcp   
  }


  fs.writeFileSync('./test.ini', ini.stringify(config))

  res.status(200).json({ test: "success" });

});
