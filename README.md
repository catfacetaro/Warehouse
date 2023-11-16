![](svg/icon.svg)

# Warehouse
### Version 2.0
Sokoban clone implemented using HTML / CSS / Javascript

### Play online
- Click [here](warehouse.html) to play.

### Keys
- Arrow keys to control the player.
- `Ctrl` + arrow keys to change levels.
- `Backspace` to undo move.
- `Ctrl` + `Home` to restart level.

### Levels
- Sokoban Levels (.slc files) can be downloaded from [here](https://www.sourcecode.se/sokoban/levels.php).
- The .slc files requires to be converted to Javascript.
- Place the .slc files in the `slcs` folder.
- Run `npm install` to install any dependencies.
- Run `npm run genlevels` to generate `src/levels.mjs` file.

### Local environment
- Run `npm run build` to build files from the `src` directory into the `build` directory.
- Run `npm run server` to run a local http server to serve the `build` directory.
- Open the web browser and go to the url `http://localhost:8080`.
