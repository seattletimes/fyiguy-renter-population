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

    var popupContent = `<div class="popuptext">
                          <h2 class="popheader big">`+ feature["properties"]["areaName"] + `</h2>
                          <p class="popheader renter-pop">` + (rent*100).toFixed(1) + `% renters </p>
                          <div class="bar-container">
                            <div class="bar rent">
                              <div class="bar--renter" style="width:`+ (rent*100).toString() +`%"></div>
                              <div class="renter-pop"><p class="popsmall">` + feature["properties"]["renterPop"] +`</p></div>
                            </div>
                          </div>
                          <p class="popheader">` + (own*100).toFixed(1) + `% owners </p>
                          <div class="bar-container">
                            <div class="bar">
                              <div class="bar--owner" style="width:`+ (own*100).toString() +`%"></div>
                              <div><p class="popsmall">`+ feature["properties"]["ownerPop"] +`</p></div>
                            </div>
                          </div>
                          <p class="total">Total population: `+ feature["properties"]["totalPop"] +`</p>
                        </div>`;

    layer.bindPopup(popupContent);
      
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
        value >= .75 ? '#253494' :
     		value >= .5 ? '#41b6c4' :
     		value >= .25 ? '#fff780' :
        value >= .0 ? '#ffffcc' :
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

