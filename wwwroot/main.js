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
var mainLevelController = null;

var mainDisplayElement = null;
var mainDisplay = null;

var buttonDataMap = new Map();

var msgLine1Element = null;
var msgLine2Element = null;

var main = function () {
    // initialize mainModel
    mainModel = new WarehouseModel();

    // initialize mainLevelController
    mainLevelController = new LevelController( mainModel );
    mainLevelController.setToLevel( 0, 0 );

    // initialize main display elements and main display
    mainDisplayElement = document.getElementById( "main-display" );
    mainDisplay = new WarehouseDisplay( mainDisplayElement );
    mainDisplay.setModel( mainModel );

    // initialize button panel elements and data map
    var buttonDataItem = {};
    buttonDataItem.element = document.getElementById( "reset-level-button" );
    buttonDataItem.msgLine1 = "Reset Level";
    buttonDataItem.msgLine2 = "Key: Ctrl + Enter";
    buttonDataMap.set( buttonDataItem.element.id, buttonDataItem );
    buttonDataItem = {};
    buttonDataItem.element = document.getElementById( "undo-move-button" );
    buttonDataItem.msgLine1 = "Undo Move";
    buttonDataItem.msgLine2 = "Key: Backspace";
    buttonDataMap.set( buttonDataItem.element.id, buttonDataItem );
    buttonDataItem = {};
    buttonDataItem.element = document.getElementById( "prev-set-button" );
    buttonDataItem.msgLine1 = "Go To Previous Set";
    buttonDataItem.msgLine2 = "Key: Ctrl + <i class=\"fas fa-long-arrow-alt-up\"></i>";
    buttonDataMap.set( buttonDataItem.element.id, buttonDataItem );
    buttonDataItem = {};
    buttonDataItem.element = document.getElementById( "next-set-button" );
    buttonDataItem.msgLine1 = "Go To Next Set";
    buttonDataItem.msgLine2 = "Key: Ctrl + <i class=\"fas fa-long-arrow-alt-down\"></i>";
    buttonDataMap.set( buttonDataItem.element.id, buttonDataItem );
    buttonDataItem = {};
    buttonDataItem.element = document.getElementById( "prev-level-button" );
    buttonDataItem.msgLine1 = "Go To Previous Level";
    buttonDataItem.msgLine2 = "Key: Ctrl + <i class=\"fas fa-long-arrow-alt-left\"></i>";
    buttonDataMap.set( buttonDataItem.element.id, buttonDataItem );
    buttonDataItem = {};
    buttonDataItem.element = document.getElementById( "next-level-button" );
    buttonDataItem.msgLine1 = "Go To Next Level";
    buttonDataItem.msgLine2 = "Key: Ctrl + <i class=\"fas fa-long-arrow-alt-right\"></i>";
    buttonDataMap.set( buttonDataItem.element.id, buttonDataItem );

    // initialize message panel elements
    msgLine1Element = document.getElementById( "line-1" );
    msgLine2Element = document.getElementById( "line-2" );

    // listen to events
    mainModel.addEventListener( "stateChanged", updateMainPanel );
    window.addEventListener( "keydown", handleKey );
    mainDisplayElement.addEventListener( "pointerup", handleMove );
    buttonDataMap.forEach( item => {
        item.element.addEventListener( "click", handleButton );
        item.element.addEventListener( "mouseover", handleButton );
        item.element.addEventListener( "mouseout", handleButton );
    } );
}

var updateMainPanel = function () {
    document.getElementById( "moves-display" ).textContent = mainModel.getNumberOfMoves();
    document.getElementById( "set-display" ).textContent = mainLevelController.getLevelSetTitle();
    document.getElementById( "level-display" ).textContent = ( mainLevelController.getCurrentLevelIndex() + 1 ) + " of " + mainLevelController.getNumberOfLevels();
}

var handleKey = function ( event ) {
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

var handleMove = function ( event ) {
    if ( event.currentTarget.id === "main-display" ) {
        if ( event.type === "pointerup" ) {
            var pos = {};
            pos.x = event.offsetX;
            pos.y = event.offsetY;
            pos.x = pos.x - mainDisplayElement.clientWidth * 0.5;
            pos.y = pos.y - mainDisplayElement.clientHeight * 0.5;
            pos.absX = Math.abs( pos.x );
            pos.absY = Math.abs( pos.y );
            pos.absMax = Math.max( pos.absX, pos.absY );

            if ( pos.absMax > 10 ) {
                if ( pos.absY >= pos.absX ) {
                    if ( pos.y > 0 ) {
                        mainModel.moveDown();
                    }
                    else {
                        mainModel.moveUp();
                    }
                }
                else {
                    if ( pos.x > 0 ) {
                        mainModel.moveRight();
                    }
                    else {
                        mainModel.moveLeft();
                    }
                }
            }
        }
    }
}

var handleButton = function ( event ) {
    if ( event.type === "click" ) {
        if ( event.currentTarget.id === "reset-level-button" ) {
            mainModel.revert( 0 );
        }
        else if ( event.currentTarget.id === "undo-move-button" ) {
            mainModel.undoMove();
        }
        else if ( event.currentTarget.id === "prev-set-button" ) {
            mainLevelController.setToPreviousLevelSet();
        }
        else if ( event.currentTarget.id === "next-set-button" ) {
            mainLevelController.setToNextLevelSet();
        }
        else if ( event.currentTarget.id === "prev-level-button" ) {
            mainLevelController.setToPreviousLevel( false );
        }
        else if ( event.currentTarget.id === "next-level-button" ) {
            mainLevelController.setToNextLevel( false );
        }
    }
    else if ( event.type === "mouseover" ) {
        var dataItem = buttonDataMap.get( event.currentTarget.id );
        msgLine1Element.innerHTML = dataItem.msgLine1;
        msgLine2Element.innerHTML = dataItem.msgLine2;
    }
    else if ( event.type === "mouseout" ) {
        msgLine1Element.innerHTML = "";
        msgLine2Element.innerHTML = "";
    }
}

// invoke main() after page has loaded
window.addEventListener( "load", main );
