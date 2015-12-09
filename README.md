# grid_map

A gridded heat map using D3.

## Example

```javascript
queue()
  .defer(d3.json, "/us.json")
  .defer(d3.csv, "/data/2005-2014_torn.csv")
  .await(function(error, usData, tornadoes) {
    if (error) throw error;

    var coordinates = tornadoes.map(function(d) {
      if (d.slon && d.slat) {
        return projection([parseFloat(d.slon), parseFloat(d.slat)]);
      };
    });
    coordinates = coordinates.filter(function(c) { return c != null });

    GridMap.drawMap(mapSvg, usData);
    GridMap.drawCells(mapSvg, coordinates, cellSize);
    // GridMap.drawPoints(mapSvg, coordinates);
})


```
