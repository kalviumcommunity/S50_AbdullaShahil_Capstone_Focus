const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const jwt = require("jsonwebtoken");

require('dotenv').config();

const Profile = require('./Models/profileModel'); 
const User = require('./Models/userModel'); 

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

const generateToken = (user) => {
    return jwt.sign({ user: user }, process.env.SECRET_KEY, { expiresIn: "5h" });
}

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:4000/auth/google/callback",
    passReqToCallback: true
},
async function (request, accessToken, refreshToken, profile, done) {
    try {
        let profileDoc = await Profile.findOne({ id: profile.id });
        let userDoc = null;

        if (!profileDoc) {
            profileDoc = new Profile({
                id: profile.id,
                name: profile.displayName,
                picture: profile.picture,
                email: profile.email,
            });
            
            userDoc = new User({
                id: profile.id,
                name: profile.displayName,
                email: profile.email,
                profile: profileDoc._id
            });
            
            await profileDoc.save();
            await userDoc.save();
        } else {
            userDoc = await User.findOne({ profile: profileDoc._id });
        }

        const token = generateToken(profileDoc);

        request.res.cookie('token', token, { httpOnly: false });
        request.res.cookie('name', profile.displayName.toString(), { httpOnly: false });
        request.res.cookie('userID', userDoc._id.toString(), { httpOnly: false });
        request.res.cookie('profileID', profileDoc._id.toString(), { httpOnly: false });

        return done(null, profileDoc);
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
