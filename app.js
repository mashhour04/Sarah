const express = require('express');
const path = require('path');
const logger = require('morgan');
const config = require('config');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const log = require('npmlog');
const multer = require('multer');
const passport = require('passport');

const jwt = require('jsonwebtoken');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const { Strategy } = require('passport-local');
const FacebookStrategy = require('passport-facebook');

const { adminModel } = require('./model');
const collector = require('./services/collector')

require('dotenv').config();

const app = express();
const uploads = multer({ dest: 'uploads/' });
const { ensure } = require('./services/ensure');

app.use(logger('combined'));

// Add headers
app.use(cors());

const { apiRouter } = require('./routes/api/apiRouter');

passport.use(
  new Strategy(async (username, password, cb) => {
    log.info('authenticatiing');
    const user = await userModel.findByUsername(username);

    if (!user) {
      cb('No User Found', false);
      return false;
    }
    log.info('found user', user);
    const isMatch = await user.comparePassword(password);

    log.info('is match', isMatch);

    if (isMatch) {
      return cb(null, user);
    }
    return cb(null, null);
  })
);

passport.use(
  new FacebookStrategy(
    {
      clientID: config.get('FACEBOOK_APP_ID'),
      clientSecret: config.get('FACEBOOK_APP_SECRET'),
      callbackURL: config.get('callbackURL')
    },
    function(accessToken, refreshToken, profile, cb) {
      adminModel.findOrCreate({ facebookId: profile.id, profile, accessToken, refreshToken }, function(
        err,
        user
      ) {
        if(err) {
          console.log('error happened in passport facebook', err.message)
        }
        return cb(err, user);
      });
    }
  )
);

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'SecretKeyOne';
passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    //TODO
    // log.info('authenticating with jwt', jwt_payload.username);
    // const user = await userModel.findByUsername(jwt_payload.username);
    // if (!user) {
    //   return done('Couldn\'t authenticate user', null);
    // }
    // return done(null, user);
  })
);

passport.serializeUser((user, cb) => {});

passport.deserializeUser(async (identifiers, cb) => {});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('uploads'));

// view engine setup
// GOT Removed

app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
const session = require('express-session');
const FileStore = require('session-file-store')(session);

app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    maxAge: 5000000,
    store: new FileStore()
  })
);
// app.use(express.static(path.join(__dirname, 'client/build')));
// app.use('/static',express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'uploads')));

app.use(passport.initialize());
app.use(passport.session());

app.get('/backend/failure', (req, res) => {
  log.info('authentication failed');
  res.status(401).json({
    success: false,
    errors: [{ param: 'username or password', msg: 'incorrect' }]
  });
});

app.get('/failure', (req, res) => {
  log.info('authentication failed');
  res.status(401).json({
    success: false,
    errors: [{ param: 'username or password', msg: 'incorrect' }]
  });
});

app.post('/avatar', uploads.single('avatar'), (req, res, next) => {
  console.log('the file', req.file);
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
});

app.post(
  '/backend/login',
  passport.authenticate('local', {
    session: false,
    failureRedirect: '/backend/failure'
  }),
  loginHandler
);
app.post(
  '/login',
  passport.authenticate('local', {
    session: false,
    failureRedirect: '/failure'
  }),
  loginHandler
);

app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['groups_access_member_info', 'publish_to_groups']  }));

app.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login'}),
  function(req, res) {
    // Successful authentication, redirect home.
    console.log('callback', req.user)
    res.redirect('/');
  }
);

app.use(
  '/api',
  passport.authenticate('jwt', { session: false }),
  apiRouter.getRouter
);

//TODO
// function keepAlive() {
//   setInterval(() => {
//     try {

//     } catch (err) {

//     }
//   }, 5 * 60 * 1000);
// }

// keepAlive();

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals = {
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {}
  };
  console.log('the error is', err, 'res', res);
  // render the error page
  res.status(err.status || 500).json({ message: err.message });
});

const new_port = process.env.PORT || 8000;
app.listen(new_port, () => {
  console.log(`listening on *:${new_port}`);
});

function loginHandler(req, res) {
  const SignedUser = {
    tokens: req.user.tokens,
    id: req.user.id,
    username: req.user.username
  };
  const token = jwt.sign(SignedUser, 'SecretKeyOne');
  delete SignedUser.hashed_password;
  res.status(200).json({
    success: true,
    authenticated: true,
    token,
    ...SignedUser
  });
}
