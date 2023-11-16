import { removePath, processPath, generateLevels, generateIndex } from './builder.mjs';

const SRC_DIR = 'src';
const OUTPUT_DIR = 'build';

const SLCS_DIR = 'slcs';
const OUTPUT_LEVELS_FILE = 'src/levels.mjs';

const MD_FILE_PATH = 'README.md';
const TEMPLATE_FILE_PATH = 'tmpls/index.template.html';
const OUTPUT_INDEX_FILE = 'src/index.html';

// promise is used to queue a mixture of async function and non-async functions in order.
// callback functions provided to then() must return promise object if async functions are called.
var p = Promise.resolve();
process.argv.forEach( ( arg, i ) => {
    if ( i >= 2 ) {
        switch ( arg ) {
            case 'clean':
                p = p.then( () => {
                    console.log( '** clean' );
                    removePath( OUTPUT_DIR );
                } );
                break;
            case 'minify':
                p = p.then( () => {
                    console.log( '** minify' );
                    return processPath( SRC_DIR, OUTPUT_DIR );
                } );
                break;
            case 'copy':
                p = p.then( () => {
                    console.log( '** copy' );
                    return processPath( SRC_DIR, OUTPUT_DIR, false );
                } );
                break;
            case 'genlevels':
                p = p.then( () => {
                    console.log( '** genlevels' );
                    generateLevels( SLCS_DIR, OUTPUT_LEVELS_FILE );
                } );
                break;
            case 'genindex':
                p = p.then( () => {
                    console.log( '** genindex' );
                    return generateIndex( MD_FILE_PATH, TEMPLATE_FILE_PATH, OUTPUT_INDEX_FILE );
                } );
                break;
            default:
                break;
        }
    }
} );
