var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('admin');
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
                'password' : userpassword
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

/* GET register page. */
router.get('/register', function(req, res) {
  res.render('register', { title: 'Register' });
});
module.exports = router;