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

/* ======================================
 * Images store
 * ======================================
 */
const IMAGE_STORE = new Map();

var _preloadImage = function ( key, url ) {
    var img = new Image();
    img.src = url;
    IMAGE_STORE.set( key, img );
}

var _getImage = function ( key ) {
    var img = IMAGE_STORE.get( key );
    return ( img === undefined ) ? null : img;
}

_preloadImage( WALL, "wall.png" );
_preloadImage( BOX, "box.png" );
_preloadImage( BOX_ON_GOAL, "box_on_goal.png" );
_preloadImage( GOAL, "goal.png" );
_preloadImage( EMPTY, "empty.png" );
_preloadImage( MOVE_UP, "player_back.png" );
_preloadImage( MOVE_DOWN, "player_front.png" );
_preloadImage( MOVE_LEFT, "player_left.png" );
_preloadImage( MOVE_RIGHT, "player_right.png" );
_preloadImage( PUSH_UP, "player_back.png" );
_preloadImage( PUSH_DOWN, "player_front.png" );
_preloadImage( PUSH_LEFT, "player_left.png" );
_preloadImage( PUSH_RIGHT, "player_right.png" );
_preloadImage( "solved", "solved.svg" );
