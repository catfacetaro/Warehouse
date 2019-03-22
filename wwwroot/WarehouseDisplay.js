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

var WarehouseDisplay = function ( canvasId ) {
    this._model = null;

    var _canvasId;
    var _canvasElement;

    // mouse or touch
    var _pointerStarted = false;
    var _pointerStartPosition = { x: 0, y: 0 };
    var _pointerEndPosition = { x: 0, y: 0 };

    // eventListeners
    var _eventListenerMap = new Map();

    /**
     * Move player up.
     */
    var _moveUp = function () {
        // restrict movement if game is currently solved.
        if ( _model.isSolved() ) {
            return;
        }

        if ( _model.moveUp() ) {
            // update display
            this.updateDisplay();

            _dispatchEvent( "stateChanged", null );
        }
    }.bind( this );

    /**
     * Move player down.
     */
    var _moveDown = function () {
        // restrict movement if game is currently solved.
        if ( _model.isSolved() ) {
            return;
        }

        if ( _model.moveDown() ) {
            // update display
            this.updateDisplay();

            _dispatchEvent( "stateChanged", null );
        }
    }.bind( this );

    /**
     * Move player left.
     */
    var _moveLeft = function () {
        // restrict movement if game is currently solved.
        if ( _model.isSolved() ) {
            return;
        }

        if ( _model.moveLeft() ) {
            // update display
            this.updateDisplay();

            _dispatchEvent( "stateChanged", null );
        }
    }.bind( this );

    /**
     * Move player right.
     */
    var _moveRight = function () {
        // restrict movement if game is currently solved.
        if ( _model.isSolved() ) {
            return;
        }

        if ( _model.moveRight() ) {
            // update display
            this.updateDisplay();

            _dispatchEvent( "stateChanged", null );
        }
    }.bind( this );

    /**
     * Handles mouse down or touch started event.
     */
    var _pointerStart = function ( event ) {
        var isMouseEvent = ( window.MouseEvent ) && ( event instanceof MouseEvent );
        var isTouchEvent = ( window.TouchEvent ) && ( event instanceof TouchEvent );

        if ( !isMouseEvent && !isTouchEvent ) {
            return;
        }

        if ( _pointerStarted ) {
            return;
        }

        _pointerStarted = true;
        if ( isMouseEvent ) {
            _pointerStartPosition.x = event.offsetX;
            _pointerStartPosition.y = event.offsetY;
        } else if ( isTouchEvent ) {
            _pointerStartPosition.x = event.touches[ 0 ].clientX;
            _pointerStartPosition.y = event.touches[ 0 ].clientY;
        }
    }.bind( this );

    /**
     * Handles mouse up or touch ended event.
     */
    var _pointerEnd = function ( event ) {
        var isMouseEvent = ( window.MouseEvent ) && ( event instanceof MouseEvent );
        var isTouchEvent = ( window.TouchEvent ) && ( event instanceof TouchEvent );

        if ( !isMouseEvent && !isTouchEvent ) {
            return;
        }

        if ( !_pointerStarted ) {
            return;
        }

        _pointerStarted = false;
        if ( isMouseEvent ) {
            _pointerEndPosition.x = event.offsetX;
            _pointerEndPosition.y = event.offsetY;
        } else if ( isTouchEvent ) {
            _pointerEndPosition.x = event.changedTouches[ 0 ].clientX;
            _pointerEndPosition.y = event.changedTouches[ 0 ].clientY;
        }

        var deltaY = _pointerEndPosition.y - _pointerStartPosition.y;
        var deltaX = _pointerEndPosition.x - _pointerStartPosition.x;
        var absDeltaY = Math.abs( deltaY );
        var absDeltaX = Math.abs( deltaX );
        if ( ( absDeltaY === 0 ) && ( absDeltaX === 0 ) ) {
            return;
        }
        else if ( absDeltaY >= absDeltaX ) {
            if ( deltaY > 0 ) {
                _moveDown();
            }
            else {
                _moveUp();
            }
        }
        else {
            if ( deltaX > 0 ) {
                _moveRight();
            }
            else {
                _moveLeft();
            }
        }
    }.bind( this );

    /**
     * Handles key down event.
     */
    var _keyDown = function ( event ) {
        switch ( event.key ) {
            case "ArrowUp":
            case "Up":
                _moveUp();
                break;
            case "ArrowDown":
            case "Down":
                _moveDown();
                break;
            case "ArrowLeft":
            case "Left":
                _moveLeft();
                break;
            case "ArrowRight":
            case "Right":
                _moveRight();
                break;
            default:
                break;
        }
    }.bind( this );

    /**
     * Updates display with model at the end of latest or specified move.
     * Canvas element does not trigger "resize" event.
     * If canvas size is programmatically changed, or possibly changed due to other events,
     * this function must be called to refresh the display.
     */
    this.updateDisplay = function ( moveNum ) {
        var state = _model.getState( moveNum );
        var playerDirection = _model.getMove( moveNum );

        var deltaX = Math.abs( _canvasElement.width - _canvasElement.clientWidth );
        var deltaY = Math.abs( _canvasElement.height - _canvasElement.clientHeight );
        if ( Math.max( deltaX, deltaY ) >= 1 ) {
            // the canvas width and height attribute ( logical width and height ) must be set in html
            // setting the width and height alone in CSS will not change this logical width and height
            // force update to logical width and height only if the difference is too much
            _canvasElement.width = _canvasElement.clientWidth;
            _canvasElement.height = _canvasElement.clientHeight;
        }

        var size = _model.getSize();
        if ( size.rows <= 0 ) {
            return;
        }
        if ( size.cols <= 0 ) {
            return;
        }

        // computes image size
        var imgSize = Math.min( _canvasElement.clientWidth / size.cols, _canvasElement.clientHeight / size.rows );

        // computes offset of top left image wrt display div
        var imgOffset = {};
        imgOffset.x = ( _canvasElement.clientWidth - size.cols * imgSize ) * 0.5;
        imgOffset.y = ( _canvasElement.clientHeight - size.rows * imgSize ) * 0.5;

        // get canvas context to start painting
        var ctx = _canvasElement.getContext( "2d" );

        // clear canvas
        ctx.fillStyle = "#758C8E";
        ctx.fillRect( 0, 0, _canvasElement.clientWidth, _canvasElement.clientHeight );

        // set style and attribute of each child img elements
        for ( var i = 0; i < size.rows; i++ ) {
            for ( var j = 0; j < size.cols; j++ ) {
                var x = j * imgSize + imgOffset.x;
                var y = i * imgSize + imgOffset.y;
                ctx.drawImage( _getImage( state[ i ][ j ], playerDirection ), x, y, imgSize, imgSize );
            }
        }

        // draw solved image if game is solved
        if ( _model.isSolved( moveNum ) ) {
            // tint canvas
            ctx.fillStyle = "rgba(0,0,0,0.2)";
            ctx.fillRect( 0, 0, _canvasElement.clientWidth, _canvasElement.clientHeight );

            imgSize = Math.min( _canvasElement.clientWidth, _canvasElement.clientHeight ) * 0.8;
            imgOffset.x = ( _canvasElement.clientWidth - imgSize ) * 0.5;
            imgOffset.y = ( _canvasElement.clientHeight - imgSize ) * 0.5;
            ctx.drawImage( _getSolvedImage(), imgOffset.x, imgOffset.y, imgSize, imgSize );
        }
    }.bind( this );

    /**
     * Resets model and update display.
     */
    this.reset = function ( state ) {
        _model.reset( state );
        this.updateDisplay();

        _dispatchEvent( "stateChanged", null );
    }.bind( this );

    /**
     * Take back last move.
     */
    this.undoLastMove = function () {
        var numMoves = _model.getNumberOfMoves();
        if ( numMoves > 0 ) {
            _model.revert( numMoves - 1 );
            this.updateDisplay();

            _dispatchEvent( "stateChanged", null );
        }
    }.bind( this );

    /**
     * Adds event listener, if it was not already added.
     */
    this.addEventListener = function ( eventType, eventListener ) {
        var eventTypeListeners;
        if ( _eventListenerMap.has( eventType ) ) {
            eventTypeListeners = _eventListenerMap.get( eventType );
        }
        else {
            eventTypeListeners = [];
            _eventListenerMap.set( eventType, eventTypeListeners );
        }

        // allow event listener to be only added once
        if ( eventTypeListeners.indexOf( eventListener ) < 0 ) {
            eventTypeListeners.push( eventListener );
        }
    }.bind( this );

    /**
     * Removes event listener, if it was already added.
     */
    this.removeEventListener = function ( eventType, eventListener ) {
        var eventTypeListeners;
        if ( _eventListenerMap.has( eventType ) ) {
            eventTypeListeners = _eventListenerMap.get( eventType );
        }
        else {
            eventTypeListeners = [];
            _eventListenerMap.set( eventType, eventTypeListeners );
        }

        var index = eventTypeListeners.indexOf( eventListener );
        if ( index >= 0 ) {
            eventTypeListeners.splice( index, 1 );
        }
    }.bind( this );

    /**
     * Dispatches event.
     */
    var _dispatchEvent = function ( eventType, event ) {
        if ( !_eventListenerMap.has( eventType ) ) {
            return;
        }
        var eventTypeListeners = _eventListenerMap.get( eventType );
        eventTypeListeners.forEach( eventListener => eventListener( event ) );
    }.bind( this );

    /**
     * Returns the number of moves.
     */
    this.getNumberOfMoves = function () {
        return _model.getNumberOfMoves();
    }.bind( this );

    /**
     * Returns whether game is solved.
     */
    this.isSolved = function () {
        return _model.isSolved();
    }.bind( this );

    _model = new WarehouseModel();

    _canvasId = canvasId;
    _canvasElement = document.getElementById( _canvasId );

    // listen to mouse events
    _canvasElement.addEventListener( "mousedown", _pointerStart );
    _canvasElement.addEventListener( "mouseup", _pointerEnd );
    _canvasElement.addEventListener( "mouseleave", _pointerEnd );

    // listen to touch events
    _canvasElement.addEventListener( "touchstart", _pointerStart );
    _canvasElement.addEventListener( "touchend", _pointerEnd );

    // listen to key events
    window.addEventListener( "keydown", _keyDown );
}
