var GridMap = {
  drawMap: function(mapSvg, topoData) {
    mapSvg.insert("path", ".graticule")
      .datum(topojson.feature(topoData, topoData.objects.land))
      .attr("class", "land")
      .attr("d", path);
  },

  drawPoints: function(mapSvg, coordinates) {
    mapSvg.selectAll(".marker")
    .data(coordinates)
    .enter()
    .append("circle")
    .classed("marker", true)
    .attr({
      x: 0,
      y: 0,
      r: 1.5,
      transform: function(d) { return "translate("+ d + ")" }
    });
  },

  drawCells: function(mapSvg, coordinates, cellSize) {
    var quadtree = d3.geom.quadtree()(coordinates)
    var searchedCounts = [];

    for (var x = 0; x <= width; x += cellSize) {
      for (var y = 0; y <= height; y += cellSize) {
        var searched = GridMap.search(quadtree, x, y, x + cellSize, y + cellSize);
        searchedCounts.push({x: x, y: y, len: searched.length})
      }
    }

    var colorIntensity = d3.scale.linear()
      .domain([0, d3.max(searchedCounts, function(d) { return d.len; }) ])
      .range([0, 1])

    mapSvg.selectAll(".grid-map")
      .data(searchedCounts).enter()
      .append("rect")
      .classed("grid-map", true)
      .attr({
        x: function(d) { return d.x },
        y: function(d) { return d.y },
        width: cellSize,
        height: cellSize,
        fill: "steelblue",
        opacity: function(d) { return colorIntensity(d.len); }
      })
  },

  search: function(quadtree, x0, y0, x3, y3) {
    var validData = [];
    quadtree.visit(function(node, x1, y1, x2, y2) {
      var p = node.point;
      if (p) {
        p.selected = (p[0] >= x0) && (p[0] < x3) && (p[1] >= y0) && (p[1] < y3);
        if (p.selected) {
          validData.push(p)
        }
      }
      return x1 >= x3 || y1 >= y3 || x2 < x0 || y2 < y0;
    });
    return validData;
  }
}
