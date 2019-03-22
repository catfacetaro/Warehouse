/**
 * Copyright 2019, Cat Face Taro
 * 
 * This file is part of Warehouse.
 *
 * Warehouse is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, version 3 of the License only.
 *
 * Warehouse is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Warehouse.  If not, see <https://www.gnu.org/licenses/>.
 */

const fs = require( "fs" );
const fxp = require( "fast-xml-parser" );
const entities = require( "entities" );

const SOURCE_DIR = "../slc";
const TARGET_FILE = "../wwwroot/levels.js";

function processSlcFile( slcFile ) {
    var fileId = null;
    try {
        var filePath = SOURCE_DIR + "/" + slcFile.name;

        console.info( "Processing file \"%s\"...", filePath );
        fileId = fs.openSync( filePath );
        var slcContent = fs.readFileSync( fileId, { encoding: "utf8" } );

        // convert xml to javascript object
        var slcObj = fxp.parse( slcContent, { ignoreAttributes: false, trimValues: false } );

        // convert object
        var levelSet = {};
        levelSet.title = entities.decodeXML( slcObj[ "SokobanLevels" ][ "Title" ] );
        levelSet.levels = slcObj[ "SokobanLevels" ][ "LevelCollection" ][ "Level" ].map( level => { return { title: entities.decodeXML( level[ "@_Id" ] ), level: level[ "L" ] } } );

        levelSetList.push( levelSet );
    }
    catch ( err ) {
        console.error( err.message );
        return;
    }
    finally {
        // close file
        if ( fileId !== null ) {
            try {
                fs.closeSync( fileId );
            }
            catch {
            }
        }
    }
}

function writeTargetFile( targetFilePath ) {
    var fileId = null;
    try {
        console.info( "Writing file \"%s\"...", targetFilePath );
        fileId = fs.openSync( targetFilePath, "w" );

        fs.writeSync( fileId, "var levelSets=" );
        fs.writeSync( fileId, JSON.stringify( levelSetList ) );
        fs.writeSync( fileId, ";" );
    }
    catch ( err ) {
        console.error( err.message );
        return false;
    }
    finally {
        // close file
        if ( fileId !== null ) {
            try {
                fs.closeSync( fileId );
            }
            catch {
            }
        }
    }
    return true;
}

// checks if source folder exists
console.info( "Checking source folder \"%s\"...", SOURCE_DIR );
if ( !fs.existsSync( SOURCE_DIR ) ) {
    console.error( "\"%s\" does not exist.", SOURCE_DIR );
    process.exit( 1 );
}

if ( !fs.lstatSync( SOURCE_DIR ).isDirectory() ) {
    console.error( "\"%s\" is not a directory.", SOURCE_DIR );
    process.exit( 1 );
}

// gets all slc files
var slcFiles = fs.readdirSync( SOURCE_DIR, { withFileTypes: true } ).filter( entry => ( entry.isFile() && entry.name.endsWith( ".slc" ) ) );

if ( slcFiles.length <= 0 ) {
    console.error( "No .slc files found." );
    process.exit( 1 );
}

// process each slc file
var levelSetList = [];
slcFiles.forEach( processSlcFile );

// write target file
if ( !writeTargetFile( TARGET_FILE ) ) {
    process.exit( 1 );
}

console.log( "Done." );
process.exit( 0 );
