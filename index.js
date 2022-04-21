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

app.listen(3000, () => {
  console.log("Serveur démarré (http://localhost:3000/) !");
});


app.get('/', function(req, res) {
  res.render('pages/index');
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




app.post("/login", async (req, res) => {

  const body = req.body;

  const user = await User.findOne( { where: { login: body.username} });


  if (user) {
    // check user password with hashed password stored in the database
    const validPassword = await bcrypt.compare(body.password, user.password);
    if (validPassword) {
      res.status(200).json({ message: "Valid password", user: user  });
    } else {
      res.status(400).json({ error: "Invalid Password" });
    }
  } else {
    res.status(401).json({ error: "User does not exist" });
  }
});




app.post("/update-ini", async (req, res) => {

  const body = req.body;

  var config = ini.parse(fs.readFileSync('./test.ini', 'utf-8'))

  config.Config.hostname = body.hostname
  config.Config.masque = body.mask
  config.Config.passerelle = body.gateway


  fs.writeFileSync('./test.ini', ini.stringify(config))

  res.status(200).json({ test: "success" });

});



















/*
passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ where: { login: body.login} }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (!user.verifyPassword(password)) { return done(null, false); }
      return done(null, user);
    });
  }
));
*/


  




/*

passport.use( new LocalStrategy(function(username, password, done) {
  console.log("***********");
  console.log(username);

  console.log("***********");
  console.log(password);
  
  User.findOne( { where: { login: username} }).then( function (user, err) {
      bcrypt.compare(password, user.password).then(  function (valid, err) { 
        console.log("**********")
        console.log(valid)

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


passport.serializeUser(function(user, done) {
  return done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findOne( { where: { id: id} }).then( function (user, err) {
    if (!user) return done(null, false);
    return done(null, user);
  });
});

// ...

app.post('/login', passport.authenticate('local', { successRedirect: '/user',
                                                    failureRedirect: '/error' }));
*/