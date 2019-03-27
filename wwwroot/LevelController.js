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

var LevelController = function ( model ) {
    var _model = model;
    var _curLevelSetIndex = 0;
    var _curLevelIndex = 0;

    /**
     * Gets the number of level sets.
     */
    this.getNumberOfLevelSets = function () {
        return levelSets.length;
    }.bind( this );

    /**
     * Gets the number of levels of the current level set, or the specified level set.
     */
    this.getNumberOfLevels = function ( levelSetIndex ) {
        if ( levelSetIndex === undefined ) {
            levelSetIndex = _curLevelSetIndex;
        }
        return levelSets[ levelSetIndex ][ "levels" ].length;
    }.bind( this );

    /**
     * Gets the current level set index.
     */
    this.getCurrentLevelSetIndex = function () {
        return _curLevelSetIndex;
    }.bind( this );

    /**
     * Gets the current level index.
     */
    this.getCurrentLevelIndex = function () {
        return _curLevelIndex;
    }.bind( this );

    /**
     * Gets the title of the current level set, or the specified level set.
     */
    this.getLevelSetTitle = function ( levelSetIndex ) {
        if ( levelSetIndex === undefined ) {
            levelSetIndex = _curLevelSetIndex;
        }
        return levelSets[ levelSetIndex ][ "title" ];
    }.bind( this );

    /**
     * Gets the title of the current level, or the specified level.
     */
    this.getLevelTitle = function ( levelSetIndex, levelIndex ) {
        if ( levelSetIndex === undefined ) {
            levelSetIndex = _curLevelSetIndex;
            levelIndex = _curLevelIndex;
        }
        return levelSets[ levelSetIndex ][ "levels" ][ levelIndex ][ "title" ];
    }.bind( this );

    /**
     * Sets the model to the specified level set and level.
     */
    this.setToLevel = function ( levelSetIndex, levelIndex ) {
        _model.setInitialState( levelSets[ levelSetIndex ][ "levels" ][ levelIndex ][ "level" ] );
        _curLevelSetIndex = levelSetIndex;
        _curLevelIndex = levelIndex;
    }.bind( this );

    /**
     * Sets the model to the next level set.
     */
    this.setToNextLevelSet = function () {
        var nextLevelSetIndex = _curLevelSetIndex + 1;
        var nextLevelIndex = 0;
        if ( nextLevelSetIndex >= levelSets.length ) {
            nextLevelSetIndex = 0;
        }
        this.setToLevel( nextLevelSetIndex, nextLevelIndex );
    }.bind( this );

    /**
     * Sets the model to the previous level set.
     */
    this.setToPreviousLevelSet = function () {
        var prevLevelSetIndex = _curLevelSetIndex - 1;
        var prevLevelIndex = 0;
        if ( prevLevelSetIndex < 0 ) {
            prevLevelSetIndex = levelSets.length - 1;
        }
        this.setToLevel( prevLevelSetIndex, prevLevelIndex );
    }.bind( this );

    /**
     * Sets the model to the next level.
     */
    this.setToNextLevel = function ( allowLevelSetChange ) {
        var nextLevelSetIndex = _curLevelSetIndex;
        var nextLevelIndex = _curLevelIndex + 1;
        if ( allowLevelSetChange ) {
            if ( nextLevelIndex >= levelSets[ _curLevelSetIndex ][ "levels" ].length ) {
                nextLevelIndex = 0;
                nextLevelSetIndex++;
            }
            if ( nextLevelSetIndex >= levelSets.length ) {
                nextLevelSetIndex = 0;
            }
        }
        else {
            if ( nextLevelIndex >= levelSets[ _curLevelSetIndex ][ "levels" ].length ) {
                nextLevelIndex = 0;
            }
        }
        this.setToLevel( nextLevelSetIndex, nextLevelIndex );
    }.bind( this );

    /**
     * Sets the model to the previous level.
     */
    this.setToPreviousLevel = function ( allowLevelSetChange ) {
        var prevLevelSetIndex = _curLevelSetIndex;
        var prevLevelIndex = _curLevelIndex - 1;
        if ( allowLevelSetChange ) {
            if ( prevLevelIndex < 0 ) {
                prevLevelSetIndex--;
                if ( prevLevelSetIndex < 0 ) {
                    prevLevelSetIndex = levelSets.length - 1;
                }
                prevLevelIndex = levelSets[ prevLevelSetIndex ][ "levels" ].length - 1;
            }
        }
        else {
            if ( prevLevelIndex < 0 ) {
                prevLevelIndex = levelSets[ _curLevelSetIndex ][ "levels" ].length - 1;
            }
        }
        this.setToLevel( prevLevelSetIndex, prevLevelIndex );
    }.bind( this );
}
