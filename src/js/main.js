//load our custom elements
require("component-leaflet-map");
// require("component-responsive-frame");


//get access to Leaflet and the map
var element = document.querySelector("leaflet-map");
var L = element.leaflet;
var map = element.map;

var data = require("./renterPercentage.geo.json");
var commafy = s => (s*1).toLocaleString();

var cats = ["totalPop", "ownerPop", "renterPop"];

//commafy data for popup text
for (var x = 0; x < data.features.length; x++){
  for(var y = 0; y < cats.length; y++){
    data.features[x].properties[cats[y]] = commafy(data.features[x].properties[cats[y]]);
  }
}

var mapElement = document.querySelector("leaflet-map");

if (mapElement) {
  var L = mapElement.leaflet;
  var map = mapElement.map;

  map.scrollWheelZoom.disable();

  var onEachFeature = function(feature, layer) {
    var fullTractName = feature["properties"]["areaName"];

    if(fullTractName != null){
    var tractName = fullTractName.split(",");
    feature["properties"]["areaName"] = tractName[0];
    }
    
    var rent = feature.properties.percentRenter;
    var own = 1 - rent;

      layer.bindPopup(`
        <div class="popuptext">
          <h2 class="popheader big">`+ feature["properties"]["areaName"] + `</h2>
          <h2 class="popheader">`+ feature["properties"]["percentRenterDisplay"] +`% renters</h2>
          <p class="total">Total population: `+ feature["properties"]["totalPop"] +`</p>
          <p><span class="block block-rent">&#x25A0 </span>Renter population: `+ feature["properties"]["renterPop"] +`</p>
          <p><span class="block block-own">&#x25A0 </span>Owner population: `+ feature["properties"]["ownerPop"] +`</p>
        </div>
        <div class="bar-container">
          <div class="bar">
            <div class="bar--renter" title="` + (rent*100).toFixed(1).toString() +`%" style="width:`+ (rent*100).toString() +`%"></div>
            <div class="bar--owner" title="`+ (own*100).toFixed(1).toString() + `%" style="width:`+ (own*100).toString() +`%"></div>
          </div>
        </div>
      `);
      
    var focused = false;
    var popup = false;

    layer.on({
        mouseover: function(e) {
            layer.setStyle({ weight: 2.5, fillOpacity: 1 });
        },
        mouseout: function(e) {
            if (focused && focused == layer) { return }
            layer.setStyle({ weight: 1.5, fillOpacity: 0.4});
        },
        popupopen: function(e) {
            layer.setStyle({ weight: 2, fillOpacity: 1 });

            focused = true;
            popup = true;
        },
        popupclose: function(e) {

            layer.setStyle({ weight: 0.5, fillOpacity: 0.4 });
            focused = false;
            popup = false;
        }
    });
};

var getColor = function(d) {
    var value = d;
    if (typeof value == "string") {
      value = Number(value.replace(/,/, ""));
    }
    if (typeof value != "undefined") {
     return value >= 1 ? '#303030': 
        value >= .8 ? '#253494' :
     		value >= .6 ? '#2c7fb8' :
     		value >= .4 ? '#41b6c4' :
        value >= .2 ? '#a1dab4' :
        value >= 0 ? '#ffffcc' :
                    '#f1f2f2' ;
    } else {
      return "gray"
    }
  };

  var style = function(feature) {
    var s = {
      fillColor: getColor(feature.properties.percentRenter),
      weight: 1,
      opacity: .3,
      color: '#000',
      fillOpacity: 0.45
    };
    return s;
  }

  var geojson = L.geoJson(data, {
    style: style,
    onEachFeature: onEachFeature
  }).addTo(map);
}

 map.scrollWheelZoom.disable();

