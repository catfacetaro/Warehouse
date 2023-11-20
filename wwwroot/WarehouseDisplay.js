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

var WarehouseDisplay = function ( canvasId ) {
    var _model = null;

    var _canvasId;
    var _canvasElement;

    /**
     * Sets the model to display.
     */
    this.setModel = function ( model ) {
        if ( _model !== null ) {
            _model.removeEventListener( "stateChanged", this.refresh );
        }
        _model = model;
        if ( _model !== null ) {
            _model.addEventListener( "stateChanged", this.refresh );
        }
        setTimeout( this.refresh, 0 );
    }.bind( this );

    /**
     * Refreshes display.
     * If canvas is resized, this function needs to be called.
     * Canvas does not trigger "resize" event, therefore unable to be done automatically.
     */
    this.refresh = function () {
        var deltaX = Math.abs( _canvasElement.width - _canvasElement.clientWidth );
        var deltaY = Math.abs( _canvasElement.height - _canvasElement.clientHeight );
        if ( Math.max( deltaX, deltaY ) >= 1 ) {
            // the canvas width and height attribute ( logical width and height ) must be set in html
            // setting the width and height alone in CSS will not change this logical width and height
            // force update to logical width and height only if the difference is too much
            _canvasElement.width = _canvasElement.clientWidth;
            _canvasElement.height = _canvasElement.clientHeight;
        }

        // get canvas context to start painting
        var ctx = _canvasElement.getContext( "2d" );

        // clear canvas
        ctx.fillStyle = "#758C8E";
        ctx.fillRect( 0, 0, _canvasElement.clientWidth, _canvasElement.clientHeight );

        if ( _model === null ) {
            return;
        }

        var moveNum = undefined;
        var size = _model.getSize();
        var state = _model.getState( moveNum );
        var playerDirection = _model.getMove( moveNum );

        if ( size === null ) {
            return;
        }

        if ( state === null ) {
            return;
        }

        if ( playerDirection === null ) {
            playerDirection = MOVE_DOWN;
        }

        // computes image size
        var imgSize = Math.min( _canvasElement.clientWidth / size.cols, _canvasElement.clientHeight / size.rows );

        // computes offset of top left image wrt display div
        var imgOffset = {};
        imgOffset.x = ( _canvasElement.clientWidth - size.cols * imgSize ) * 0.5;
        imgOffset.y = ( _canvasElement.clientHeight - size.rows * imgSize ) * 0.5;

        // set style and attribute of each child img elements
        for ( var i = 0; i < size.rows; i++ ) {
            for ( var j = 0; j < size.cols; j++ ) {
                var x = j * imgSize + imgOffset.x;
                var y = i * imgSize + imgOffset.y;
                var value = ( j < state[ i ].length ) ? state[ i ][ j ] : EMPTY;
                var image = null;
                if ( value === PLAYER ) {
                    image = _getImage( playerDirection );
                }
                else if ( value === PLAYER_ON_GOAL ) {
                    image = _getImage( playerDirection );
                }
                else {
                    image = _getImage( value );
                }
                if ( image !== null ) {
                    ctx.drawImage( image, x, y, imgSize, imgSize );
                }
            }
        }

        // draw solved image if game is solved
        if ( _model.getIsSolved( moveNum ) ) {
            // tint canvas
            ctx.fillStyle = "rgba( 0, 0, 0, 0.2 )";
            ctx.fillRect( 0, 0, _canvasElement.clientWidth, _canvasElement.clientHeight );

            imgSize = Math.min( _canvasElement.clientWidth, _canvasElement.clientHeight ) * 0.8;
            imgOffset.x = ( _canvasElement.clientWidth - imgSize ) * 0.5;
            imgOffset.y = ( _canvasElement.clientHeight - imgSize ) * 0.5;
            var image = _getImage( "solved" );
            if ( image !== null ) {
                ctx.drawImage( image, imgOffset.x, imgOffset.y, imgSize, imgSize );
            }
        }
    }.bind( this );

    _canvasId = canvasId;
    _canvasElement = document.getElementById( _canvasId );
}
