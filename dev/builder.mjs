import { default as FS } from 'fs';
import { default as PATH } from 'path';

import { default as HTML_MINIFIER } from 'html-minifier-terser';
import { default as CLEAN_CSS } from 'clean-css';
import * as TERSER from 'terser';
import SASS from 'sass';
import * as EJS from 'ejs';
import { XMLParser } from 'fast-xml-parser';
import { default as SHOWDOWN } from 'showdown';
import { JSDOM } from 'jsdom';

const HTML_MINIFIER_OPTIONS = { minifyCSS: true, minifyJS: true, removeComments: true, collapseWhitespace: true };
const CSS_CLEANER = new CLEAN_CSS();
const FXP = new XMLParser( { ignoreAttributes: false, trimValues: false } );

function copyFile( sourcePath, targetPath ) {
  console.log( 'Copying file \'' + sourcePath + '\' to \'' + targetPath + '\'' );
  FS.copyFileSync( sourcePath, targetPath );
}

async function processJsFile( sourcePath, targetPath, toMinify ) {
  if ( !toMinify ) {
    copyFile( sourcePath, targetPath );
    return;
  }

  console.log( 'Minifying file \'' + sourcePath + '\' to \'' + targetPath + '\'' );
  var content = FS.readFileSync( sourcePath, 'utf8' );
  return TERSER.minify( content ).then( result => {
    if ( result.error !== undefined ) {
      throw result.error;
    }
    FS.writeFileSync( targetPath, result.code, 'utf8' );
  } );
}

async function processHtmlFile( sourcePath, targetPath, toMinify ) {
  if ( !toMinify ) {
    copyFile( sourcePath, targetPath );
    return;
  }

  console.log( 'Minifying file \'' + sourcePath + '\' to \'' + targetPath + '\'' );
  var content = FS.readFileSync( sourcePath, 'utf8' );
  return HTML_MINIFIER.minify( content, HTML_MINIFIER_OPTIONS ).then( result => {
    FS.writeFileSync( targetPath, result, 'utf8' );
  } );
}

function processCssFile( sourcePath, targetPath, toMinify ) {
  if ( !toMinify ) {
    copyFile( sourcePath, targetPath );
    return;
  }

  console.log( 'Minifying file \'' + sourcePath + '\' to \'' + targetPath + '\'' );
  var content = FS.readFileSync( sourcePath, 'utf8' );
  var result = CSS_CLEANER.minify( content );
  if ( result.errors.length > 0 ) {
    throw result.errors;
  }
  FS.writeFileSync( targetPath, result.styles, 'utf8' );
}

function processJsonFile( sourcePath, targetPath, toMinify ) {
  var sourceEjsPath = PATH.join( PATH.dirname( sourcePath ), PATH.basename( sourcePath, PATH.extname( sourcePath ) ) + '.ejs' );
  if ( FS.existsSync( sourceEjsPath ) ) {
    // json is used for ejs, skip
    return;
  }

  if ( !toMinify ) {
    copyFile( sourcePath, targetPath );
    return;
  }

  console.log( 'Minifying file \'' + sourcePath + '\' to \'' + targetPath + '\'' );
  var content = FS.readFileSync( sourcePath, 'utf8' );
  var result = JSON.stringify( JSON.parse( content ) );
  FS.writeFileSync( targetPath, result, 'utf8' );
}

function processSassFile( sourcePath, targetPath, toMinify ) {
  console.log( 'Building file \'' + sourcePath + '\' to \'' + targetPath + '\'' );
  var content = FS.readFileSync( sourcePath, 'utf8' );
  var sassResult = SASS.compileString( content );

  if ( !toMinify ) {
    FS.writeFileSync( targetPath, sassResult.css, 'utf8' );
    return;
  }

  var minifyResult = CSS_CLEANER.minify( sassResult.css );
  if ( minifyResult.errors.length > 0 ) {
    throw minifyResult.errors;
  }
  FS.writeFileSync( targetPath, minifyResult.styles, 'utf8' );
}

async function processEjsFile( sourcePath, targetPath, toMinify ) {
  var sourceJsonPath = PATH.join( PATH.dirname( sourcePath ), PATH.basename( sourcePath, PATH.extname( sourcePath ) ) + '.json' );
  if ( !FS.existsSync( sourceJsonPath ) ) {
    // missing json, skip
    return;
  }

  console.log( 'Building file \'' + sourcePath + '\' to \'' + targetPath + '\'' );
  var ejsContent = FS.readFileSync( sourcePath, 'utf8' );
  var jsonContent = FS.readFileSync( sourceJsonPath, 'utf8' );

  var ejsResult = EJS.render( ejsContent, JSON.parse( jsonContent ) );

  if ( !toMinify ) {
    FS.writeFileSync( targetPath, ejsResult, 'utf8' );
    return;
  }

  return HTML_MINIFIER.minify( ejsResult, HTML_MINIFIER_OPTIONS ).then( minifyResult => {
    FS.writeFileSync( targetPath, minifyResult, 'utf8' );
  } );
}

