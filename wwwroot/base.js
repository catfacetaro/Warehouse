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

/******************************
 * Constants 
 ******************************/

const NORMAL = 0x00;
const GOAL = 0x10;

const EMPTY = 0x00;
const WALL = 0x01;
const BOX = 0x02;
const PLAYER = 0x03;

const UP = 0x100;
const DOWN = 0x0200;
const LEFT = 0x0300;
const RIGHT = 0x0400;


/******************************
 * Common functions
 ******************************/

/**
 * Returns the size of specified 2d array.
 */
var _array2d_getSizeOf = function ( array2d ) {
    var size = { rows: 0, cols: 0 };
    if ( array2d !== null ) {
        size.rows = array2d.length;
        for ( var i = 0; i < array2d.length; i++ ) {
            if ( array2d[ i ].length > size.cols ) {
                size.cols = array2d[ i ].length;
            }
        }
    }
    return size;
}

/**
 * Returns a copy of specified 2d array.
 */
var _array2d_copyOf = function ( array2d ) {
    if ( array2d === null ) {
        return null;
    }

    var newArray2d = new Array( array2d.length );
    for ( var i = 0; i < array2d.length; i++ ) {
        newArray2d[ i ] = array2d[ i ].slice( 0 );
    }
    return newArray2d;
}

/**
 * Converts sokoban level string array to 2d array state.
 */
var _convert_level = function ( sokobanLevel ) {
    var state = new Array( sokobanLevel.length );
    for ( var i = 0; i < sokobanLevel.length; i++ ) {
        state[ i ] = new Array( sokobanLevel[ i ].length );
        for ( var j = 0; j < sokobanLevel[ i ].length; j++ ) {
            switch ( sokobanLevel[ i ][ j ] ) {
                case ' ':
                    state[ i ][ j ] = NORMAL | EMPTY;
                    break;
                case '.':
                    state[ i ][ j ] = GOAL | EMPTY;
                    break;
                case '#':
                    state[ i ][ j ] = NORMAL | WALL;
                    break;
                case '$':
                    state[ i ][ j ] = NORMAL | BOX;
                    break;
                case '*':
                    state[ i ][ j ] = GOAL | BOX;
                    break;
                case '@':
                    state[ i ][ j ] = NORMAL | PLAYER;
                    break;
                case '+':
                    state[ i ][ j ] = GOAL | PLAYER;
                    break;
                default:
                    state[ i ][ j ] = NORMAL | EMPTY;
                    break;
            }
        }
    }
    return state;
}


/******************************
 * Images resources
 ******************************/

// predefined image resources
var imageResourceMap = new Map();
imageResourceMap.set( ( NORMAL | EMPTY ), { url: "normal_empty.png" } );
imageResourceMap.set( ( GOAL | EMPTY ), { url: "goal_empty.png" } );
imageResourceMap.set( ( NORMAL | BOX ), { url: "normal_box.png" } );
imageResourceMap.set( ( GOAL | BOX ), { url: "goal_box.png" } );
imageResourceMap.set( WALL, { url: "wall.png" } );
imageResourceMap.set( ( PLAYER | UP ), { url: "player_back.png" } );
imageResourceMap.set( ( PLAYER | DOWN ), { url: "player_front.png" } );
imageResourceMap.set( ( PLAYER | LEFT ), { url: "player_left.png" } );
imageResourceMap.set( ( PLAYER | RIGHT ), { url: "player_right.png" } );
imageResourceMap.set( "solved", { url: "solved.svg" } );

// preload all resources
for ( var resource of imageResourceMap.values() ) {
    resource.img = new Image();
    resource.img.src = resource.url;
}

/**
 * Returns the image resource map entry based on state value, player direction.
 */
var _getImageResourceMapEntry = function ( stateValue, playerDirection ) {
    if ( stateValue === undefined ) {
        stateValue = ( NORMAL | EMPTY );
    }

    if ( stateValue === null ) {
        stateValue = ( NORMAL | EMPTY );
    }

    if ( playerDirection === undefined ) {
        playerDirection = DOWN;
    }

    if ( playerDirection === null ) {
        playerDirection = DOWN;
    }

    if ( ( stateValue & 0x0f ) === WALL ) {
        return imageResourceMap.get( WALL );
    }

    if ( ( stateValue & 0x0f ) === PLAYER ) {
        return imageResourceMap.get( PLAYER | playerDirection );
    }

    return imageResourceMap.get( stateValue );
}

/**
 * Returns the image src url based on state value, player direction and image size
 */
var _getImageSrcUrl = function ( stateValue, playerDirection ) {
    return _getImageResourceMapEntry( stateValue, playerDirection )[ "url" ];
}

/**
 * Returns the image based on state value, player direction and image size
 */
var _getImage = function ( stateValue, playerDirection ) {
    return _getImageResourceMapEntry( stateValue, playerDirection )[ "img" ];
}

/**
 * Returns the solved image
 */
var _getSolvedImage = function () {
    return imageResourceMap.get( "solved" )[ "img" ];
}