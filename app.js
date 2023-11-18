const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const flash = require("connect-flash");
const session = require("express-session");
const morgan = require("morgan");
const path = require("path");
const config = require("./config/key");
// const flash = require("express-flash");

const app = express();

// Passport Config
require("./config/passport")(passport);

// EJS
app.set("view engine", "ejs");

// Mongodb connection
const connectDB = async () => {
  await mongoose
    .connect(config.dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));
};
connectDB();

// Express body parser
app.use(express.urlencoded({ extended: true }));

//using middle wears
app.use(express.static(__dirname + "/public"));
app.use("/static", express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(morgan("dev"));

// Session
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
app.listen(3000, () => {
    console.log("server is Listening on port 3000");
});
