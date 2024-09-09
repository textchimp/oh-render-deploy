const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const authController = require('./controllers/auth.js');
const listingsController = require('./controllers/listings.js');

const isSignedIn = require('./middleware/is-signed-in');
const passUserToView = require('./middleware/pass-user-to-view');

const port = process.env.PORT ? process.env.PORT : '3000';

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(morgan('dev'));

app.set('view engine', 'ejs'); 

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create( { mongoUrl: process.env.MONGODB_URI } )
  })
);

app.use( passUserToView ); // Use this for EVERY route!

app.get('/', (req, res) => {
  res.render('index.ejs', {
    user: req.session.user,
  });
});

app.get('/vip-lounge', isSignedIn, (req, res) => {
  // if (req.session.user) {
  //   res.send(`Welcome to the party ${req.session.user.username}.`);
  // } else {
  //   res.send('Sorry, no guests allowed.');
  // }
  res.send(`Welcome to the party ${req.session.user.username}.`);
});

app.use('/auth', authController);

// RESTful CRUD routes for Listing entity
// All of these routes require you to be logged in!
app.use('/listings', isSignedIn, listingsController);

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
