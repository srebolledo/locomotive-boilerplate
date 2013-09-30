var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var logger = require('log4js' ).getLogger('Passport initializer');
var User = global.models.User;
var crypto = require('crypto');
var config = require('../config');

module.exports = function() {
    logger.info('Initializing passport');
    passport.serializeUser(function(user, done) {

        done(null, user);
    });
    passport.deserializeUser(function(id, done) {
        User.findById(id._id, function (err, user) {
            done(err, user);
        });
    });
    logger.info("Using local strategy");
    passport.use(new LocalStrategy(
        function(username, password, done) {
            User.findOne({ username: username }, function(err, user) {
                if (err) { return done(err); }
                if (!user) {
                    return done(null, false, { message: 'Incorrect username.' });
                }

                if (!(crypto.createHash('sha1' ).update( password ).digest('hex') == user.password)) {
                    return done(null, false, { message: 'Incorrect password.' });
                }
                return done(null, user);
            });
        }
    ));
    if(config.facebook.clientID != ""){
        logger.info("Using facebook strategy");
        passport.use(new FacebookStrategy({
                clientID: config.facebook.clientID,
                clientSecret: config.facebook.clientSecret,
                callbackURL: config.facebook.callbackURL 
            },
            function(accessToken, refreshToken, profile, done) {
                var user = new User();
                user.id = "f".concat(profile.id);
                user.username = profile.username;
                user.email = profile;
                user.payload = profile;
                user.provider = "facebook";
                user = user.toObject();
                delete user._id;
                User.findOneAndUpdate({id: user.id}, user, {new: true, upsert: true}, function(err, user){
                    logger.info(err, user);
                    done(null, user);
                })       
            }
        ));
    }
}