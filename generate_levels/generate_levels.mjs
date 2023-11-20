/*
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

import { default as FS } from 'fs';
import { default as PATH } from 'path';
import { XMLParser } from 'fast-xml-parser';

const SOURCE_DIR = "../slc";
const OUTPUT_FILE = "../wwwroot/levels.js";

const FXP = new XMLParser();

export function generateLevels( slcDir, outputFilePath ) {
    // get all slc file paths
    var slcFilePathList = FS.readdirSync( slcDir, { withFileTypes: true } ).filter(
        entry => ( entry.isFile() && entry.name.endsWith( '.slc' ) ) ).map(
            dirEnt => PATH.join( dirEnt.path, dirEnt.name ) );

    // convert each slc file to levelSet object
    var levelSetList = slcFilePathList.map( slcFilePath => {
        console.info( 'Reading file \'%s\'', slcFilePath );

        // read slc file
        var slcContent = FS.readFileSync( slcFilePath, 'utf8' );

        // convert to javascript object
        var slcObj = FXP.parse( slcContent, { ignoreAttributes: false, trimValues: false } );

        // create levelSet object
        var levelSet = {};
        levelSet.title = slcObj[ 'SokobanLevels' ][ 'Title' ];
        levelSet.levels = slcObj[ 'SokobanLevels' ][ 'LevelCollection' ][ 'Level' ].map(
            level => { return { title: level[ '@_Id' ], level: level[ 'L' ] } } );
        return levelSet;
    } );

    // sort levelSetList according to title
    levelSetList.sort( ( a, b ) => a.title.toLowerCase().localeCompare( b.title.toLowerCase() ) );

    var outputSource = 'var levelSets=' + JSON.stringify( levelSetList ) + ';';

    // write output file
    console.info( 'Writing file \'%s\'', outputFilePath );
    FS.mkdirSync( PATH.dirname( outputFilePath ), { recursive: true } );
    FS.writeFileSync( outputFilePath, outputSource, 'utf8' );
}


generateLevels( SOURCE_DIR, OUTPUT_FILE );