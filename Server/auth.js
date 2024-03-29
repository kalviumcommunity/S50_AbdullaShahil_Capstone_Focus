const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
require('dotenv').config();
const Profile = require('./Models/profileModel'); 
const User = require('./Models/userModel'); 

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
            
            const newUser = new User({
                id: profile.id,
                name: profile.displayName,
                email: profile.email,
                profile: newProfile._id
            });
            
            await newProfile.save();
            await newUser.save();
            
            request.res.cookie('userData', JSON.stringify(newProfile), { httpOnly: false });
            request.res.cookie('name', JSON.stringify(profile.given_name), { httpOnly: false });
            console.log(newProfile);
            return done(null, newProfile);
        } else {
            console.log(profile);
            request.res.cookie('userData', JSON.stringify(existingProfile), { httpOnly: false });
            request.res.cookie('name', JSON.stringify(profile.given_name), { httpOnly: false });
            console.log(existingProfile);
            return done(null, existingProfile);
        }
    } catch (err) {
        return done(err);
    }
}));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

module.exports = passport;
