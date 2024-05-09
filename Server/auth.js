const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
require('dotenv').config();
const jwt = require("jsonwebtoken");

const Profile = require('./Models/profileModel'); 
const User = require('./Models/userModel'); 

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

const generateToken = (user) => {
    return jwt.sign({ user: user }, process.env.SECRET_KEY, { expiresIn: "5h" })
}

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
            
            const token = generateToken(newProfile);

            request.res.cookie('token', token, { httpOnly: false });
            request.res.cookie('name', profile.displayName, { httpOnly: false });
            
            return done(null, newProfile);
        } else {
            const token = generateToken(existingProfile);

            request.res.cookie('token', token, { httpOnly: false });
            request.res.cookie('name', profile.given_name, { httpOnly: false });
            
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
