import { LEVEL_SETS } from "./levels.mjs";
import * as Constants from './constants.mjs';

export const STATE_CHANGED_EVENT_TYPE = 'stateChanged';

const MOVEMENT_DELTA_UP = { x: 0, y: -1 };
const MOVEMENT_DELTA_DOWN = { x: 0, y: 1 };
const MOVEMENT_DELTA_LEFT = { x: -1, y: 0 };
const MOVEMENT_DELTA_RIGHT = { x: 1, y: 0 };

function _getValueAtPosition( state, pos ) {
    return state[ pos.y ][ pos.x ];
}

function _setValueAtPosition( state, pos, value ) {
    state[ pos.y ] = state[ pos.y ].slice( 0, pos.x ) + value + state[ pos.y ].slice( pos.x + 1 );
}

function _isPositionWithinBounds( pos, size ) {
    return ( pos.x >= 0 ) && ( pos.y >= 0 ) && ( pos.x < size.cols ) && ( pos.y < size.rows );
}

function _deriveSize( state ) {
    var size = { rows: state.length, cols: 0 };
    state.forEach( row => {
        size.cols = Math.max( row.length, size.cols );
    } );
    return size;
}

function _derivePlayerPosition( state ) {
    var pos = null;
    loop:
    for ( var i = 0; i < state.length; i++ ) {
        for ( var j = 0; j < state[ i ].length; j++ ) {
            if ( ( state[ i ][ j ] === Constants.PLAYER ) || ( state[ i ][ j ] == Constants.PLAYER_ON_GOAL ) ) {
                pos = { x: j, y: i };
                break loop;
            }
        }
    }
    return pos;
}

function _copyState( state, size ) {
    return state.map( row => row.padEnd( size.cols, Constants.EMPTY ).slice( 0, size.cols ) );
}

function _deriveIsSolved( state ) {
    var goalCount = 0;
    var boxCount = 0;

    for ( var i = 0; i < state.length; i++ ) {
        for ( var j = 0; j < state[ i ].length; j++ ) {
            if ( state[ i ][ j ] === Constants.GOAL ) {
                goalCount++;
            }
            else if ( state[ i ][ j ] === Constants.PLAYER_ON_GOAL ) {
                goalCount++;
            }
            else if ( state[ i ][ j ] === Constants.BOX ) {
                boxCount++;
            }
        }
    }

    return ( goalCount === 0 ) || ( boxCount === 0 );
}

export class WarehouseModel {
    constructor() {
        this.#_updateState();
    }

    #_eventListenersMap = new Map();
    #_size = null;
    #_history = [ { move: null, state: null, pos: null, solved: null } ];
    #_curLevelSetIndex = 0;
    #_curLevelIndex = 0;

    #_getEventListeners( eventType = STATE_CHANGED_EVENT_TYPE ) {
        if ( this.#_eventListenersMap.has( eventType ) ) {
            return this.#_eventListenersMap.get( eventType );
        }

