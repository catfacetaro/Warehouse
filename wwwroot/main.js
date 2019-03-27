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

var mainModel = null;
var mainDisplay = null;
var mainLevelController = null;

var main = function () {
    // initialize mainModel
    mainModel = new WarehouseModel();

    // initialize mainDisplay
    mainDisplay = new WarehouseDisplay( "mainDisplay" );
    mainDisplay.setModel( mainModel );

    // initialize mainLevelController
    mainLevelController = new LevelController( mainModel );
    mainLevelController.setToLevel( 0, 0 );

    // listen to events
    mainModel.addEventListener( "stateChanged", updateMainPanel );
    window.addEventListener( "keydown", keyDown );
}

var updateMainPanel = function () {
    document.getElementById( "movesDisplay" ).textContent = mainModel.getNumberOfMoves();
    document.getElementById( "levelSetDisplay" ).textContent = mainLevelController.getLevelSetTitle();
    document.getElementById( "levelDisplay" ).textContent = ( mainLevelController.getCurrentLevelIndex() + 1 ) + " of " + mainLevelController.getNumberOfLevels();
}

var keyDown = function ( event ) {
    // console.log( event.key );
    switch ( event.key ) {
        case "ArrowUp":
        case "Up":
            if ( event.ctrlKey ) {
                mainLevelController.setToPreviousLevelSet();
            }
            else if ( !event.altKey && !event.shiftKey ) {
                mainModel.moveUp();
            }
            break;
        case "ArrowDown":
        case "Down":
            if ( event.ctrlKey ) {
                mainLevelController.setToNextLevelSet();
            }
            else if ( !event.altKey && !event.shiftKey ) {
                mainModel.moveDown();
            }
            break;
        case "ArrowLeft":
        case "Left":
            if ( event.ctrlKey ) {
                mainLevelController.setToPreviousLevel( false );
            }
            else if ( !event.altKey && !event.shiftKey ) {
                mainModel.moveLeft();
            }
            break;
        case "ArrowRight":
        case "Right":
            if ( event.ctrlKey ) {
                mainLevelController.setToNextLevel( false );
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

// invoke main() after page has loaded
window.addEventListener( "load", main );
