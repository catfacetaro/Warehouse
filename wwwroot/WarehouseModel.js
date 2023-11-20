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

 var WarehouseModel = function () {
    var _size = { rows: 0, cols: 0 };
    var _history = [ { state: null, player: { x: -1, y: -1 } } ];

    /**
     * Returns the number of rows and columns.
     */
    this.getSize = function () {
        return Object.assign( {}, _size );
    }.bind( this );

    /**
     * Returns the number of moves made.
     */
    this.getNumberOfMoves = function () {
        return _history.length - 1;
    }.bind( this );


    /**
     * Returns the last move, or move at the specified number.
     */
    this.getMove = function ( moveNum ) {
        if ( moveNum === undefined ) {
            moveNum = _history.length - 1;
        }

        if ( moveNum === null ) {
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

        if ( moveNum === null ) {
            moveNum = _history.length - 1;
        }

        return _array2d_copyOf( _history[ moveNum ].state );
    }.bind( this );

    /**
     * Returns the current player's position, or the player's position at the end of the specified number of moves.
     */
    this.getPlayerPosition = function ( moveNum ) {
        if ( moveNum === undefined ) {
            moveNum = _history.length - 1;
        }

        if ( moveNum === null ) {
            moveNum = _history.length - 1;
        }

        return Object.assign( {}, _history[ moveNum ].player );
    }.bind( this );

    /**
     * Reverts the game to the state at the end of the specified move.
     */
    this.revert = function ( moveNum ) {
        if ( moveNum === undefined ) {
            // no change
            return;
        }

        if ( moveNum === null ) {
            // no change
            return;
        }

        _history = _history.slice( 0, moveNum + 1 );
    }.bind( this );

    /**
     * Resets the game to its initial state, or the new specified initial state.
     */
    this.reset = function ( state ) {
        if ( state === undefined ) {
            this.revert( 0 );
            return;
        }

        if ( state === null ) {
            this.revert( 0 );
            return;
        }

        var newSize = _array2d_getSizeOf( state );
        var newState = _array2d_copyOf( state );

        // find player
        var newPlayer = { x: -1, y: -1 };
        for ( var i = 0; i < newSize.rows; i++ ) {
            for ( var j = 0; j < newSize.cols; j++ ) {
                if ( ( newState[ i ][ j ] & 0x0f ) === PLAYER ) {
                    newPlayer.y = i;
                    newPlayer.x = j;
                    j = newSize.cols;
                    i = newSize.rows;
                }
            }
        }

        _size = newSize;
        _history = [ { state: newState, player: newPlayer } ];
    }.bind( this );

    /**
     * Moves player up.
     */
    this.moveUp = function () {
        var state = _history[ _history.length - 1 ].state;
        var player = _history[ _history.length - 1 ].player;

        if ( player.y <= 0 ) {
            return false;
        }

        if ( ( state[ player.y - 1 ][ player.x ] & 0x0f ) === EMPTY ) {
            var newState = _array2d_copyOf( state );
            newState[ player.y ][ player.x ] = ( newState[ player.y ][ player.x ] & 0xf0 ) | EMPTY;
            newState[ player.y - 1 ][ player.x ] = ( newState[ player.y - 1 ][ player.x ] & 0xf0 ) | PLAYER;
            var newPlayer = { x: player.x, y: player.y - 1 };
            _history.push( { move: UP, state: newState, player: newPlayer } );
            return true;
        }

        if ( player.y <= 1 ) {
            return false;
        }

        if ( ( state[ player.y - 1 ][ player.x ] & 0x0f ) === BOX ) {
            if ( ( state[ player.y - 2 ][ player.x ] & 0x0f ) === EMPTY ) {
                var newState = _array2d_copyOf( state );
                newState[ player.y ][ player.x ] = ( newState[ player.y ][ player.x ] & 0xf0 ) | EMPTY;
                newState[ player.y - 1 ][ player.x ] = ( newState[ player.y - 1 ][ player.x ] & 0xf0 ) | PLAYER;
                newState[ player.y - 2 ][ player.x ] = ( newState[ player.y - 2 ][ player.x ] & 0xf0 ) | BOX;
                var newPlayer = { x: player.x, y: player.y - 1 };
                _history.push( { move: UP, state: newState, player: newPlayer } );
            }
            return true;
        }

        return false;
    }.bind( this );

    /**
     * Moves player down.
     */
    this.moveDown = function () {
        var state = _history[ _history.length - 1 ].state;
        var player = _history[ _history.length - 1 ].player;

        if ( player.y >= _size.rows - 1 ) {
            return false;
        }

        if ( ( state[ player.y + 1 ][ player.x ] & 0x0f ) === EMPTY ) {
            var newState = _array2d_copyOf( state );
            newState[ player.y ][ player.x ] = ( newState[ player.y ][ player.x ] & 0xf0 ) | EMPTY;
            newState[ player.y + 1 ][ player.x ] = ( newState[ player.y + 1 ][ player.x ] & 0xf0 ) | PLAYER;
            var newPlayer = { x: player.x, y: player.y + 1 };
            _history.push( { move: DOWN, state: newState, player: newPlayer } );
            return true;
        }

        if ( player.y >= _size.rows - 2 ) {
            return false;
        }

        if ( ( state[ player.y + 1 ][ player.x ] & 0x0f ) === BOX ) {
            if ( ( state[ player.y + 2 ][ player.x ] & 0x0f ) === EMPTY ) {
                var newState = _array2d_copyOf( state );
                newState[ player.y ][ player.x ] = ( newState[ player.y ][ player.x ] & 0xf0 ) | EMPTY;
                newState[ player.y + 1 ][ player.x ] = ( newState[ player.y + 1 ][ player.x ] & 0xf0 ) | PLAYER;
                newState[ player.y + 2 ][ player.x ] = ( newState[ player.y + 2 ][ player.x ] & 0xf0 ) | BOX;
                var newPlayer = { x: player.x, y: player.y + 1 };
                _history.push( { move: DOWN, state: newState, player: newPlayer } );
            }
            return true;
        }

        return false;
    }.bind( this );

    /**
     * Moves player left.
     */
    this.moveLeft = function () {
        var state = _history[ _history.length - 1 ].state;
        var player = _history[ _history.length - 1 ].player;

        if ( player.x <= 0 ) {
            return false;
        }

        if ( ( state[ player.y ][ player.x - 1 ] & 0x0f ) === EMPTY ) {
            var newState = _array2d_copyOf( state );
            newState[ player.y ][ player.x ] = ( newState[ player.y ][ player.x ] & 0xf0 ) | EMPTY;
            newState[ player.y ][ player.x - 1 ] = ( newState[ player.y ][ player.x - 1 ] & 0xf0 ) | PLAYER;
            var newPlayer = { x: player.x - 1, y: player.y };
            _history.push( { move: LEFT, state: newState, player: newPlayer } );
            return true;
        }

        if ( player.x <= 1 ) {
            return false;
        }

        if ( ( state[ player.y ][ player.x - 1 ] & 0x0f ) === BOX ) {
            if ( ( state[ player.y ][ player.x - 2 ] & 0x0f ) === EMPTY ) {
                var newState = _array2d_copyOf( state );
                newState[ player.y ][ player.x ] = ( newState[ player.y ][ player.x ] & 0xf0 ) | EMPTY;
                newState[ player.y ][ player.x - 1 ] = ( newState[ player.y ][ player.x - 1 ] & 0xf0 ) | PLAYER;
                newState[ player.y ][ player.x - 2 ] = ( newState[ player.y ][ player.x - 2 ] & 0xf0 ) | BOX;
                var newPlayer = { x: player.x - 1, y: player.y };
                _history.push( { move: LEFT, state: newState, player: newPlayer } );
            }
            return true;
        }

        return false;
    }.bind( this );


    /**
     * Moves player right.
     */
    this.moveRight = function () {
        var state = _history[ _history.length - 1 ].state;
        var player = _history[ _history.length - 1 ].player;

        if ( player.x >= _size.cols - 1 ) {
            return false;
        }

        if ( ( state[ player.y ][ player.x + 1 ] & 0x0f ) === EMPTY ) {
            var newState = _array2d_copyOf( state );
            newState[ player.y ][ player.x ] = ( newState[ player.y ][ player.x ] & 0xf0 ) | EMPTY;
            newState[ player.y ][ player.x + 1 ] = ( newState[ player.y ][ player.x + 1 ] & 0xf0 ) | PLAYER;
            var newPlayer = { x: player.x + 1, y: player.y };
            _history.push( { move: RIGHT, state: newState, player: newPlayer } );
            return true;
        }

        if ( player.x >= _size.cols - 2 ) {
            return false;
        }

        if ( ( state[ player.y ][ player.x + 1 ] & 0x0f ) === BOX ) {
            if ( ( state[ player.y ][ player.x + 2 ] & 0x0f ) === EMPTY ) {
                var newState = _array2d_copyOf( state );
                newState[ player.y ][ player.x ] = ( newState[ player.y ][ player.x ] & 0xf0 ) | EMPTY;
                newState[ player.y ][ player.x + 1 ] = ( newState[ player.y ][ player.x + 1 ] & 0xf0 ) | PLAYER;
                newState[ player.y ][ player.x + 2 ] = ( newState[ player.y ][ player.x + 2 ] & 0xf0 ) | BOX;
                var newPlayer = { x: player.x + 1, y: player.y };
                _history.push( { move: RIGHT, state: newState, player: newPlayer } );
            }
            return true;
        }

        return false;
    }.bind( this );

    /**
     * Returns whether the game is solved at the end of current or specified move.
     */
    this.isSolved = function ( moveNum ) {
        var goalEmptyCount = 0;
        var normalBoxCount = 0;

        const GOAL_EMPTY = GOAL | EMPTY;
        const NORMAL_BOX = NORMAL | BOX;

        if ( moveNum === undefined ) {
            moveNum = _history.length - 1;
        }

        if ( moveNum === null ) {
            moveNum = _history.length - 1;
        }

        var state = _history[ moveNum ].state;
        var player = _history[ moveNum ].player;
        for ( var i = 0; i < _size.rows; i++ ) {
            for ( var j = 0; j < _size.cols; j++ ) {
                if ( state[ i ][ j ] === GOAL_EMPTY ) {
                    goalEmptyCount++;
                }
                else if ( state[ i ][ j ] === NORMAL_BOX ) {
                    normalBoxCount++;
                }
                else if ( ( i === player.y ) && ( j === player.x ) && ( ( state[ i ][ j ] & 0xf0 ) === GOAL ) ) {
                    goalEmptyCount++;
                }
            }
        }

        return ( goalEmptyCount === 0 ) || ( normalBoxCount === 0 );
    }.bind( this );
}
