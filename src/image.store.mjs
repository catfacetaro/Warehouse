import * as Constants from './constants.mjs';

const SVG_DIR = 'svg/';
const IMAGE_STORE = new Map();

function _preloadImage( key, url ) {
  var img = new Image();
  img.src = url;
  IMAGE_STORE.set( key, img );
}

export function fetchImage( key ) {
  var img = IMAGE_STORE.get( key );
  return ( img === undefined ) ? null : img;
}

_preloadImage( Constants.WALL, SVG_DIR + 'wall.svg' );
_preloadImage( Constants.BOX, SVG_DIR + 'box.svg' );
_preloadImage( Constants.BOX_ON_GOAL, SVG_DIR + 'box_on_goal.svg' );
_preloadImage( Constants.GOAL, SVG_DIR + 'goal.svg' );
_preloadImage( Constants.EMPTY, SVG_DIR + 'empty.svg' );
_preloadImage( Constants.MOVE_UP, SVG_DIR + 'player_back.svg' );
_preloadImage( Constants.MOVE_DOWN, SVG_DIR + 'player_front.svg' );
_preloadImage( Constants.MOVE_LEFT, SVG_DIR + 'player_left.svg' );
_preloadImage( Constants.MOVE_RIGHT, SVG_DIR + 'player_right.svg' );
_preloadImage( Constants.SOLVED, SVG_DIR + 'solved.svg' );
