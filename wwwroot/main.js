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
 * Level set and level control functions.
 */
var curLevelSetIndex = 0;
var curLevelIndex = 0;

var setToLevel = function ( levelSetIndex, levelIndex ) {
    mainModel.setInitialState( levelSets[ levelSetIndex ][ "levels" ][ levelIndex ][ "level" ] );
    curLevelSetIndex = levelSetIndex;
    curLevelIndex = levelIndex;
}

var setToNextLevelSet = function () {
    var nextLevelSetIndex = curLevelSetIndex + 1;
    var nextLevelIndex = 0;

    if ( nextLevelSetIndex >= levelSets.length ) {
        nextLevelSetIndex = 0;
    }

    setToLevel( nextLevelSetIndex, nextLevelIndex );
}

var setToPreviousLevelSet = function () {
    var prevLevelSetIndex = curLevelSetIndex - 1;
    var prevLevelIndex = 0;
    if ( prevLevelSetIndex < 0 ) {
        prevLevelSetIndex = levelSets.length - 1;
    }

    setToLevel( prevLevelSetIndex, prevLevelIndex );
}

var setToNextLevel = function ( enableLevelSetChange ) {
    var nextLevelSetIndex = curLevelSetIndex;
    var nextLevelIndex = curLevelIndex + 1;
    if ( enableLevelSetChange ) {
        if ( nextLevelIndex >= levelSets[ curLevelSetIndex ][ "levels" ].length ) {
            nextLevelIndex = 0;
            nextLevelSetIndex++;
        }
        if ( nextLevelSetIndex >= levelSets.length ) {
            nextLevelSetIndex = 0;
        }
    }
    else {
        if ( nextLevelIndex >= levelSets[ curLevelSetIndex ][ "levels" ].length ) {
            nextLevelIndex = 0;
        }
    }
    setToLevel( nextLevelSetIndex, nextLevelIndex );
}

var setToPreviousLevel = function ( enableLevelSetChange ) {
    var prevLevelSetIndex = curLevelSetIndex;
    var prevLevelIndex = curLevelIndex - 1;
    if ( enableLevelSetChange ) {
        if ( prevLevelIndex < 0 ) {
            prevLevelSetIndex--;
            if ( prevLevelSetIndex < 0 ) {
                prevLevelSetIndex = levelSets.length - 1;
            }
            prevLevelIndex = levelSets[ prevLevelSetIndex ][ "levels" ].length - 1;
        }
    }
    else {
        if ( prevLevelIndex < 0 ) {
            prevLevelIndex = levelSets[ curLevelSetIndex ][ "levels" ].length - 1;
        }
    }
    setToLevel( prevLevelSetIndex, prevLevelIndex );
}

/**
 * Keyboard event handler.
 */
var keydown = function ( event ) {
    // console.log( event.key );
    switch ( event.key ) {
        case "ArrowUp":
        case "Up":
            if ( event.ctrlKey ) {
                setToPreviousLevelSet();
            }
            else if ( !event.altKey && !event.shiftKey ) {
                mainModel.moveUp();
            }
            break;
        case "ArrowDown":
        case "Down":
            if ( event.ctrlKey ) {
                setToNextLevelSet();
            }
            else if ( !event.altKey && !event.shiftKey ) {
                mainModel.moveDown();
            }
            break;
        case "ArrowLeft":
        case "Left":
            if ( event.ctrlKey ) {
                setToPreviousLevel( false );
            }
            else if ( !event.altKey && !event.shiftKey ) {
                mainModel.moveLeft();
            }
            break;
        case "ArrowRight":
        case "Right":
            if ( event.ctrlKey ) {
                setToNextLevel( false );
            }
            else if ( !event.altKey && !event.shiftKey ) {
                mainModel.moveRight();
            }
            break;
        case "Enter":
            if ( event.ctrlKey ) {
                mainModel.revert( 0 );
            }
            break;
        case "Backspace":
            mainModel.undoMove();
            break;
        default:
            break;
    }
}

var updateMainPanel = function () {
    document.getElementById( "movesDisplay" ).textContent = mainModel.getNumberOfMoves();
    document.getElementById( "levelSetDisplay" ).textContent = levelSets[ curLevelSetIndex ][ "title" ];
    document.getElementById( "levelDisplay" ).textContent = ( curLevelIndex + 1 ) + " of " + levelSets[ curLevelSetIndex ][ "levels" ].length;
}

var mainDisplay = null;
var mainModel = null;

var main = function () {
    mainModel = new WarehouseModel();
    setToLevel( 0, 0 );

    mainDisplay = new WarehouseDisplay( "mainDisplay" );
    mainDisplay.setModel( mainModel );

    mainModel.addEventListener( "stateChanged", updateMainPanel );
    window.addEventListener( "keydown", keydown );
}

// invoke main() after page has loaded
window.addEventListener( "load", main );
