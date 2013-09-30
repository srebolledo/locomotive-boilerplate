module.exports = {
    server:{
        address: "localhost",
        port: "3000"
    },
    mongodb: {
        host   : "localhost",
        port   : "27017",
        db_name: "dev_helper"
    },
    facebook:{
    	clientID: "588876477843061",
        clientSecret: "0006b7c70b6d0d25eb3ca9dbcbf7343f", 
        callbackURL: "http://localhost:3000/auth/facebook/callback"
    }

};
