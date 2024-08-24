const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const flash = require("connect-flash");
const session = require("express-session");
const morgan = require("morgan");
const path = require("path");
require("dotenv").config();  // Load environment variables from .env file

const app = express();

// Passport Config
require("./config/passport")(passport);
app.set('views', path.join(__dirname, 'views'));
// EJS
app.set("view engine", "ejs");

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
  }
};

connectDB();

// Express body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static files
app.use(express.static(path.join(__dirname, "public")));
app.use("/static", express.static(path.join(__dirname, "public")));

// Morgan (HTTP request logger)
app.use(morgan("dev"));

// Express session
app.use(session({
  secret: process.env.SECRET_KEY,  // Use secret from .env
  resave: true,
  saveUninitialized: true,
  cookie: { expires: 600000 },
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Routes
app.use("/", require("./routes/user.js"));
app.use("/home", require("./routes/secondHome_routes.js")); 

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
