import { default as FS } from 'fs';
import { default as PATH } from 'path';
import { default as PROC } from 'process';
import { default as EXPRESS } from 'express';
import { default as HTTPTERM } from 'http-terminator';

const PORT = process.env.PORT || 8080;
const APP = EXPRESS();
const ROOT_DIR = 'build';
const DEFAULT_FILES = [ 'index.html' ];

function fixUrl( req, res, next ) {
  console.log( 'method=' + req.method + ', req.originalUrl=' + req.originalUrl + ', req.baseUrl=' + req.baseUrl + ', req.path=' + req.path );

  if ( req.method !== 'GET' ) {
    throw new Error( 'invalid method.' );
  }

  var queryString = req.originalUrl.replace( /^[^?]*/, '' );
  console.log( 'queryString=' + queryString + ', req.query=' + JSON.stringify( req.query ) );

  // replace '\' with '/'
  // remove multiple consecutive '/' with single '/'
  // remove ending '/'
  var newPath = req.path.replace( /\\/g, '/' ).replace( /\/{2,}/g, '/' ).replace( /\/$/, '' );
  if ( newPath === '' ) {
    newPath = '/';
  }
  if ( req.path === newPath ) {
    next();
    return;
  }
  var newUrl = newPath + queryString;
  console.log( 'redirect to ' + newUrl );
  res.redirect( newUrl );
}

function notFound( req, res, next ) {
  console.log( '404 Not Found.' );
  res.status( 404 );
  res.write( '404 Not Found.' );
  res.end();
}

function serverError( err, req, res, next ) {
  console.error( err.stack );
  console.log( '500 Server Error.' );
  res.status( 500 );
  res.write( '500 Server Error.' );
  res.end();
}

function shutdownServer( eventName, httpTerminator ) {
  return async () => {
    console.log( eventName + ' received.' );

    try {
      console.log( 'Shutting down server.' );
      await httpTerminator.terminate();
    }
    catch ( e ) {
      console.error( e );
    }
  };
}

function serveStatic( localBasePath ) {
  return ( req, res, next ) => {
    var localPath = PATH.join( localBasePath, decodeURIComponent( req.path ) );
    console.log( 'localPath=' + localPath );

    if ( !FS.existsSync( localPath ) ) {
      notFound( req, res, next );
      return;
    }

    if ( FS.lstatSync( localPath ).isDirectory() ) {
      var defaultFile = DEFAULT_FILES.find( file => {
        var path = PATH.join( localPath, file );
        return FS.existsSync( path ) && FS.lstatSync( path ).isFile();
      } );
      if ( defaultFile === undefined ) {
        notFound( req, res, next );
        return;
      }
      var queryString = req.originalUrl.replace( /^[^?]*/, '' );
      var newUrl = req.baseUrl + req.path;
      newUrl = newUrl.replace( /\/*$/, '/' ) + defaultFile + queryString;
      console.log( 'redirect to ' + newUrl );
      res.redirect( newUrl );
      return;
    }

    var baseName = PATH.basename( localPath );
    if ( baseName.startsWith( '.' ) ) {
      // do not serve filenames starting with '.'
      notFound( req, res, next );
      return;
    }

    console.log( 'serving file, localPath=' + localPath );
    var contentType = ( baseName.indexOf( '.' ) >= 0 ) ? baseName.replace( /^.*\./, '' ).toLowerCase() : '';
    var content = FS.readFileSync( localPath );
    res.type( contentType );
    res.send( content );
    res.end();
  };
}

APP.use( fixUrl );
APP.use( serveStatic( ROOT_DIR ) );
APP.use( serverError );

var server = APP.listen( PORT, () => {
  console.log( 'Server listening on port ' + PORT + '...' );
} );

const HTTP_TERMINATOR = HTTPTERM.createHttpTerminator( { server } );

PROC.on( 'SIGINT', shutdownServer( 'SIGINT', HTTP_TERMINATOR ) );
PROC.on( 'SIGTERM', shutdownServer( 'SIGTERM', HTTP_TERMINATOR ) );
