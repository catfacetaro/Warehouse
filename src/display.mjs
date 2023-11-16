import * as Constants from './constants.mjs';
import * as ImageStore from './image.store.mjs';

export class WarehouseDisplay {
    constructor( model, canvasStateDisplay, labelSetName, labelLevelName, labelMovesCount ) {
        this.update = this.update.bind( this );

        this.#_canvasStateDisplay = canvasStateDisplay;
        this.#_labelSetName = labelSetName;
        this.#_labelLevelName = labelLevelName;
        this.#_labelMovesCount = labelMovesCount;

        this.#_model = model;
        this.#_model.addEventListener( this.update );

        this.update();
    }

    #_model = null;

    #_canvasStateDisplay = null;
    #_labelSetName = null;
    #_labelLevelName = null;
    #_labelMovesCount = null;

    #_updateCanvasStateDisplay() {
        if ( this.#_canvasStateDisplay === null ) {
            return;
        }

        // get canvas context to start painting
        var ctx = this.#_canvasStateDisplay.getContext( "2d" );

        // clear canvas
        ctx.fillStyle = "#758C8E";
        ctx.fillRect( 0, 0, this.#_canvasStateDisplay.width, this.#_canvasStateDisplay.height );

        if ( this.#_model === null ) {
            return;
        }

        var size = this.#_model.size;
        var state = this.#_model.state;
        var playerDirection = this.#_model.lastMove;
        var isSolved = this.#_model.isSolved;

        if ( size === null ) {
            return;
        }

        if ( state === null ) {
            return;
        }

        if ( playerDirection === null ) {
            playerDirection = Constants.MOVE_DOWN;
        }

        // computes image size
        var imgSize = Math.min( this.#_canvasStateDisplay.width / size.cols, this.#_canvasStateDisplay.height / size.rows );

        // computes offset of top left image wrt display div
        var imgOffset = {};
        imgOffset.x = ( this.#_canvasStateDisplay.width - size.cols * imgSize ) * 0.5;
        imgOffset.y = ( this.#_canvasStateDisplay.height - size.rows * imgSize ) * 0.5;

        // draws images
        for ( var i = 0; i < size.rows; i++ ) {
            for ( var j = 0; j < size.cols; j++ ) {
                var x = j * imgSize + imgOffset.x;
                var y = i * imgSize + imgOffset.y;
                var value = ( j < state[ i ].length ) ? state[ i ][ j ] : Constants.EMPTY;
                var image = null;
                if ( value === Constants.PLAYER ) {
                    image = ImageStore.fetchImage( playerDirection );
                }
                else if ( value === Constants.PLAYER_ON_GOAL ) {
                    image = ImageStore.fetchImage( playerDirection );
                }
                else {
                    image = ImageStore.fetchImage( value );
                }
                if ( image !== null ) {
                    ctx.drawImage( image, x, y, imgSize, imgSize );
                }
            }
        }

        // draws solved image
        if ( isSolved ) {
            // tint canvas
            ctx.fillStyle = "rgba( 0, 0, 0, 0.2 )";
            ctx.fillRect( 0, 0, this.#_canvasStateDisplay.width, this.#_canvasStateDisplay.height );

            imgSize = Math.min( this.#_canvasStateDisplay.width, this.#_canvasStateDisplay.height ) * 0.8;
            imgOffset.x = ( this.#_canvasStateDisplay.width - imgSize ) * 0.5;
            imgOffset.y = ( this.#_canvasStateDisplay.height - imgSize ) * 0.5;
            var image = ImageStore.fetchImage( Constants.SOLVED );
            if ( image !== null ) {
                ctx.drawImage( image, imgOffset.x, imgOffset.y, imgSize, imgSize );
            }
        }
    }

    #_updateLabelSetName() {
        if ( this.#_labelSetName === null ) {
            return;
        }

        var setName = ( this.#_model === null ) ? "" : this.#_model.levelSetTitle;
        this.#_labelSetName.textContent = setName;
    }

    #_updateLabelLevelName() {
        if ( this.#_labelLevelName === null ) {
            return;
        }

        var levelName = ( this.#_model === null ) ? "" : ( this.#_model.levelIndex + 1 ) + " of " + this.#_model.levelCount;
        this.#_labelLevelName.textContent = levelName;
    }

    #_updateLabelMovesCount() {
        if ( this.#_labelMovesCount === null ) {
            return;
        }

        var moveCount = ( this.#_model === null ) ? "" : this.#_model.moveCount;
        this.#_labelMovesCount.textContent = moveCount;
    }

    update() {
        this.#_updateCanvasStateDisplay();
        this.#_updateLabelSetName();
        this.#_updateLabelLevelName();
        this.#_updateLabelMovesCount();
    }
}

