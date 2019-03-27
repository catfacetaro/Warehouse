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

var WarehouseModel = function () {
    const STATE_CHANGED_EVENT_TYPE = "stateChanged";
    const STATE_CHANGED_EVENT = { source: this };
    const MOVEMENT_DELTA_UP = { x: 0, y: -1 };
    const MOVEMENT_DELTA_DOWN = { x: 0, y: 1 };
    const MOVEMENT_DELTA_LEFT = { x: -1, y: 0 };
    const MOVEMENT_DELTA_RIGHT = { x: 1, y: 0 };

    var _eventListenerMap = new Map();

    var _size = null;
    var _history = [ { move: null, state: null, pos: null, solved: null } ];

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
     * Returns the value at position of state.
     */
    var _getValueAtPosition = function ( state, pos ) {
        return state[ pos.y ][ pos.x ];
    }.bind( this );

    /**
     * Sets the value at position of state.
     */
    var _setValueAtPosition = function ( state, pos, value ) {
        state[ pos.y ] = state[ pos.y ].slice( 0, pos.x ) + value + state[ pos.y ].slice( pos.x + 1 );
    }.bind( this );


    /**
     * Returns whether position is within size.
     */
    var _isPositionWithinBounds = function ( pos, size ) {
        return ( pos.x >= 0 ) && ( pos.y >= 0 ) && ( pos.x < size.cols ) && ( pos.y < size.rows );
    }.bind( this );

    /**
     * Computes whether the game is solved.
     */
    var _computeIsSolved = function ( state ) {
        var goalCount = 0;
        var boxCount = 0;

        for ( var i = 0; i < state.length; i++ ) {
            for ( var j = 0; j < state[ i ].length; j++ ) {
                if ( state[ i ][ j ] === GOAL ) {
                    goalCount++;
                }
                else if ( state[ i ][ j ] === PLAYER_ON_GOAL ) {
                    goalCount++;
                }
                else if ( state[ i ][ j ] === BOX ) {
                    boxCount++;
                }
            }
        }

        return ( goalCount === 0 ) || ( boxCount === 0 );
    }.bind( this );

    /**
     * Implementation of player movement.
     */
    var _moveImpl = function ( posDelta, move, push ) {
        if ( _size === null ) {
            return;
        }

        var state = _history[ _history.length - 1 ].state;
        if ( state === null ) {
            return;
        }

        var solved = _history[ _history.length - 1 ].solved;
        if ( solved === null ) {
            return;
        }

        if ( solved ) {
            return;
        }

        var pos0 = _history[ _history.length - 1 ].pos;
        if ( pos0 === null ) {
            return;
        }

        var pos1 = { x: pos0.x + posDelta.x, y: pos0.y + posDelta.y };
        if ( !_isPositionWithinBounds( pos1, _size ) ) {
            return;
        }

        var val0 = _getValueAtPosition( state, pos0 );
        var val1 = _getValueAtPosition( state, pos1 );
        if ( ( val1 === EMPTY ) || ( val1 === GOAL ) ) {
            var newState = state.slice( 0 );
            _setValueAtPosition( newState, pos0, ( val0 == PLAYER ) ? EMPTY : GOAL );
            _setValueAtPosition( newState, pos1, ( val1 === EMPTY ) ? PLAYER : PLAYER_ON_GOAL );
            var newSolved = _computeIsSolved( newState );
            _history.push( { move: move, state: newState, pos: pos1, solved: newSolved } );
            setTimeout( _dispatchEvent, 0, STATE_CHANGED_EVENT_TYPE, STATE_CHANGED_EVENT );
        }

        var pos2 = { x: pos1.x + posDelta.x, y: pos1.y + posDelta.y };
        if ( !_isPositionWithinBounds( pos2, _size ) ) {
            return;
        }

        var val2 = _getValueAtPosition( state, pos2 );
        if ( ( val1 === BOX ) || ( val1 === BOX_ON_GOAL ) ) {
            if ( ( val2 === EMPTY ) || ( val2 === GOAL ) ) {
                var newState = state.slice( 0 );
                _setValueAtPosition( newState, pos0, ( val0 == PLAYER ) ? EMPTY : GOAL );
                _setValueAtPosition( newState, pos1, ( val1 === BOX ) ? PLAYER : PLAYER_ON_GOAL );
                _setValueAtPosition( newState, pos2, ( val2 === EMPTY ) ? BOX : BOX_ON_GOAL );
                var newSolved = _computeIsSolved( newState );
                _history.push( { move: push, state: newState, pos: pos1, solved: newSolved } );
                setTimeout( _dispatchEvent, 0, STATE_CHANGED_EVENT_TYPE, STATE_CHANGED_EVENT );
            }
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
     * Returns the number of rows and columns.
     */
    this.getSize = function () {
        return ( _size === null ) ? null : Object.assign( {}, _size );
    }.bind( this );

    /**
     * Returns the number of moves made.
     */
    this.getNumberOfMoves = function () {
        // less index 0
        return _history.length - 1;
    }.bind( this );

    /**
     * Returns the last move, or move at the specified number.
     */
    this.getMove = function ( moveNum ) {
        if ( moveNum === undefined ) {
            moveNum = _history.length - 1;
        }

        return _history[ moveNum ].move;
    }.bind( this );

    /**
     * Returns the current state, or the state at the end of the specified number of moves.
     */
    this.getState = function ( moveNum ) {
        if ( moveNum === undefined ) {
            moveNum = _history.length - 1;
        }

        var state = _history[ moveNum ].state;
        return ( state === null ) ? null : state.slice( 0 );
    }.bind( this );

    /**
     * Returns the current player's position, or the player's position at the end of the specified number of moves.
     */
    this.getPlayerPosition = function ( moveNum ) {
        if ( moveNum === undefined ) {
            moveNum = _history.length - 1;
        }

        var pos = _history[ moveNum ].pos;
        return ( pos === null ) ? null : Object.assign( {}, pos );
    }.bind( this );

    /**
     * Returns whether the game is solved at the end of current or specified move.
     */
    this.getIsSolved = function ( moveNum ) {
        if ( moveNum === undefined ) {
            moveNum = _history.length - 1;
        }
        return _history[ moveNum ].solved;
    }.bind( this );


    /**
     * Sets the game initial state.
     */
    this.setInitialState = function ( state ) {
        var newState = new Array( state.length );

        // find size
        var newSize = { rows: state.length, cols: 0 };
        for ( var i = 0; i < state.length; i++ ) {
            if ( state[ i ].length > newSize.cols ) {
                newSize.cols = state[ i ].length;
            }
        }

        // copies state, ensuring all rows are of length newSize.cols.
        for ( var i = 0; i < newSize.rows; i++ ) {
            newState[ i ] = state[ i ].padEnd( newSize.cols, EMPTY ).slice( 0, newSize.cols );
        }

        // find player
        var newPos = null;
        for ( var i = 0; i < newSize.rows; i++ ) {
            for ( var j = 0; j < newSize.cols; j++ ) {
                if ( ( newState[ i ][ j ] === PLAYER ) || ( newState[ i ][ j ] == PLAYER_ON_GOAL ) ) {
                    newPos = { x: j, y: i };
                    j = newSize.cols;
                    i = newSize.rows;
                }
            }
        }

        var newSolved = _computeIsSolved( newState );

        _size = newSize;
        _history = [ { move: null, state: newState, pos: newPos, solved: newSolved } ];
        setTimeout( _dispatchEvent, 0, STATE_CHANGED_EVENT_TYPE, STATE_CHANGED_EVENT );
    }.bind( this );

    /**
     * Moves player up.
     */
    this.moveUp = function () {
        _moveImpl( MOVEMENT_DELTA_UP, MOVE_UP, PUSH_UP );
    }.bind( this );

    /**
     * Moves player down.
     */
    this.moveDown = function () {
        _moveImpl( MOVEMENT_DELTA_DOWN, MOVE_DOWN, PUSH_DOWN );
    }.bind( this );

    /**
     * Moves player left.
     */
    this.moveLeft = function () {
        _moveImpl( MOVEMENT_DELTA_LEFT, MOVE_LEFT, PUSH_LEFT );
    }.bind( this );


    /**
     * Moves player right.
     */
    this.moveRight = function () {
        _moveImpl( MOVEMENT_DELTA_RIGHT, MOVE_RIGHT, PUSH_RIGHT );
    }.bind( this );

    /**
     * Undoes move.
     */
    this.undoMove = function () {
        if ( _history.length > 1 ) {
            _history = _history.slice( 0, _history.length - 1 );
            setTimeout( _dispatchEvent, 0, STATE_CHANGED_EVENT_TYPE, STATE_CHANGED_EVENT );
        }
    }.bind( this );

    /**
     * Reverts the game to the state at the end of the specified move.
     */
    this.revert = function ( moveNum ) {
        if ( moveNum === undefined ) {
            moveNum = 0;
        }

        _history = _history.slice( 0, moveNum + 1 );
        setTimeout( _dispatchEvent, 0, STATE_CHANGED_EVENT_TYPE, STATE_CHANGED_EVENT );
    }.bind( this );
}
