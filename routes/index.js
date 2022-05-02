const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require("bcrypt");
var User = require("../models/").User;
var fs = require('fs'), ini = require('ini');
const { exec } = require("child_process");



router.use(function (req, res, next) {
  user = req.session.user;
  if( req.path === '/home' && req.method=== 'GET'  && !user  ) {
    res.redirect('/');
  } else {
    next();
  }
})

router.get('/', async (req, res) => {
  req.session.destroy();
  const users =  await User.findAll();
  if (users.length == 0) {
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
  }

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
      res.status(200);
      res.end();    
    } else {
      res.status(400).json({ error: "Invalid Password" });
    }
  } else {
    res.status(401).json({ error: "User does not exist" });
  }
});


router.post("/update-operator", async (req, res) => {

  const body = req.body;

  if (body.old_password  !="" && body.new_password  !="") {

    const admin = await User.findOne( { where: { login: 'admin'} });
    const validPassword = await bcrypt.compare(body.old_password, admin.password);
    if ( validPassword ) {
        hash_admin = await bcrypt.hash(body.new_password , 10);
        admin.update({
          password: hash_admin
        })
    } else {
      res.status(400).json({ error: "Invalid Password" });
    }
  }

  if (body.guest_old_password !="" && body.guest_old_password  !="") {

    const guest = await User.findOne( { where: { login: 'guest'} });
    const validPassword = await bcrypt.compare(body.guest_old_password, guest.password);
    if ( validPassword ) {
        hash_guest = await bcrypt.hash( body.guest_new_password, 10);
        guest.update({
          password: hash_guest
        })
    } else {
      res.status(400).json({ error: "Invalid Password" });
    }
  }



});

router.post("/reload-network", async (req, res) => {

  
  exec("echo '"+ process.env.ADMIN +"' | sudo systemctl stop NetworkManager.service", (error, stdout, stderr) => {
    
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);

    return 
  });
  res.status(200).json({ message: "Reboot Network" });


});

router.get('/home', (req, res) => {
  
    user = req.session.user;
    admin = req.session.admin;
    var config = ini.parse(fs.readFileSync('./test.ini', 'utf-8'))
    var log = fs.readFileSync('./evok.log', 'utf8')
    var ntp = ini.parse(fs.readFileSync('/etc/systemd/timesyncd.conf', 'utf-8'))
    const ntplist = null;  
    if ( ntp.Time.FallbackNTP != null) {
      const ntplist = ntp.Time.FallbackNTP.split(' ');
    } 
    
    

    res.render('pages/index',{
      hostname: config.Config.hostname,
      masque: config.Config.masque,
      passerelle: config.Config.passerelle,
      ipserveur: config.Config.IPServeur,
      dns1: config.Config.dns1,
      dns2: config.Config.dns2,
      user : user,
      admin : admin,
      type_a : config.Readera.type_a,
      first_character_a : config.Readera.firstCharacter,
      read_character_a : config.Readera.nbReadCharacter,
      type_b : config.Readerb.type_b,
      first_character_b : config.Readerb.firstCharacter,
      read_character_b : config.Readerb.nbReadCharacter,
      date_status : config.Date.automatic,
      log: log, 
      ntp: ntplist

    });
});


router.post("/update-network", function (req, res) {
  
    const body = req.body;
  
    var config = ini.parse(fs.readFileSync('./test.ini', 'utf-8'))
  
    if (!body.dhcp) {
      config.Config.dhcp = 0 
      config.Config.hostname = body.hostname
      config.Config.masque = body.mask
      config.Config.passerelle = body.gateway 
      config.Config.IPServeur = body.server 
      config.Config.dns1 = body.dns1
      config.Config.dns2 = body.dns2  

      let data = "# interfaces(5) file used by ifup(8) and ifdown(8)\n"+
      "# Please note that this file is written to be used with dhcpcd \n" +
      "# For static IP, consult /etc/dhcpcd.conf and 'man dhcpcd.conf' \n" +
      "# Include files from /etc/network/interfaces.d: \n" +
        "source-directory /etc/network/interfaces.d \n" +
        
        "auto lo \n"+
        "iface lo inet static \n" +
	      "address " + body.hostname +"\n" + 
        "\tnetmask " + body.mask +"\n" +
        "\tgateway " + body.gateway +"\n"+
        "\tdns-nameservers "+  body.dns1 + body.dns2;
  

    } else {
      config.Config.dhcp = 1 ;
      let data = "allow-hotplug eth0 \n"
        "iface eth0 inet dhcp \n";
    }


    fs.writeFileSync('./test.ini', ini.stringify(config))

    fs.writeFile("interfaces", data, (err) => {
      if (err)
        console.log(err);
      else {
        console.log("File written successfully\n");
        console.log("The written has the following contents:");
        console.log(fs.readFileSync("interfaces", "utf8"));
      }
    });

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

  return res.redirect('/home')
});
  
router.post("/update-time", async (req, res) => {
  
  const body = req.body;

  //  If Request Automatic Checkbox is true 
  if( req.body.automatic ) {

    try {
      // Create timesyncd.conf if it doesn't exist
      if (!fs.existsSync('./timesyncd.conf')) {
        exec("ln -s /etc/systemd/timesyncd.conf ./timesyncd.conf", (error, stdout, stderr) => {
          if (error) {
              console.log(`error: ${error.message}`);
              return;
          }
          if (stderr) {
              console.log(`stderr: ${stderr}`);
              return;
          }
          console.log(`stdout: ${stdout}`);
        });
      } 

    } catch(err) {
      console.error(err)
    }

    //Modification de timesyncd
    var ntp = ini.parse(fs.readFileSync('./timesyncd.conf', 'utf-8'));
    ntp.Time.FallbackNTP = body.ntp1+' '+body.ntp2;

    fs.writeFileSync('./timesyncd.conf', ini.stringify(ntp))

    exec("echo '"+ process.env.ADMIN +"' | sudo -S sudo timedatectl set-ntp on", (error, stdout, stderr) => {
      if (error) {
          console.log(`error: ${error.message}`);
          return;
      }
      if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
      }
    });

  } else {
    var command = "echo '"+ process.env.ADMIN +"' | sudo -S sudo timedatectl set-ntp no"+
                  "&& sudo -S date -s '"+ body.time +"'"; 
        
    exec(command , (error, stdout, stderr) => {
      if (error) {
          console.log(`error: ${error.message}`);
          return;
      }
      if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
      }
    });
  }

  return res.redirect('/home')
});
  

router.post("/init", async (req, res) => {

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