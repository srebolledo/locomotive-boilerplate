var mongoose = require( 'mongoose' );
var crypto = require( 'crypto' );
var modelName = __filename.split( "/" )[ __filename.split( "/" ).length - 1 ].split( "." )[ 0 ].capitalize();
var logger = require('log4js' ).getLogger(modelName + ' model');

var schema = {
    name  : modelName,
    schema: {
        id      : String,
        username: String,
        password: String,
        email   : String,
    }
};

var methods = {};
var statics = {};

statics.validPassword = function ( user, password ) {
    return user._doc.password == password;
};
statics.createUser = function ( userData, cb ) {
    var newUser = this.model( schema.name )( {
        username: userData.username,
        password: crypto.createHash( 'sha1' ).update( userData.password ).digest( 'hex' ),
        email   : userData.username
    } );
    newUser.save( function ( err ) {
        if ( err ) {
            logger.info( err );
            return cb( err );

        }
        cb();
    } );
};

statics.createDefaultUser = function(cb){
    var self = this;
    var password = Math.random().toString(36).substring(7);
    logger.info("The default user is testing and default password is", password);
    this.model(schema.name).findOne({username: 'testing'}, function(err, doc){
        if(err){
            logger.error(err);
            return cb(err);
        }
        if(doc != null){
            doc.password = crypto.createHash( 'sha1' ).update(password).digest( 'hex' );
            doc.save(function(err){
                if(err){
                    logger.info(err);
                    return cb(err);
                }
                cb();
            });
        }
        else{
            var newUser = self.model( schema.name )( {
                username: 'testing',
                password: crypto.createHash( 'sha1' ).update(password).digest( 'hex' ),
                email   : "test@test.test"
            } );
            newUser.save( function ( err ) {
                if ( err ) {
                    logger.info( err );
                    return cb( err );
                }
                cb();
            } );
        }

    });
    
}


module.exports = function () {
    schema.schema = new mongoose.Schema( schema.schema );

    //Defining methods
    schema.schema.methods = methods;
    schema.schema.statics = statics;

    return schema;
}();
