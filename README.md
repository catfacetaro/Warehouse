![](https://raw.githubusercontent.com/catfacetaro/Warehouse/master/wwwroot/icon.png)

# Warehouse
Version 1.1
Sokoban clone in HTML / CSS / Javascript

### Play
- Open `warehouse.html` in `wwwroot` directory with Chrome browser locally.
- Requires internet connection, because it uses free internet resources like Google Web Font and FontAwesome.
- Alternatively, visit [warehouse.html](https://catfacetaro.github.io/Warehouse/wwwroot/warehouse.html) directly hosted by GitHub Pages

### Levels
.slc files contains Sokoban Levels, and can be downloaded from [https://www.sourcecode.se/sokoban/levels](https://www.sourcecode.se/sokoban/levels).

To include new levels:
- Put the .slc files in the `slc` folder.
- Go to `generate_levels` directory.
- `npm install`
- `node generate_level.js`
- `levels.js` will be generated in the `wwwroot` directory.

### Optimize and obfuscate Javascript files
- Go to `wwwroot` directory.
- Ensure `levels.js` exist. If not, follow steps above.
- Ensure `terser` is installed. If not, run `npm install -g terser`.
- Run `terser *.js -o warehouse.min.js`
- Modify `warehouse.html` to load `warehouse.min.js` instead of loading all the Javascript individually.
