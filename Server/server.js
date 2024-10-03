// Import necessary modules
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const { createServer } = require("http");
const passport = require("passport");
const dotenv = require('dotenv');
require('./auth')

// Database connection
const connectDb = require("../Server/config/connect");
connectDb();

// Load environment variables
dotenv.config();

// Set up routers
const userRouter = require("./Routes/userRoute");
const postRouter = require("./Routes/postRoute");
const articleRouter = require("./Routes/articleRoute");
const communityRouter = require("./Routes/communityRoute");
const messageRouter = require("./Routes/messageRoute");

// Socket setup
const setupSocket = require("./socketio");

// Initialize Express app
const app = express();
const server = createServer(app);
const port = 4000;

// Middleware setup
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

// Session management
const SESSION_SECRET_KEY = process.env.SESSION_SECRET;
app.use(session({
  secret: SESSION_SECRET_KEY || "G9z#kT!4xE*2pL$7qW^nR1vF&8bA@3zJ",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Authentication middleware
function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

// Google authentication routes
app.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }));
app.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "http://localhost:5173/signup" }), (req, res) => {
  console.log(" request ", req.user);
  const token = req.user;

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.redirect("http://localhost:5173/home");
});

// Authentication failure route
app.get("/auth/failure", (req, res) => {
  res.send('Signup failed');
});

// Home route
app.get("/home", isLoggedIn, (req, res) => {
  res.send("Welcome to the home page!");
});

// Logout route
app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Error during logout:", err);
      return res.status(500).send("Error during logout");
    }

    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      domain: "https://s50-abdullashahil-capstone-focus.onrender.com/"
    });

    res.clearCookie("connect.sid", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      domain: "https://s50-abdullashahil-capstone-focus.onrender.com/"
    });

    req.session.destroy((err) => {
      if (err) {
        return res.status(500).send("Error destroying session");
      }

      res.status(200).send("User logged out successfully");
    });
  });
});

// Set up routes for the application
app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use("/articles", articleRouter);
app.use("/communities", communityRouter);
app.use("/messages", messageRouter);

// Set up socket.io
setupSocket(server);

// Start the server
server.listen(port, () => {
  console.log(`🚀 Server running on PORT: ${port}`);
});

// Export the app
module.exports = app;
