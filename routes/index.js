const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require("bcrypt");
var User = require("../models/").User;
var fs = require('fs');
var ini = require('ini');
var readline = require('readline');

const { exec } = require("child_process");


/**
 * Middleware to verify authentication
 */

router.use(function (req, res, next) {
  user = req.session.user;
  if( req.path != '/' && req.method === 'GET'  && !user  ) {
    res.redirect('/'); 
  } else {
    next();
  }
})

/**
 * 
 */
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

  if (body.old_password ) {

    const admin = await User.findOne( { where: { login: 'admin'} });
    const validPassword = await bcrypt.compare(body.old_password, admin.password);

    if ( validPassword ) {
        if (body.new_password && body.new_password !="" ) {

          hash_admin = await bcrypt.hash(body.new_password , 10);
          admin.update({
            password: hash_admin
          })

        }  
        
        if (body.guest_new_password && body.guest_new_password !="" ) {

          const guest = await User.findOne( { where: { login: 'guest'} });
          hash_guest = await bcrypt.hash( body.guest_new_password, 10);
          guest.update({
            password: hash_guest
          })

        }

    } else {
      res.status(400).json({ error: "Admin Invalid Password" });
    }
  }

  res.status(201).json({message:"Successfully Updated"});


});

router.post("/reload-network", async (req, res) => {

  
  exec("echo '"+ process.env.ADMIN +"' | sudo reboot", (error, stdout, stderr) => {
    
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



router.get('/input', (req, res) => {
  
    user = req.session.user;
    admin = req.session.admin;

    res.render('pages/input',{
      user : user,
      admin : admin
    });

});

router.get('/output', (req, res) => {
  
  user = req.session.user;
  admin = req.session.admin;

  res.render('pages/output',{
    user : user,
    admin : admin
  });

});

router.get('/config', (req, res) => {
  
  user = req.session.user;
  admin = req.session.admin;

  res.render('pages/config',{
    user : user,
    admin : admin
  });

});


router.get('/network', (req, res) => {
  
  user = req.session.user;
  admin = req.session.admin;
  var config = ini.parse(fs.readFileSync(process.env.CONFIG_EVOK_FILE, 'utf-8'))

  

  res.render('pages/network',{
    dhcp: config.Config.dhcp,
    hostname: config.Config.hostname,
    masque: config.Config.masque,
    passerelle: config.Config.passerelle,
    ipserveur: config.Config.IPServeur,
    dns1: config.Config.dns1,
    dns2: config.Config.dns2,
    key: config.key.key,
    user : user,
    admin : admin,
  });
  
});

router.get('/reader', (req, res) => {
  
  user = req.session.user;
  admin = req.session.admin;
  var config = ini.parse(fs.readFileSync(process.env.CONFIG_EVOK_FILE, 'utf-8'))

  res.render('pages/reader',{
    user : user,
    admin : admin,
    type_a : config.Readera.type,
    first_character_a : config.Readera.firstCharacter,
    read_character_a : config.Readera.nbReadCharacter,
    type_b : config.Readerb.type,
    first_character_b : config.Readerb.firstCharacter,
    read_character_b : config.Readerb.nbReadCharacter,
    
    port_a : config.SerA.port,
    baudrate_a : config.SerA.baudrate,
    timeout_a : config.SerA.timeout,
    parity_a : config.SerA.parity,
    stopbits_a : config.SerA.stopbits,

    port_b : config.SerB.port,
    baudrate_b : config.SerB.baudrate,
    timeout_b : config.SerB.timeout,
    parity_b : config.SerB.parity,
    stopbits_b : config.SerB.stopbits,
  });
  
});


router.get('/operator', (req, res) => {
  
  user = req.session.user;
  admin = req.session.admin;


  res.render('pages/operator',{
    user : user,
    admin : admin
  });
  
});

router.get('/datetime', (req, res) => {
  var now = new Date();
    var utcString = now.toISOString().substring(0,19);
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var localDatetime = year + "-" +
                      (month < 10 ? "0" + month.toString() : month) + "-" +
                      (day < 10 ? "0" + day.toString() : day) + "T" +
                      (hour < 10 ? "0" + hour.toString() : hour) + ":" +
                      (minute < 10 ? "0" + minute.toString() : minute) +
                      utcString.substring(16,19);
    

  user = req.session.user;
  admin = req.session.admin;
  var ntp = ini.parse(fs.readFileSync('./timesyncd.conf', 'utf-8'))
  var config = ini.parse(fs.readFileSync(process.env.CONFIG_EVOK_FILE, 'utf-8'))
  var ntplist = null;  
  
  if ( ntp.Time.FallbackNTP != null) {
    ntplist = ntp.Time.FallbackNTP.split(' ');
  } 


  res.render('pages/datetime',{
    user : user,
    admin : admin,
    date_status : config.Date.automatic,
    ntp: ntplist,
    local: localDatetime
  });
  
});


router.get('/log', (req, res) => {
  
  user = req.session.user;
  admin = req.session.admin;

  // Creating a function which takes a file as input
  const readFileLines = filename =>
    fs
      .readFileSync(filename)
      .toString('UTF8')
      .split('</br>');
  
  
  // Driver code
  let log = readFileLines(process.env.LOG_FILE);
  
  
  res.render('pages/log',{
    user : user,
    admin : admin,
    log: log.toString().split('\n')
  });
  
});


router.get('/device', (req, res) => {
  
  user = req.session.user;
  admin = req.session.admin;


  res.render('pages/device',{
    user : user,
    admin : admin
  });
  
});


router.post("/update-network", function (req, res) {
  
    const body = req.body;
  
    var config = ini.parse(fs.readFileSync(process.env.CONFIG_EVOK_FILE, 'utf-8'))
  
    if (!body.dhcp) {
      config.Config.dhcp = 0 
      config.Config.hostname = body.hostname
      config.Config.masque = body.mask
      config.Config.passerelle = body.gateway 
      config.Config.IPServeur = body.server 
      config.Config.dns1 = body.dns1
      config.Config.dns2 = body.dns2  
      config.key.key = body.key 

      var data = "# interfaces(5) file used by ifup(8) and ifdown(8)\n"+
      "# Please note that this file is written to be used with dhcpcd \n" +
      "# For static IP, consult /etc/dhcpcd.conf and 'man dhcpcd.conf' \n" +
      "# Include files from /etc/network/interfaces.d: \n" +
        "source-directory /etc/network/interfaces.d \n" +
        
        "auto eth0 \n"+
        "iface eth0 inet static \n" +
	      "\taddress " + body.hostname +"\n" + 
        "\tnetmask " + body.mask +"\n" +
        "\tgateway " + body.gateway +"\n"+
        "\tdns-nameservers "+  body.dns1+ " " + body.dns2+ "\n";
  

    } else {
      config.Config.dhcp = 1 ;
      var data = "allow-hotplug eth0 \niface eth0 inet dhcp";
    }


    fs.writeFileSync(process.env.CONFIG_EVOK_FILE , ini.stringify(config))

    fs.writeFile( process.env.CONFIG_NETWORK_FILE, data, (err) => {
      if (err)
        console.log(err);
    });

    return res.redirect('/input')
  
});

router.post("/update-reader", async (req, res) => {
  const body = req.body;
  
  var config = ini.parse(fs.readFileSync(process.env.CONFIG_EVOK_FILE , 'utf-8'))

  config.Readera.type = body.type_a
  config.Readera.firstCharacter = body.first_character_a
  config.Readera.nbReadCharacter = body.read_character_a 

  //Reader A
  console.log(body.port_a)

  config.SerA.port = body.port_a
  config.SerA.baudrate = body.baudrate_a
  config.SerA.timeout = body.timeout_a 
  config.SerA.parity = body.parity_a 
  config.SerA.stopbits = body.stopbits_a



  config.Readerb.type = body.type_b
  config.Readerb.firstCharacter = body.first_character_b
  config.Readerb.nbReadCharacter = body.read_character_b 
  //Reader B ser
  config.SerB.port = (body.port_b).toString()
  config.SerB.baudrate = body.baudrate_b
  config.SerB.timeout = body.timeout_b 
  config.SerB.parity = body.parity_b 
  config.SerB.stopbits = body.stopbits_b

  
  fs.writeFileSync(process.env.CONFIG_EVOK_FILE , ini.stringify(config))

  return res.redirect('/input')
});
  
router.post("/update-time", async (req, res) => {
  
  const body = req.body;
  var config = ini.parse(fs.readFileSync(process.env.CONFIG_EVOK_FILE , 'utf-8'))

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

    config.Date.automatic = 1


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

    config.Date.automatic = 0

  }

  fs.writeFileSync(process.env.CONFIG_EVOK_FILE , ini.stringify(config))
  return res.redirect('/input')
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