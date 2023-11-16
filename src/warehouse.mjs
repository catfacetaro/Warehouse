import { WarehouseModel } from './model.mjs';
import { WarehouseDisplay } from './display.mjs';

var model = null;
var display = null;

var btnMoveUp = null;
var btnMoveDown = null;
var btnMoveLeft = null;
var btnMoveRight = null;

var btnRestart = null;
var btnUndo = null;
var btnPreviousSet = null;
var btnNextSet = null;
var btnPreviousLevel = null;
var btnNextLevel = null;

function main() {
    var canvasStateDisplay = document.getElementById( "canvas-state-display" );

    var labelSetName = document.getElementById( "label-set-name" );
    var labelLevelName = document.getElementById( "label-level-name" );
    var labelMovesCount = document.getElementById( "label-moves-count" );

    btnMoveUp = document.getElementById( "btn-move-up" );
    btnMoveDown = document.getElementById( "btn-move-down" );
    btnMoveLeft = document.getElementById( "btn-move-left" );
    btnMoveRight = document.getElementById( "btn-move-right" );

    btnRestart = document.getElementById( "btn-restart" );
    btnUndo = document.getElementById( "btn-undo" );
    btnPreviousSet = document.getElementById( "btn-previous-set" );
    btnNextSet = document.getElementById( "btn-next-set" );
    btnPreviousLevel = document.getElementById( "btn-previous-level" );
    btnNextLevel = document.getElementById( "btn-next-level" );

    model = new WarehouseModel();
    display = new WarehouseDisplay( model, canvasStateDisplay, labelSetName, labelLevelName, labelMovesCount );

    window.addEventListener( "keydown", handleKeyEvent );
    window.addEventListener( "resize", handleResizeEvent );
    btnMoveUp.addEventListener( "click", handleMouseClickEvent );
    btnMoveDown.addEventListener( "click", handleMouseClickEvent );
    btnMoveLeft.addEventListener( "click", handleMouseClickEvent );
    btnMoveRight.addEventListener( "click", handleMouseClickEvent );
    btnRestart.addEventListener( "click", handleMouseClickEvent );
    btnUndo.addEventListener( "click", handleMouseClickEvent );
    btnPreviousSet.addEventListener( "click", handleMouseClickEvent );
    btnNextSet.addEventListener( "click", handleMouseClickEvent );
    btnPreviousLevel.addEventListener( "click", handleMouseClickEvent );
    btnNextLevel.addEventListener( "click", handleMouseClickEvent );
}

function handleKeyEvent( event ) {
    // console.log( event.key );
    switch ( event.key ) {
        case "ArrowUp":
        case "Up":
            if ( event.ctrlKey ) {
                model.previousLevelSet();
            }
            else if ( !event.altKey && !event.shiftKey ) {
                model.moveUp();
            }
            break;
        case "ArrowDown":
        case "Down":
            if ( event.ctrlKey ) {
                model.nextLevelSet();
            }
            else if ( !event.altKey && !event.shiftKey ) {
                model.moveDown();
            }
            break;
        case "ArrowLeft":
        case "Left":
            if ( event.ctrlKey ) {
                model.previousLevel();
            }
            else if ( !event.altKey && !event.shiftKey ) {
                model.moveLeft();
            }
            break;
        case "ArrowRight":
        case "Right":
            if ( event.ctrlKey ) {
                model.nextLevel();
            }
            else if ( !event.altKey && !event.shiftKey ) {
                model.moveRight();
            }
            break;
        case "Home":
            if ( event.ctrlKey ) {
                model.restart();
            }
            break;
        case "Backspace":
            if ( !event.ctrlKey && !event.altKey && !event.shiftKey ) {
                model.undoMove();
            }
            break;
        default:
            break;
    }
}

function handleResizeEvent( event ) {
    display.update();
}

function handleMouseClickEvent( event ) {
    if ( event.currentTarget === btnMoveUp ) {
        model.moveUp();
    }
    else if ( event.currentTarget === btnMoveDown ) {
        model.moveDown();
    }
    else if ( event.currentTarget === btnMoveLeft ) {
        model.moveLeft();
    }
    else if ( event.currentTarget === btnMoveRight ) {
        model.moveRight();
    }
    else if ( event.currentTarget === btnRestart ) {
        model.restart();
    }
    else if ( event.currentTarget === btnUndo ) {
        model.undoMove();
    }
    else if ( event.currentTarget === btnPreviousSet ) {
        model.previousLevelSet();
    }
    else if ( event.currentTarget === btnNextSet ) {
        model.nextLevelSet();
    }
    else if ( event.currentTarget === btnPreviousLevel ) {
        model.previousLevel();
    }
    else if ( event.currentTarget === btnNextLevel ) {
        model.nextLevel();
    }
}

window.addEventListener( "load", main );
