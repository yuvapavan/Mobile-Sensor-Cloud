var express = require('express');
var router = express.Router();
var loggedinUser = null;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});


/* POST to add new user to db */
router.post('/registerUser', function(req, res) {
  var db = req.db;
  var username = req.body.name;
  var useremail = req.body.email;
  var userpassword = req.body.password;
  var users = db.get('user');
  console.log(" Register User "+ useremail);
  users.find({email:useremail},{}, function(e, docs){
         if(docs.length > 0) {
                res.redirect('register');
         } else {
                console.log("Ok to register");
                users.insert({
                'name' : username,
                'email' : useremail,
                'password' : userpassword,
                'isadmin' : 'no'
                }, function (error, doc) {
                if (error) {
                        res.send("Could not create new user.");
                } else {
                        res.location('user');
                        res.redirect('user');
                }
                });
         }
  });
});

/* POST to add new user to db */
router.post('/loginUser', function(req, res) {
  var db = req.db;
  console.log("Hello");
  var useremail = req.body.email;
  var userpassword = req.body.password;
  var users = db.get('user');
  users.find({email:useremail,password:userpassword,isadmin:'no'},{}, function(e, docs){
         if(docs.length > 0) {
          console.log("Succesful");
          loggedinUser=useremail;
          console.log("Login User" +loggedinUser);
                res.redirect('dashboard');

         } else {
                console.log("User Does not Exist");

         }
  });
});




/* GET user page. */
router.get('/user', function(req, res) {
  res.render('user');
});





/* GET register page. */
router.get('/register', function(req, res) {
  res.render('register');
});

/* GET sensor monitor page. */
router.get('/dashboard', function(req, res) {
  res.render('dashboard');
});

/* GET new sensors page. */
router.get('/newsensors', function(req, res) {
	var db = req.db;
	var sensors = db.get('sensors');
  sensors.find({},{}, function(e, docs){
  res.render('newsensors',{
  	 'sensors': docs
  });
});
});

/* Subscribing for sensors page. */
router.post('/reqsensor',function(req,res)
{
var db=req.db;
var name=req.body.name;
var sensorsusedTable = db.get('sensorused');
console.log("Request Sensor============" +loggedinUser);
sensorsusedTable.insert({
'sensorname' : name,
'useremail': loggedinUser,
'from' : new Date(),
'to':new Date(),
},function (error, doc) {
    if (error) {
      res.send("Could not create new sensor.");
    } else {
      var sensorsTable = db.get('sensors');
      sensorsTable.find({},{}, function(e, docs){
      res.render('newsensors',{
      	 'sensors': docs,
         'subscribeSuccess': 1
      });
    });
 }
  });
});


/* Un Subscribing for sensors page. */
router.post('/unsubscribeSensor', function(req, res) {
var db = req.db;
var sensorname = req.body.sensorName;
var sensorUsedTable = db.get('sensorused');
sensorUsedTable.remove({
'useremail' : loggedinUser,
'sensorname' : sensorname,
},function(error, doc){
 if (error) {
   res.send("Could not unsubscribe sensor." + error);
 }else{
   sensorUsedTable.find({'useremail':loggedinUser},{}, function(e, docs){
     res.render('viewsensors1', {
       'sensors': docs,
       'unsubscribeSuccess': 1
     });
   });
 }
 });
});

/* GET view for admin information page. */
router.get('/adminform', function(req, res) {
  res.render('admin1');
  });

/* GET sensor monitor page. */
router.get('/admin', function(req, res) {
  res.render('admin');
});

/* POST to add new user to db */
router.post('/adminlogin', function(req, res) {
  var db = req.db;
  console.log("Hello");
  var useremail = req.body.email;
  var userpassword = req.body.password;
  var users = db.get('user');
  console.log(" Register User "+ useremail);
  users.find({email:useremail,password:userpassword,isadmin :'yes'},{}, function(e, docs){
         if(docs.length > 0) {
          console.log("Succesful");
                res.redirect('admin');
         } else {
                console.log("User Does not Exist");

         }
  });
});

/* GET sensor monitor page. */
router.get('/admin', function(req, res) {
  res.render('admin');
});






/*view sensors for user page. */
router.get('/viewsensors1', function(req, res) {
  var db = req.db;
  var sensors = db.get('sensorused');
  sensors.find({'useremail':loggedinUser},{}, function(e, docs){
          console.log("---------------viewsensors --  "+ docs + e);
    res.render('viewsensors1', {
      'sensors': docs
    });
  });
});


/* GET delete users page. */
router.get('/deleteusers', function(req, res) {
var db = req.db;
var user = db.get('user');
user.find({},{}, function(e, docs){
  res.render('deleteusers',{
    'user': docs
  });
  });
});


/* Post Function for  delete users page. */
router.post('/deleteusers', function(req, res) {
var db = req.db;
var userName = req.body.name;
var user = db.get('user');
console.log("Hello");
user.remove({
'name' : userName,
},function(error, doc){
  if (error) {
    res.send("Could not delete user.");
  }else{
      user.find({},{}, function(e, docs){
      res.render('deleteusers',{
        'user': docs,
        'deleteUserSuccess':1
      });
      });
  }
  });
});

 /* GET view for admin sensors page. */
