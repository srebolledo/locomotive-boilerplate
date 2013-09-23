var cwd = process.cwd();
var fs = require( 'fs' );
var logger = require('log4js' ).getLogger('Schema loader');

var Schemas = function () {
    logger.info( "Initializing schemas for the app" );
    var schema = [];
    fs.readdirSync( cwd + "/app/models" ).forEach( function ( file ) {
        var splitFile = file.split(".");
        var splitFileLen = splitFile.length;
        if(splitFile[splitFileLen-1].toLowerCase() == "js"){
          schema.push( {filename: file, schema: require( cwd + "/app/models/" + file ) });
        }
    } );

    return schema;
}
module.exports = {
    schemas: Schemas()
}
