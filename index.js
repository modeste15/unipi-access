const express = require("express");
const bcrypt = require("bcrypt");
const sequelize = require("sequelize");
const sqlite3 = require("sqlite3").verbose();
const models = require("./models");
var bodyParser = require('body-parser');
var User = require("./models/").User;
require('dotenv').config()

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


models.sequelize.sync().then(function() {
  console.log('connected to database')
}).catch(function(err) {
  console.log(err)
});

app.listen(3000, () => {
  console.log("Serveur démarré (http://localhost:3000/) !");
});


app.get("/", async (req, res) => {
  res.status(200).json({ test: "user" });
  
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
    password: "$2y$10$jbGiV9Mn6e31e3FFWAdu3Opj/E.I9mytK5nIyo5jpITWFT2Hakt/y",
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


app.post("/login", async (req, res) => {

  const body = req.body;

  const user = await User.findOne( { where: { login: body.login} });
  console.log(body.login);

  console.log(user.login);

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
