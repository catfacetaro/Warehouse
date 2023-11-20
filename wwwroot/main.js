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

var mainDisplay = null;
var currentLevelSetIndex = 0;
var currentLevelIndex = 0;
var setLevelTimeoutId = null;

var setLevel = function ( setIndex, levelIndex ) {
    if ( setLevelTimeoutId !== null ) {
        clearTimeout( setLevelTimeoutId );
        setLevelTimeoutId = null;
    }

    currentLevelSetIndex = setIndex;
    currentLevelIndex = levelIndex;
    mainDisplay.reset( _convert_level( levelSets[ setIndex ][ "levels" ][ levelIndex ][ "level" ] ) );
}

var setToSameSetNextLevel = function () {
    var nextLevelIndex = currentLevelIndex + 1;

    if ( nextLevelIndex >= levelSets[ currentLevelSetIndex ][ "levels" ].length ) {
        nextLevelIndex = 0;
    }

    setLevel( currentLevelSetIndex, nextLevelIndex );
}

var setToSameSetPreviousLevel = function () {
    var prevLevelIndex = currentLevelIndex - 1;

    if ( prevLevelIndex < 0 ) {
        prevLevelIndex = levelSets[ currentLevelSetIndex ][ "levels" ].length - 1;
    }

    setLevel( currentLevelSetIndex, prevLevelIndex );
}

var setToNextLevel = function () {
    var nextLevelSetIndex = currentLevelSetIndex;
    var nextLevelIndex = currentLevelIndex + 1;

    if ( nextLevelIndex >= levelSets[ currentLevelSetIndex ][ "levels" ].length ) {
        nextLevelIndex = 0;
        nextLevelSetIndex++;
    }
    if ( nextLevelSetIndex >= levelSets.length ) {
        nextLevelSetIndex = 0;
    }

    setLevel( nextLevelSetIndex, nextLevelIndex );
}

var setToPreviousLevel = function () {
    var prevLevelSetIndex = currentLevelSetIndex;
    var prevLevelIndex = currentLevelIndex - 1;

    if ( prevLevelIndex < 0 ) {
        prevLevelSetIndex--;
        if ( prevLevelSetIndex < 0 ) {
            prevLevelSetIndex = levelSets.length - 1;
        }
        prevLevelIndex = levelSets[ prevLevelSetIndex ][ "levels" ].length - 1;
    }

    setLevel( prevLevelSetIndex, prevLevelIndex );
}

var setToNextLevelSet = function () {
    var nextLevelSetIndex = currentLevelSetIndex + 1;
    var nextLevelIndex = 0;

    if ( nextLevelSetIndex >= levelSets.length ) {
        nextLevelSetIndex = 0;
    }

    setLevel( nextLevelSetIndex, nextLevelIndex );
}

var setToPreviousLevelSet = function () {
    var prevLevelSetIndex = currentLevelSetIndex - 1;
    var prevLevelIndex = 0;
    if ( prevLevelSetIndex < 0 ) {
        prevLevelSetIndex = levelSets.length - 1;
    }

    setLevel( prevLevelSetIndex, prevLevelIndex );
}

var keydown = function ( event ) {
    // console.log( event.key );
    switch ( event.key ) {
        case "ArrowUp":
        case "Up":
            if ( event.ctrlKey ) {
                setToPreviousLevelSet();
            }
            break;
        case "ArrowDown":
        case "Down":
            if ( event.ctrlKey ) {
                setToNextLevelSet();
            }
            break;
        case "ArrowLeft":
        case "Left":
            if ( event.ctrlKey ) {
                setToSameSetPreviousLevel();
            }
            break;
        case "ArrowRight":
        case "Right":
            if ( event.ctrlKey ) {
                setToSameSetNextLevel();
            }
            break;
        case " ":
            if ( event.ctrlKey ) {
                mainDisplay.reset();
            }
            break;
        case "Backspace":
            mainDisplay.undoLastMove();
            break;
        default:
            break;
    }
}

var updateMainPanel = function () {
    document.getElementById( "movesDisplay" ).textContent = mainDisplay.getNumberOfMoves();
    document.getElementById( "levelSetDisplay" ).textContent = levelSets[ currentLevelSetIndex ][ "title" ];
    document.getElementById( "levelDisplay" ).textContent = levelSets[ currentLevelSetIndex ][ "levels" ][ currentLevelIndex ][ "title" ];
}

var main = function () {
    mainDisplay = new WarehouseDisplay( "mainDisplay" );

    // listens to events
    mainDisplay.addEventListener( "stateChanged", updateMainPanel );
    window.addEventListener( "keydown", keydown );

    setLevel( 0, 0 );
}

// invoke main() after page has loaded
window.addEventListener( "load", main );
