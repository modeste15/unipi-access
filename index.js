const express = require("express");
const session = require('express-session');
const sequelize = require("sequelize");
const sqlite3 = require("sqlite3").verbose();
const passport = require('passport');

const models = require("./models");
const routes = require('./routes/index');
const cors = require('cors');
var bodyParser = require('body-parser');
//var User =await  require("../models/").User;
require('dotenv').config()

const app = express();

app.set('view engine', 'ejs');

app.use(require("express-session")({
  secret: "Miss white is my cat",
  resave: false,
  saveUninitialized: false
}));


app.use(express.static("assets"));

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());


models.sequelize.sync().then(function() {
  console.log("Connected")
}).catch(function(err) {
  console.log(err)
});


app.use(routes);

app.listen(3000, () => {
  console.log("Serveur démarré (http://localhost:3000/) !");
});








