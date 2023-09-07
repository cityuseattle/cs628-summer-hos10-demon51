import express from "express";
import cors from "cors";
import "./loadEnvironment.mjs";
import records from "./routes/record.mjs";

import passport from "passport";
import session from "express-session";
import passportFacebook from "passport-facebook"
const FacebookStrategy = passportFacebook.Strategy;

const FACEBOOK_APP_ID = '802470011559801';
const FACEBOOK_APP_SECRET = '3e082daf689df4b171696c0ff2df3ba5';

const PORT = process.env.PORT || 5050;
const app = express();

passport.use(
  new FacebookStrategy(
    {
      clientID: FACEBOOK_APP_ID,
      clientSecret: FACEBOOK_APP_SECRET,
      // Your callback URL
      callbackURL: 'https://fluffy-pancake-qjq64pv9jjh96r4-5050.app.github.dev/facebook/callback', 
      // Fields you want to access from the user's Facebook profile
      profileFields: ['id', 'displayName', 'email'], 
    },
    async (accessToken, refreshToken, profile, done) => {
      //logic for using accessToken and RefreshToken
      return done(null, profile);
    }
  )
);

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

app.use(cors());
app.use(express.json());

app.use("/record", records);

app.use(session({ secret: 'secret-key', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Add Passport Facebook routes
app.get('/facebook', passport.authenticate('facebook'));
app.get('/facebook/callback', passport.authenticate('facebook', {
  // Redirect to the main page upon successful login.
  successRedirect: 'https://fluffy-pancake-qjq64pv9jjh96r4-3000.app.github.dev/home', 
  // Redirect to login page on authentication failure.
  failureRedirect: 'https://fluffy-pancake-qjq64pv9jjh96r4-3000.app.github.dev/', 
}));

// start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});