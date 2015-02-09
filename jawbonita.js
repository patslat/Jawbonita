var express = require('express');
var crypto = require('crypto');


// Initialize application
var app = express();

// Configure application
require('./config')(app)

// Boot application
require('./lib/boot')(app)

// Load models TODO: Move to controller
var User = require('./models/models').User;


// Current User helper
var ifCurrentUser = require('./lib/current_user').ifCurrentUser


// Authentication methods
var auth = require('./lib/auth')
  , redirectToLogin = auth.redirectToLogin
  , alreadyLoggedIn = auth.alreadyLoggedIn
  , getPermission = auth.getPermission
  , authTokenRequest = auth.authTokenRequest
  , getUp = auth.getUp
;


// Routes
app.get('/', function(req, res) {
  // Absent should probably take the error
  ifCurrentUser(
    req,
    alreadyLoggedIn.bind({ res: res }),
    redirectToLogin.bind({ res: res })
  )
})

app.get('/login', function(req, res) {
  ifCurrentUser(
    req,
    alreadyLoggedIn.bind({ res: res }),
    getPermission.bind({ res: res })
  )
});

app.get('/login_callback', function(req, res) {
  console.log(req.params);
  var code = req.query.code;

  var successCbk = function(err, resp, body) {
    if (err) {
      console.log('Error: ' + err)
      res.status(404)
         .send('Not found');
    }

    console.log('successful auth request: ' + body)
    var body = JSON.parse(body)
      , token = body.access_token
      // TODO: This name generation should be non-deterministic
      , name = crypto.createHash('md5').update(token).digest('hex')
      , up = getUp(token)
    ;

    up.me.get({}, function(err, body) {
      if (err) {
        console.log('Auth failed: ' + err)
        res.status(404)
           .send('Not found');
      } else {
        var data = JSON.parse(body).data;

        // Save the User's data
        var user = new User
        user.name = name;
        user.token = token;
        user.first = data.first;
        user.last = data.last;
        user.height = data.height;
        user.weight = data.weight;
        user.image = data.image;
        user.gender = data.gender;

        user.save(function(err) {
          if (err) {
            console.log('Saving user failed: ', err)
          } else {
            // Set the cookie with the user's identifier and render
            res.cookie('jawbonitaId', user.name);
            res.render('index', { loggedIn: true, user: user })
          }
        })

      }
    })
  };

  authTokenRequest(code, successCbk)
});

app.get('/moves', function(req, res) {
  var name;
  console.log('request cookies: ' + req.cookies)
  if (name = req.cookies.jawbonitaId) {
    console.log('looking for user with id: ' + name)
    User.find({name: name}, function(err, docs) {
      if (err) {
        console.log('Error: ' + error)
      } else {
        var user = docs[0];
        up = getUp(user.token)
      }

      up.moves.get({}, function(err, body) {
        if (err) {
          console.log('Error in moves: ' + err);
          res.status(404)
             .send('Not found');
        } else {
          console.log('moves data: ' + body)
          var data = JSON.parse(body).data
          res.status(200)
             .send(data);
        }
      });
    });
  } else {
    res.redirect('/');
  }
});
