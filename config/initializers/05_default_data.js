var logger = require('log4js' ).getLogger('Default data');
var User = global.models.User;
var crypto = require('crypto');

module.exports = function(done) {
    logger.info('Adding testing data');
    //Default user
    User.createDefaultUser(function(){
        logger.info("Upsert an user");
        done();
    });

}