router.get('/sensor', function(req, res) {
  var db = req.db;
  var sensors = db.get('sensors');
  sensors.find({},{}, function(e, docs){
  res.render('sensors', {
      'sensors': docs
    });
  });
});


/* GET sensor request page. */
router.get('/sensorrequest', function(req, res) {
  res.render('sensorrequest');
});



/* GET users page. */
// extracting the db object passedto http request
// fills docs variable with database docs(user data)
// renders page
router.get('/viewusers', function(req, res) {
  var db = req.db;
  var users = db.get('user');
  users.find({},{}, function(e, docs){
          console.log("---------------viewusers --  "+ docs + e);
    res.render('viewusers', {
      title: 'User',
      'user': docs
    });
  });
});

/* GET sensor add page. */
router.get('/addsensor', function(req, res) {
  res.render('addsensor');
});


/* GET sensor monitor page. */
router.get('/sensormonitor', function(req, res) {
var db = req.db;
 var sensors = db.get('sensors');
 sensors.find({},{}, function(e, docs){
  res.render('sensormonitor', {
      'sensors': docs
    });
  });
});


/* GET sensor delete page. */
router.get('/deletesensors', function(req, res) {
var db = req.db;
var sensors = db.get('sensors');
sensors.find({},{}, function(e, docs){
  res.render('deletesensors',{
    'sensors': docs
  });
  });
});

router.post('/deletesensor', function(req, res) {
var db = req.db;
var userName = req.body.name;
var sensors = db.get('sensors');
console.log("Hello");
sensors.remove({
'name' : userName,
},function(error, doc){
  if (error) {
    res.send("Could not delete new sensor.");
  }else{
    sensors.find({},{}, function(e, docs){
      res.render('deletesensors',{
        'sensors': docs,
        'deleteSuccesful': 1
      });
      });
  }
  });
});


/* GET sensor update page. */
router.get('/UpdateSensors', function(req, res) {
var db = req.db;
var sensors = db.get('sensors');
sensors.find({},{}, function(e, docs){
  res.render('UpdateSensors',{
    'sensors': docs
    });
  });
});

/* POST to update new sensor to db */
router.post('/updatesensor', function(req, res) {
  var db = req.db;
  var oldName = req.body.name;
  var newname = req.body.newname;
  var price=req.body.price;
  var sensors = db.get('sensors');
  console.log("updating - name "+ oldName + " to "+newname + " with price " +price);
  sensors.update(
  {"name" : oldName},
  { $set: {"name": newname,'price': price}},
   function (error, doc) {
    if (error) {
      res.send("Could not update new sensor." + error);
    } else {
      sensors.find({},{}, function(e, docs){
      res.render('sensors', {
          'sensors': docs,
          'updatesensorSucess':1
        });
      });
    }
  });
});



/* POST to add new sensor to db */
router.post('/createsensor', function(req, res) {
  var db = req.db;
  var userName = req.body.name;
  var type = req.body.type;
  var location = req.body.location;
  var price = req.body.price;
  var sensorsTable = db.get('sensors');
  console.log("Hello");
  sensorsTable.insert({
    'name' : userName,
    'type' : type,
    'location' :location,
    'status':'on',
    'price':price,
  }, function (error, doc) {
    if (error) {
      res.send("Could not create new sensor.");
    } else {
      sensorsTable.find({},{}, function(e, docs){
      res.render('sensors', {
          'sensors': docs,
          'addsensorSucess':1
        });
      });

    }
  });
});

/* GET Logout page for user. */
router.get('/logout', function(req, res) {
  res.render('user');
});

/* GET Logout page for admin. */
router.get('/logout1', function(req, res) {
  res.render('admin1');
});

/*view sensors for user page. */
router.get('/bill', function(req, res) {
  var db = req.db;
  var sensors = db.get('sensorused');
  sensors.find({useremail:loggedinUser},{}, function(e, docs){
          console.log("---------------viewsensors --  "+ docs + e);
    res.render('billing', {
      'sensors': docs
    });
  });
});

/*view sensors for user page. */
router.post('/viewbill', function(req, res) {
 var db = req.db;
 var sensorName = req.body.sensorName;
 var sensors = db.get('sensorused');
 console.log("Testing view "+ sensorName + "  "+loggedinUser);
sensors.find({'sensorname':sensorName,'useremail':loggedinUser},{}, function(e, docs){
var sensor = docs[0];
 var from=new Date(sensor.from);
 console.log("Testing Bill"+ sensor);
 var to=new Date();
 var noofdays=0;
 var diff = ( to - from ) ;
 if(diff<86400000)
 {
  noofdays=1;
  console.log("Just one day" +noofdays);
 }
 else
 {
  noofdays=Math.ceil(diff/86400000);
 }
 price = noofdays * 100;
console.log("Cloud Testing"+noofdays);
  res.render('bill', {
      'from': from,'to':to,'noofdays':noofdays,'price':price,'sensorName':sensorName
    });
  });
});

module.exports = router;
