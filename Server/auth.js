const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
require('dotenv').config();
const Profile = require('./Models/profileModel'); 
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:4000/auth/google/callback",
    passReqToCallback: true
},

async function (request, accessToken, refreshToken, profile, done) {
    try {
        const existingProfile = await Profile.findOne({ id: profile.id });
        if (!existingProfile) {
          console.log(profile);
            const newProfile = new Profile({
                id: profile.id,
                name: profile.displayName,
                picture: profile.picture,
                email: profile.email,
        });
        await newProfile.save();
        return done(null, newProfile);
      } else {
        return done(null, existingProfile);
      }
    } catch (err) {
      return done(err);
    }
  }
)
);

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});