export function removePath( path ) {
  if ( !FS.existsSync( path ) ) {
    console.log( '\'' + path + '\' does not exist.' );
    return;
  }

  var stats = FS.lstatSync( path );
  if ( stats.isDirectory() ) {
    var entries = FS.readdirSync( path, 'utf8' );
    entries.forEach( entry => removePath( PATH.join( path, entry ) ) );

    console.log( 'Removing directory \'' + path + '\'' );
    FS.rmdirSync( path );
  }
  else if ( stats.isFile() ) {
    console.log( 'Removing file \'' + path + '\'' );
    FS.unlinkSync( path );
  }
}

export async function processPath( sourcePath, targetPath, toMinify = true ) {
  if ( !FS.existsSync( sourcePath ) ) {
    console.log( '\'' + sourcePath + '\' does not exist.' );
    return;
  }

  var stats = FS.lstatSync( sourcePath );
  if ( stats.isDirectory() ) {
    if ( !FS.existsSync( targetPath ) ) {
      console.log( 'Creating directory \'' + targetPath + '\'' );
      FS.mkdirSync( targetPath, { recursive: true } );
    }

    var entries = FS.readdirSync( sourcePath, { withFileTypes: true } ).sort( ( a, b ) => {
      if ( a.isDirectory() && b.isFile() ) {
        return -1;
      }
      else if ( a.isFile() && b.isDirectory() ) {
        return 1;
      }
      return a.name.localeCompare( b.name );
    } );

    var p = Promise.resolve();
    entries.forEach( entry => {
      p = p.then( () => processPath( PATH.join( sourcePath, entry.name ), PATH.join( targetPath, entry.name ), toMinify ) );
    } );
    return p;
  }
  else if ( stats.isFile() ) {
    var sourceExt = PATH.extname( sourcePath );
    switch ( sourceExt ) {
      case '.js':
      case '.mjs':
        return processJsFile( sourcePath, targetPath, toMinify );
      case '.html':
      case '.svg':
        return processHtmlFile( sourcePath, targetPath, toMinify );
      case '.css':
        return processCssFile( sourcePath, targetPath, toMinify );
      case '.json':
        return processJsonFile( sourcePath, targetPath, toMinify );
      case '.sass':
      case '.scss':
        targetPath = PATH.join( PATH.dirname( targetPath ), PATH.basename( targetPath, PATH.extname( targetPath ) ) + '.css' );
        return processSassFile( sourcePath, targetPath, toMinify );
      case '.ejs':
        targetPath = PATH.join( PATH.dirname( targetPath ), PATH.basename( targetPath, PATH.extname( targetPath ) ) + '.html' );
        return processEjsFile( sourcePath, targetPath, toMinify );
      default:
        return copyFile( sourcePath, targetPath );
    }
  }
}

export function generateLevels( slcsDir, outputFilePath ) {
  // get all slc file paths
  var slcFilePathList = FS.readdirSync( slcsDir, { withFileTypes: true } ).filter(
    entry => ( entry.isFile() && entry.name.endsWith( '.slc' ) ) ).map(
      dirEnt => PATH.join( dirEnt.path, dirEnt.name ) );

  // convert each slc file to levelSet object
  var levelSetList = slcFilePathList.map( slcFilePath => {
    console.info( 'Reading file \'%s\'', slcFilePath );

    // read slc file
    var slcContent = FS.readFileSync( slcFilePath, 'utf8' );

    // convert to javascript object
    var slcObj = FXP.parse( slcContent );

    // create levelSet object
    var levelSet = {};
    levelSet.title = slcObj[ 'SokobanLevels' ][ 'Title' ];
    levelSet.levels = slcObj[ 'SokobanLevels' ][ 'LevelCollection' ][ 'Level' ].map(
      level => { return { title: level[ '@_Id' ], level: level[ 'L' ] } } );
    return levelSet;
  } );

  // sort levelSetList according to title
  levelSetList.sort( ( a, b ) => a.title.toLowerCase().localeCompare( b.title.toLowerCase() ) );

  var outputSource = 'export const LEVEL_SETS=' + JSON.stringify( levelSetList ) + ';';

  // write output file
  console.info( 'Writing file \'%s\'', outputFilePath );
  FS.mkdirSync( PATH.dirname( outputFilePath ), { recursive: true } );
  FS.writeFileSync( outputFilePath, outputSource, 'utf8' );
}

export async function generateIndex( mdFilePath, containerFilePath, outputFilePath ) {
  console.log( 'Generating index' );

  if ( !FS.existsSync( mdFilePath ) ) {
    console.log( '\'' + mdFilePath + '\' does not exist.' );
    return;
  }

  if ( !FS.existsSync( containerFilePath ) ) {
    console.log( '\'' + containerFilePath + '\' does not exist.' );
    return;
  }

  console.log( 'Reading \'' + mdFilePath + '\'' );
  var mdContent = FS.readFileSync( mdFilePath, 'utf8' );

  console.log( 'Reading \'' + containerFilePath + '\'' );
  var containerContent = FS.readFileSync( containerFilePath, 'utf8' );

  var converter = new SHOWDOWN.Converter();
  var containerDom = new JSDOM( containerContent );
  var containerNode = containerDom.window.document.querySelector( '#container' );
  containerNode.innerHTML = converter.makeHtml( mdContent );
  return HTML_MINIFIER.minify( containerDom.serialize(), HTML_MINIFIER_OPTIONS ).then( outputContent => {
    console.log( 'Writing \'' + outputFilePath + '\'' );
    FS.writeFileSync( outputFilePath, outputContent, 'utf8' );
  } )
}