        var eventListeners = [];
        this.#_eventListenersMap.set( eventType, eventListeners );
        return eventListeners
    }

    #_fireEvent( eventType = STATE_CHANGED_EVENT_TYPE ) {
        var eventListeners = this.#_getEventListeners( eventType );
        var stateChangedEvent = { source: this };
        eventListeners.forEach( eventListener => eventListener( stateChangedEvent ) );
    }

    addEventListener( eventListener ) {
        var eventListeners = this.#_getEventListeners();

        // allow event listener to be only added once
        var index = eventListeners.indexOf( eventListener );
        if ( index < 0 ) {
            eventListeners.push( eventListener );
        }
    }

    removeEventListener( eventListener ) {
        var eventListeners = this.#_getEventListeners();

        var index = eventListeners.indexOf( eventListener );
        if ( index >= 0 ) {
            eventListeners.splice( index, 1 );
        }
    }

    get size() {
        return ( this.#_size === null ) ? null : Object.assign( {}, this.#_size );
    }

    get moveCount() {
        return this.#_history.length - 1;
    }

    get lastMove() {
        return this.#_history[ this.moveCount ].move;
    }

    get state() {
        // returns a copy
        var state = this.#_history[ this.moveCount ].state;
        return ( state === null ) ? null : state.slice( 0 );
    }

    get playerPosition() {
        // returns a copy
        var pos = this.#_history[ this.moveCount ].pos;
        return ( pos === null ) ? null : Object.assign( {}, pos );
    }

    get isSolved() {
        return this.#_history[ this.moveCount ].solved;
    }

    #_updateState() {
        var levelState = LEVEL_SETS[ this.#_curLevelSetIndex ][ "levels" ][ this.#_curLevelIndex ][ "level" ];
        var newSize = _deriveSize( levelState );
        var newState = _copyState( levelState, newSize );
        var newPos = _derivePlayerPosition( newState );
        var newIsSolved = _deriveIsSolved( newState );

        this.#_size = newSize;
        this.#_history = [ { move: null, state: newState, pos: newPos, solved: newIsSolved } ];
    }

    #_doMove( posDelta, move ) {
        var curSize = this.size;
        if ( curSize === null ) {
            return;
        }

        var curState = this.state;
        if ( curState === null ) {
            return;
        }

        var curIsSolved = this.isSolved;
        if ( curIsSolved === null ) {
            return;
        }

        if ( curIsSolved ) {
            return;
        }

        var p0 = this.playerPosition;
        if ( p0 === null ) {
            return;
        }

        var p1 = { x: p0.x + posDelta.x, y: p0.y + posDelta.y };
        if ( !_isPositionWithinBounds( p1, curSize ) ) {
            return;
        }

        var v0 = _getValueAtPosition( curState, p0 );
        var v1 = _getValueAtPosition( curState, p1 );

        if ( ( v1 === Constants.EMPTY ) || ( v1 === Constants.GOAL ) ) {
            var newV0 = ( v0 == Constants.PLAYER ) ? Constants.EMPTY : Constants.GOAL;
            var newV1 = ( v1 === Constants.EMPTY ) ? Constants.PLAYER : Constants.PLAYER_ON_GOAL;
            var newState = curState.slice( 0 );
            _setValueAtPosition( newState, p0, newV0 );
            _setValueAtPosition( newState, p1, newV1 );
            var newSolved = _deriveIsSolved( newState );
            this.#_history.push( { move: move, state: newState, pos: p1, solved: newSolved } );
            this.#_fireEvent();
            return;
        }

        var p2 = { x: p1.x + posDelta.x, y: p1.y + posDelta.y };
        if ( !_isPositionWithinBounds( p2, curSize ) ) {
            return;
        }

        var v2 = _getValueAtPosition( curState, p2 );
        if ( ( v1 === Constants.BOX ) || ( v1 === Constants.BOX_ON_GOAL ) ) {
            if ( ( v2 === Constants.EMPTY ) || ( v2 === Constants.GOAL ) ) {
                var newV0 = ( v0 == Constants.PLAYER ) ? Constants.EMPTY : Constants.GOAL;
                var newV1 = ( v1 === Constants.BOX ) ? Constants.PLAYER : Constants.PLAYER_ON_GOAL;
                var newV2 = ( v2 === Constants.EMPTY ) ? Constants.BOX : Constants.BOX_ON_GOAL;
                var newState = curState.slice( 0 );
                _setValueAtPosition( newState, p0, newV0 );
                _setValueAtPosition( newState, p1, newV1 );
                _setValueAtPosition( newState, p2, newV2 );
                var newSolved = _deriveIsSolved( newState );
                this.#_history.push( { move: move, state: newState, pos: p1, solved: newSolved } );
                this.#_fireEvent();
                return;
            }
        }
    }

    moveUp() {
        this.#_doMove( MOVEMENT_DELTA_UP, Constants.MOVE_UP );
    }

    moveDown() {
        this.#_doMove( MOVEMENT_DELTA_DOWN, Constants.MOVE_DOWN );
    }

    moveLeft() {
        this.#_doMove( MOVEMENT_DELTA_LEFT, Constants.MOVE_LEFT );
    }

    moveRight() {
        this.#_doMove( MOVEMENT_DELTA_RIGHT, Constants.MOVE_RIGHT );
    }

    undoMove() {
        if ( this.moveCount <= 0 ) {
            return;
        }

        this.#_history = this.#_history.slice( 0, this.moveCount );
        this.#_fireEvent();
    }

    restart() {
        if ( this.moveCount <= 0 ) {
            return;
        }

        this.#_history = this.#_history.slice( 0, 1 );
        this.#_fireEvent();
    }

    get levelSetCount() {
        return LEVEL_SETS.length;
    }

    get levelCount() {
        return LEVEL_SETS[ this.#_curLevelSetIndex ][ "levels" ].length;
    }

    get levelSetIndex() {
        return this.#_curLevelIndex;
    }

    get levelIndex() {
        return this.#_curLevelIndex;
    }

    get levelSetTitle() {
        return LEVEL_SETS[ this.#_curLevelSetIndex ][ "title" ];
    }

    get levelTitle() {
        return LEVEL_SETS[ this.#_curLevelSetIndex ][ "levels" ][ this.#_curLevelIndex ].title;
    }

    nextLevel() {
        var nextLevelIndex = this.#_curLevelIndex + 1;
        if ( nextLevelIndex >= LEVEL_SETS[ this.#_curLevelSetIndex ][ "levels" ].length ) {
            nextLevelIndex = 0;
        }
        this.#_curLevelIndex = nextLevelIndex;
        this.#_updateState();
        this.#_fireEvent();
    }

    previousLevel() {
        var prevLevelIndex = this.#_curLevelIndex - 1;
        if ( prevLevelIndex < 0 ) {
            prevLevelIndex = LEVEL_SETS[ this.#_curLevelSetIndex ][ "levels" ].length - 1;
        }
        this.#_curLevelIndex = prevLevelIndex;
        this.#_updateState();
        this.#_fireEvent();
    }

    nextLevelSet() {
        var nextLevelSetIndex = this.#_curLevelSetIndex + 1;
        if ( nextLevelSetIndex >= LEVEL_SETS.length ) {
            nextLevelSetIndex = 0;
        }
        this.#_curLevelSetIndex = nextLevelSetIndex;
        this.#_curLevelIndex = 0;
        this.#_updateState();
        this.#_fireEvent();
    }

    previousLevelSet() {
        var prevLevelSetIndex = this.#_curLevelSetIndex - 1;
        if ( prevLevelSetIndex < 0 ) {
            prevLevelSetIndex = LEVEL_SETS.length - 1;
        }
        this.#_curLevelSetIndex = prevLevelSetIndex;
        this.#_curLevelIndex = 0;
        this.#_updateState();
        this.#_fireEvent();
    }
}
