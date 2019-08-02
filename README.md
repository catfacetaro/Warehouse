![](https://catfacetaro.github.io/Warehouse/wwwroot/icon.png)

# Warehouse
### Version 1.1
Sokoban clone in HTML / CSS / Javascript

### Play
- Click [here](https://catfacetaro.github.io/Warehouse/wwwroot/warehouse.html) to play.
- Alternatively, open `warehouse.html` in `wwwroot` directory with Chrome browser locally.
- Requires internet connection, because it uses free internet resources like Google Web Font and FontAwesome.

### Levels
.slc files contains Sokoban Levels, and can be downloaded from [here](https://www.sourcecode.se/sokoban/levels).

To include new levels:
- Put the .slc files in the `slc` folder.
- Go to `generate_levels` directory.
- Run `npm install` to install any dependencies.
- Run `node generate_level.js` to generate `levels.js` in the `wwwroot` directory.
