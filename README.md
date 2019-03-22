![](https://raw.githubusercontent.com/catfacetaro/Warehouse/master/wwwroot/icon.png)

# Warehouse
Sokoban clone in HTML / CSS / Javascript

### Play
- Open `warehouse.html` in `wwwroot` directory with Chrome browser locally.
- Requires internet connection, because it uses free internet resources like Google Web Font and FontAwesome.

### Levels
.slc files contains Sokoban Levels, and can be downloaded from http://www.sourcecode.se/sokoban/levels.

To include new levels:
- Put the slc files in the slc folder.
- Run `generate_level.js` using nodejs to generate the `levels.js` file in `wwwroot` directory.

To run `generate_level.js` :
- Go to `generate_levels` directory.
- `npm install`
- `node generate_level.js`
