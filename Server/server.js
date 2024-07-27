const express = require("express");
const session = require("express-session");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const connectDb = require("../Server/config/connect");
const { createServer } = require("http");

const userRouter = require("./Routes/userRoute");
const postRouter = require("./Routes/postRoute");
const articleRouter = require("./Routes/articleRoute");
const communityRouter = require("./Routes/communityRoute")
const messageRouter = require("./Routes/messageRoute")

const passport = require("passport");
require('./auth')
const app = express();

connectDb();

const setupSocket = require("./socketio");
const server = createServer(app);

const port = 4000;
app.use(express.static('public'));
app.use(session({
  secret: 'cats',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
}));


app.use(passport.initialize());
app.use(passport.session());

app.use(cors(
  {
    origin: "http://localhost:5173",
    credentials: true
  }
  ))
  
  function isLoggedIn(req, res, next) {
    req.user ? next() : res.sendStatus(401);
  }
  
  setupSocket(server);
  app.get('/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
  );
  
  app.get('/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: 'http://localhost:5173/home',
    failureRedirect: 'http://localhost:5173/signup'
  })
  );
  
  app.get("/auth/failure", (req, res) => {
    res.send('Signup failed')
  });
  
app.get("/home", isLoggedIn, (req, res) => {
  res.send("Welcome to the home page!");
});

app.get("/logout", (req, res) => {
  req.logout(function(err) {
    if (err) {
      console.error('Error during logout:', err);
      res.status(500).send('Error during logout');
    } else {
      req.session.destroy(function(err) {
        if (err) {
          console.error('Error destroying session:', err);
          res.status(500).send('Error destroying session');
        } else {
          console.log('User logged out successfully');
          res.send('User logged out successfully');
        }
      });
    }
  });
});



app.use(express.json())
app.use(cookieParser());

app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use("/articles", articleRouter);
app.use("/communities", communityRouter);
app.use("/messages", messageRouter);

server.listen(port, () => {
  console.log(`🚀 server running on PORT: ${port}`);
});



module.exports = app;
