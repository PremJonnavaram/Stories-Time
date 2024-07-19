const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/User'); 

module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
      done(null, user.id);
    });
  
    passport.deserializeUser(function(id, done) {
      User.findById(id)
        .then(user => {
          done(null, user);
        })
        .catch(err => {
          done(err);
        });
    });


  passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
      try {
        
        const user = await User.findOne({ email });

        
        if (!user) {
          return done(null, false, { message: 'Incorrect email or password' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Incorrect email or password' });
        }
      } catch (err) {
        return done(err);
      }
    })
  );
};
