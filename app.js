/**
 * Module dependencies.
 */
 
 
const express = require('express');
const compression = require('compression');
const session = require('express-session');
const bodyParser = require('body-parser');
const logger = require('morgan');
const errorHandler = require('errorhandler');
const lusca = require('lusca');
const dotenv = require('dotenv');
const MongoStore = require('connect-mongo')(session);
const flash = require('express-flash');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const expressValidator = require('express-validator');
const sass = require('node-sass-middleware');
const multer = require('multer');
const upload = multer({ dest: path.join(__dirname, 'uploads') });

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.load({ path: '.env.example' });

/**
 * Controllers (route handlers).
 */
const homeController = require('./controllers/home');
const wishesController = require('./controllers/wishes');
const userController = require('./controllers/user');
const findController = require('./controllers/find');
const apiController = require('./controllers/api');
const contactController = require('./controllers/contact');
const institutionController = require('./controllers/institutions');

/**
 * API keys and Passport configuration.
 */
const passportConfig = require('./config/passport');

/**
 * Create Express server.
 */
const app = express();
 
/*
const livereload = require('express-livereload')
livereload(app, config={watchDir : './'});
*/



/**
 * Connect to MongoDB.
 */
mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI);
mongoose.connection.on('error', () => {
  console.error('MongoDB Connection Error. Please make sure that MongoDB is running.');
  process.exit(1);
});

app.locals.version = "v0.2";
app.locals.siteName = "TTree";

if (app.get('env') === 'development') {
	app.locals.siteURL = "http://192.168.1.64:3000/";
} else {
	app.locals.siteURL = "http://teachertree.herokuapp.com/";
}
app.locals.gradeList = [
	"Pre-K",
	"Kindergarten",
	"1st Grade",
	"2nd Grade",
	"3rd Grade",
	"4th Grade",
	"5th Grade",
	"6th Grade",
	"7th Grade",
	"8th Grade",
	"9th Grade",
	"10th Grade",
	"11th Grade",
	"12th Grade",
];
app.locals.moment = require('moment');

/**
 * Express configuration.
 */
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(compression());
app.use(sass({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public')
}));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  store: new MongoStore({
    url: process.env.MONGODB_URI || process.env.MONGOLAB_URI,
    autoReconnect: true
  })
}));
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
  if (req.path === '/api/upload' || req.path === '/upload') {
    next();
  } else {
    lusca.csrf()(req, res, next);
  }
});
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});


app.use(function(req, res, next) {
  // After successful login, redirect back to the intended page
  if (!req.user &&
      req.path !== '/login' &&
      req.path !== '/signup' &&
      !req.path.match(/^\/auth/) &&
      !req.path.match(/\./)) {
    req.session.returnTo = req.path;
  }
  next();
});
if (app.get('env') === 'development') {
  var livereload = require('easy-livereload');
  var file_type_map = {
    jade: 'html', // `index.jade` maps to `index.html`
    styl: 'css', // `styles/site.styl` maps to `styles/site.css`
    scss: 'css', // `styles/site.scss` maps to `styles/site.css`
    sass: 'css', // `styles/site.scss` maps to `styles/site.css`
    less: 'css' // `styles/site.scss` maps to `styles/site.css`
    // add the file type being edited and what you want it to be mapped to.
  };

  // store the generated regex of the object keys
  var file_type_regex = new RegExp('\\.(' + Object.keys(file_type_map).join('|') + ')$');
  console.log(":: Live Reload");
  app.use(livereload({
	  app:app,
    watchDirs: [
      path.join(__dirname,'public'),
      path.join(__dirname,'public/css'),
      path.join(__dirname,'views')
    ],
    checkFunc: function(file) {
      //console.log('check',file);
      return true;//file_type_regex.test(file);
    },
    renameFunc: function(file) {
      // remap extention of the file path to one of the extentions in `file_type_map`
      //console.log('rename',file);
      return file.replace(file_type_regex, function(extention) {
        return '.' + file_type_map[extention.slice(1)];
      });
    },
    port: process.env.LIVERELOAD_PORT || 35729
  }));
}

/**
 * Primary app routes.
 */
app.get('/', homeController.index);
app.post('/joinBeta', homeController.submitEmail);
app.get('/news', homeController.news);
app.get('/find', findController.index);
app.get('/searching', findController.searching);
app.post('/news', homeController.postNews);
app.get('/wishes', wishesController.index);


//app.get('/wishlist', wishesController.listWishes);
app.get('/listWishes', wishesController.listWishes);
app.get('/getMyWishes', wishesController.getMyWishes);

app.post('/wishes', wishesController.newWish);
app.get('/tree', wishesController.myTree);

app.get('/wish/submit', wishesController.index);
app.get('/wish/edit/:id', wishesController.editWish);
app.put('/wish/edit/:id', wishesController.updateWish);
app.get('/wish/:id', wishesController.getWish);
app.delete('/wish/:id', wishesController.removeWish);
app.post('/urlData', wishesController.getDataFromURL);


app.get('/login', userController.getLogin);
app.get('/logout', userController.logout);
app.get('/forgot', userController.getForgot);
app.post('/forgot', userController.postForgot);
app.get('/reset/:token', userController.getReset);
app.post('/reset/:token', userController.postReset);
app.get('/signup', userController.getSignup);
app.get('/checkUsername/:username', userController.checkUsername);
//app.post('/signup', userController.postSignup);
//app.post('/login', userController.postLogin);

