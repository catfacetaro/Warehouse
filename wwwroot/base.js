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

/*
 * Constants
 */
const MOVE_UP = "u";
const MOVE_DOWN = "d";
const MOVE_LEFT = "l";
const MOVE_RIGHT = "r";

const PUSH_UP = "U";
const PUSH_DOWN = "D";
const PUSH_LEFT = "L";
const PUSH_RIGHT = "R";

const WALL = "#";
const PLAYER = "@";
const PLAYER_ON_GOAL = "+";
const BOX = "$"
const BOX_ON_GOAL = "*"
const GOAL = "."
const EMPTY = " "

/*
 * Images resources
 */
const IMAGE_MAP = new Map();

var _createImage = function ( key, url ) {
    var img = new Image();
    img.src = url;
    IMAGE_MAP.set( key, img );
}

var _getImage = function ( key ) {
    var img = IMAGE_MAP.get( key );
    return ( img === undefined ) ? null : img;
}

_createImage( WALL, "wall.png" );
_createImage( BOX, "box.png" );
_createImage( BOX_ON_GOAL, "box_on_goal.png" );
_createImage( GOAL, "goal.png" );
_createImage( EMPTY, "empty.png" );
_createImage( MOVE_UP, "player_back.png" );
_createImage( MOVE_DOWN, "player_front.png" );
_createImage( MOVE_LEFT, "player_left.png" );
_createImage( MOVE_RIGHT, "player_right.png" );
_createImage( PUSH_UP, "player_back.png" );
_createImage( PUSH_DOWN, "player_front.png" );
_createImage( PUSH_LEFT, "player_left.png" );
_createImage( PUSH_RIGHT, "player_right.png" );
_createImage( "solved", "solved.svg" );
