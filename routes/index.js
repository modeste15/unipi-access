const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require("bcrypt");
var User = require("../models/").User;
var fs = require('fs'), ini = require('ini')

/*
router.use(function (req, res, next) {
  user = req.session.user;
  if( req.path === '/home' && req.method=== 'GET'  && !user  ) {
    res.redirect('/');
  } else {
    next();
  }
})*/

router.get('/', (req, res) => {
  res.render('pages/login');
});

router.post("/login", async (req, res) => {

  const body = req.body;

  const user = await User.findOne( { where: { login: body.username} });

  if (user) {
    // check user password with hashed password stored in the database
    const validPassword = await bcrypt.compare(body.password, user.password);
    
    if (validPassword) {
      if (user.login == "admin") {
        req.session.user = "Admin";
        req.session.admin = true;
      } else {
        req.session.user = "guest";
        req.session.admin = false;
      }
      res.writeHead(302 , {
        'Location' : '/home' // This is your url which you want
      });

      res.end();    
    } else {
      res.status(400).json({ error: "Invalid Password" });
    }
  } else {
    res.status(401).json({ error: "User does not exist" });
  }
});

router.get('/home', (req, res) => {
  
    user = req.session.user;
    admin = req.session.admin;
    var config = ini.parse(fs.readFileSync('./test.ini', 'utf-8'))
    var log = fs.readFileSync('./evok.log', 'utf8')
    res.render('pages/index',{
      hostname: config.Config.hostname,
      masque: config.Config.masque,
      passerelle: config.Config.passerelle,
      ipserveur: config.Config.ipserveur,
      user : user,
      admin : admin,
      type_a : config.Readera.type_a,
      first_character_a : config.Readera.firstCharacter,
      read_character_a : config.Readera.nbReadCharacter,
      type_b : config.Readerb.type_b,
      first_character_b : config.Readerb.firstCharacter,
      read_character_b : config.Readerb.nbReadCharacter,
      log: log
    });
});


router.get('/network', (req, res) => {
  
  user = req.session.user;
  admin = req.session.admin;
  var config = ini.parse(fs.readFileSync('./test.ini', 'utf-8'))
  res.render('pages/network',{
    hostname: config.Config.hostname,
    masque: config.Config.masque,
    passerelle: config.Config.passerelle,
    ipserveur: config.Config.ipserveur,
    user : user,
    admin : admin,
  });
});
  
  
router.post("/update-ini", function (req, res) {
  
    const body = req.body;
  
    var config = ini.parse(fs.readFileSync('./test.ini', 'utf-8'))
  
    if (!body.dhcp) {
      config.Config.hostname = body.hostname
      config.Config.masque = body.mask
      config.Config.passerelle = body.gateway 
      config.Config.dns1 = body.dns1
      config.Config.dns2 = body.dns2  
    } else {
      config.Config.passerelle = body.dhcp   
    }

    fs.writeFileSync('./test.ini', ini.stringify(config))
  
    return res.redirect('/home')
  
});

router.post("/update-reader", async (req, res) => {
  const body = req.body;
  
  var config = ini.parse(fs.readFileSync('./test.ini', 'utf-8'))

  config.Readera.type = body.type_a
  config.Readera.firstCharacter = body.first_character_a
  config.Readera.nbReadCharacter = body.read_character_a 

  config.Readerb.type = body.type_b
  config.Readerb.firstCharacter = body.first_character_b
  config.Readerb.nbReadCharacter = body.read_character_b 

  fs.writeFileSync('./test.ini', ini.stringify(config))

  //return res.redirect('/home')
});
  

router.get("/init", async (req, res) => {
  
  
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

module.exports = router;