app.get('/tree/:id', wishesController.viewTreeById);

app.post('/signup', userController.p_signup);
app.post('/login', userController.postLogin);
app.post('/find/teacher/:query', wishesController.findWishesByTeacherName);
app.post('/find/school/:query', wishesController.findWishesBySchoolName);
app.post('/find/class/:query', wishesController.findWishesBySchoolName);

app.post('/createInstitution', institutionController.createInstitution);

app.get('/contact', contactController.getContact);
app.post('/contact', contactController.postContact);
app.get('/admin', passportConfig.isAuthenticated, userController.admin);
app.get('/account', passportConfig.isAuthenticated, userController.getAccount);
app.post('/account/profile', passportConfig.isAuthenticated, userController.postUpdateProfile);
app.post('/account/password', passportConfig.isAuthenticated, userController.postUpdatePassword);
app.post('/account/delete', passportConfig.isAuthenticated, userController.postDeleteAccount);
app.get('/account/unlink/:provider', passportConfig.isAuthenticated, userController.getOauthUnlink);

const shortid = require('shortid');

var diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/img/p/')
  },
  filename: function (req, file, cb) {
    cb(null, req.user.id +'.jpg' )
  }
})

app.post('/upload', multer({ storage: diskStorage}).single('upl'), function(req,res){
	console.log(req.file);
	res.json(req.file)
})

/**
 * API examples routes.
 */
app.get('/api', apiController.getApi);
app.get('/api/lastfm', apiController.getLastfm);
app.get('/api/nyt', apiController.getNewYorkTimes);
app.get('/api/aviary', apiController.getAviary);
app.get('/api/steam', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getSteam);
app.get('/api/stripe', apiController.getStripe);
app.post('/api/stripe', apiController.postStripe);
app.get('/api/scraping', apiController.getScraping);
app.get('/api/twilio', apiController.getTwilio);
app.post('/api/twilio', apiController.postTwilio);
app.get('/api/clockwork', apiController.getClockwork);
app.post('/api/clockwork', apiController.postClockwork);
app.get('/api/foursquare', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getFoursquare);
app.get('/api/tumblr', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getTumblr);
app.get('/api/facebook', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getFacebook);
app.get('/api/github', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getGithub);
app.get('/api/twitter', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getTwitter);
app.post('/api/twitter', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.postTwitter);
app.get('/api/linkedin', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getLinkedin);
app.get('/api/instagram', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getInstagram);
app.get('/api/paypal', apiController.getPayPal);
app.get('/api/paypal/success', apiController.getPayPalSuccess);
app.get('/api/paypal/cancel', apiController.getPayPalCancel);
app.get('/api/lob', apiController.getLob);
app.get('/api/upload', apiController.getFileUpload);
app.post('/api/upload', upload.single('myFile'), apiController.postFileUpload);
app.get('/api/pinterest', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getPinterest);
app.post('/api/pinterest', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.postPinterest);
app.get('/api/google-maps', apiController.getGoogleMaps);

/**
 * OAuth authentication routes. (Sign in)
 */
app.get('/auth/instagram', passport.authenticate('instagram'));
app.get('/auth/instagram/callback', passport.authenticate('instagram', { failureRedirect: '/login' }), (req, res) => {
  res.redirect(req.session.returnTo || '/');
});
app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'user_location'] }));
app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), (req, res) => {
  res.redirect(req.session.returnTo || '/');
});
app.get('/auth/github', passport.authenticate('github'));
app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
  res.redirect(req.session.returnTo || '/');
});
app.get('/auth/google', passport.authenticate('google', { scope: 'profile email' }));
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
  res.redirect(req.session.returnTo || '/');
});
app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/login' }), (req, res) => {
  res.redirect(req.session.returnTo || '/');
});
app.get('/auth/linkedin', passport.authenticate('linkedin', { state: 'SOME STATE' }));
app.get('/auth/linkedin/callback', passport.authenticate('linkedin', { failureRedirect: '/login' }), (req, res) => {
  res.redirect(req.session.returnTo || '/');
});

/**
 * OAuth authorization routes. (API examples)
 */
app.get('/auth/foursquare', passport.authorize('foursquare'));
app.get('/auth/foursquare/callback', passport.authorize('foursquare', { failureRedirect: '/api' }), (req, res) => {
  res.redirect('/api/foursquare');
});
app.get('/auth/tumblr', passport.authorize('tumblr'));
app.get('/auth/tumblr/callback', passport.authorize('tumblr', { failureRedirect: '/api' }), (req, res) => {
  res.redirect('/api/tumblr');
});
app.get('/auth/steam', passport.authorize('openid', { state: 'SOME STATE' }));
app.get('/auth/steam/callback', passport.authorize('openid', { failureRedirect: '/login' }), (req, res) => {
  res.redirect(req.session.returnTo || '/');
});
app.get('/auth/pinterest', passport.authorize('pinterest', { scope: 'read_public write_public' }));
app.get('/auth/pinterest/callback', passport.authorize('pinterest', { failureRedirect: '/login' }), (req, res) => {
  res.redirect('/api/pinterest');
});

/**
 * Error Handler.
 */
app.use(errorHandler());

/**
 * Start Express server.
 */
 var models = require('./models/postgresModels.js')
models.connection.sync().then(function () {
	app.listen(app.get('port'), () => {
	  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
	});
});

module.exports = app;
