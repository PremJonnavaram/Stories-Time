const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const flash = require("connect-flash");
const session = require("express-session");
const morgan = require("morgan");
const path = require("path");
const config = require("./config/key");


const app = express();

// Passport Config
require("./config/passport")(passport);

// EJS
app.set("view engine", "ejs");

// Mongodb connection
const connectDB = async () => {
  try {
    await mongoose.connect(config.dbURI, {
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


app.use(express.static(__dirname + "/public"));
app.use("/static", express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(morgan("dev"));


app.use(session({
  secret: 'it is project secret.',
  resave: true,
  saveUninitialized: true,
  cookie: {expires: 600000},
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// ROUTES 
app.use("/"  , require("./routes/user.js"));
app.use("/home", require("./routes/secondHome_routes"));

//LISTENING ON PORT 3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("server is Listening on port 3000");
});
