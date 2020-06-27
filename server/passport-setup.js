const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config({ path: '../.env' });
const { postUser } = require('./db/index');

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  // this is the url you will be redirected to after login
  callbackURL: '/api/auth/google/callback',
  proxy: true, // allow https
},
(accessToken, refreshToken, profile, done) => {
  // The INSERT IGNORE in the schema will not allow us to add duplicate users
  // create the user object to add to the database
  const userDetails = {
    username: profile.displayName,
    nameFirst: profile.name.givenName,
    nameLast: profile.name.familyName,
    phoneNumber: '',
    email: profile.emails[0].value,
    imageUrl: profile.photos[0].value,
  };

  // use the postUser help funciton to add the user to the database
  postUser(userDetails);

  done(null, profile);
}));
