const express = require("express");
const session = require("express-session");
const cors = require("cors");
const connectDb = require("../Server/config/connect");
const userRouter = require("./Routes/userRoute");
const passport = require("passport");
require('./auth')

const port = 4000;
const app = express();

app.use(session({ 
  secret: 'cats',
  resave: false,
  saveUninitialized: true,
  cookie: {secure: false},
}));

app.use(passport.initialize());
app.use(passport.session());

connectDb();
app.use(cors())

function isLoggedIn(req, res, next){
  req.user? next(): res.sendStatus(401);
}

app.get('/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: 'http://localhost:5173/home',
    failureRedirect: '/auth/failure'
  })
);

app.get("/auth/failure", (req, res) => {
  res.send('Signup failed')
});

app.use(express.json())
app.use("/", userRouter);

app.listen(port, () => {
  console.log(`🚀 server running on PORT: ${port}`);
});


module.exports = app;
