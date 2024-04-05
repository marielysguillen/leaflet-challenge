// Store this link endpoint to get the GeoJSON data.
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Creating the map object
let myMap = L.map("map", {
    center: [40.7128, -74.0059],
    zoom: 6
  });

  // Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);


// GET request to the URL(link)
// Getting our GeoJSON data
d3.json(link).then(function(data) {

    function styleMap(feature) {
        return {
            color: "black",
            fillOpacity: 0.5,
            stroke: true,
            weight: 1,
            opacity: 1,
            //fillColor: chooseColor(feature.properties.mag), 
            fillColor: chooseColor(feature.geometry.coordinates[2]),          
            radius: chooseRadius(feature.properties.mag),
        };
      }
    
    //set color from magnitude
    function chooseColor(depth) {
        if (depth > 10 && depth <= 30) return "yellow";
        else if (depth > 30 && depth <= 50) return "gold";
        else if (depth > 50 && depth <= 70) return "orange";
        else if (depth > 70 && depth <= 90) return "darkorange";
        else if (depth > 90) return "red";
        else return "lightgreen";
    }

    //set radius from magnitude
    function chooseRadius(magnitude) {
        if (magnitude === 0) {
        return 1;
        }

        return magnitude * 4;
    }


    // Creating a GeoJSON layer with the retrieved data

    L.geoJson(data, {
        // Maken cricles
        pointToLayer: function(feature, latlng) {
          return L.circleMarker(latlng);
        },
        // Styling each feature 
        style: styleMap,

        // This is called on each feature (popup)
        onEachFeature: function(feature, layer) {
           // Set the mouse events to change the map styling.
           layer.on({
            // When a user's mouse cursor touches a map feature, the mouseover event calls this function, which makes that feature's opacity change to 90% so that it stands out.
            mouseover: function(event) {
              layer = event.target;
              layer.setStyle({
                fillOpacity: 0.9
              });
            },
            // When the cursor no longer hovers over a map feature (that is, when the mouseout event occurs), the feature's opacity reverts back to 50%.
            mouseout: function(event) {
              layer = event.target;
              layer.setStyle({
                fillOpacity: 0.5
              });
            },
            // When a feature is clicked, it enlarges to fit the screen.
            click: function(event) {
              myMap.fitBounds(event.target.getBounds());
            }
          });

            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
          //layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place + "<br>Depth: " + feature.geometry.coordinates[2]);
        }
      }).addTo(myMap);
  

    // Add legend 
    let legend = L.control({
        position: "bottomright"
      });
    
      // details for the legend
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        
        var mag = [-10, 10, 30, 50, 70, 90];
    
        // Looping through
        for (var i = 0; i < mag.length; i++) {
          div.innerHTML +=
            "<i style='background: " + chooseColor(mag[i] + 1) + "'></i> " +
            mag[i] + (mag[i + 1] ? "&ndash;" + mag[i + 1] + "<br>" : "+");
        }
        
        return div;
      };
    
      // Adding the legend to the map
      legend.addTo(myMap);

  });

