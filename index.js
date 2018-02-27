const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const app = express();
const bcrypt = require('bcrypt');

const pgp = require('pg-promise')();
const db = pgp({
  host: 'localhost',
  port: 5432,
  database: process.env.DATABASE,
  user: process.env.USERNAME,
  password: process.env.PASSWORD
})

const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync('my password',salt);





// create temporary storage for login data
const storage = {
  1: {
    id: 1,
    username: 'bob',
    password: 'pass'
  },
  2: {
    id: 2,
    username: 'top',
    password: 'secret'
  }
};

// helper function to get user by username
function getUserByUsername(username){
  return Object.values(storage).find( function(user){
    return user.username === username;
  });
}

app.use('/static', express.static('static'));
app.use(bodyParser.json());
app.set('view engine', 'hbs');

// configure user session
app.use(session({
  secret: 'any ole random string',
  resave: false,
  saveUninitialized: false
}));

// serialise user into session
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

// deserialise user from session
passport.deserializeUser(function(id, done) {
  const user = storage[id];
  done(null, user);
});

// configure passport to use local strategy
// that is use locally stored credentials
passport.use(new LocalStrategy(
  function(username, password, done) {
    //const user = getUserByUsername(username);
    lookUpUser(username).then(function(user){
      if (!user) return done(null, false);
      if (user.password != password) return done(null, false);
      return done(null, user);
    });
  }
));

// initialise passport and session
app.use(passport.initialize());
app.use(passport.session());

app.get('/register', function(req, res){
  res.render('page-register');
});


app.post('/register', function(req, res){

  let newUser = req.body;
  app.use(passport.initialize());

});

function lookUpUser(user) {
  debugger;
  const {username, password} = user;
  return db.one(`SELECT * FROM users WHERE username=$1`, [username])
  .then(function(data){
    return data;
  })
  .catch(function(error){
    
   // insertUser(user);
  });

}

function insertUser(newUser){
  const {username, password} = newUser;
  const hashNewUser = bcrypt.hashSync(password, salt);
  console.log(hashNewUser);
  db.one(`INSERT INTO users(username, password) 
      VALUES($1,$2) RETURNING id`, [username, hashNewUser])
  .then(data => {
    console.log('new user inserted');
  })
  .catch(error => {
    console.log('could not insert');
  });
}


// helper function to check user is logged in
function isLoggedIn(req, res, next){
  if( req.user && req.user.id ){
    next();
  } else {
    res.status(401).end();
  }
}

// route to accept logins
app.post('/login', passport.authenticate('local', { session: true }), function(req, res) {
  res.redirect('/profile');
});

// route to display user info
app.get('/profile', isLoggedIn, function(req, res){
  // send user info. It should strip password at this stage
  res.json({user:req.user});
});




app.listen(8080, function() { // Set app to listen for requests on port 3000
  console.log('Listening on port 8080!'); // Output message to indicate server is listening
});
