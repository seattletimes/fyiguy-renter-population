//load our custom elements
require("component-leaflet-map");
require("component-responsive-frame");


//get access to Leaflet and the map
var element = document.querySelector("leaflet-map");
var L = element.leaflet;
var map = element.map;

//ICH code for popup template if needed----------
var ich = require("icanhaz");
var templateFile = require("./_popup.html");
ich.addTemplate("popup", templateFile);


var data = require("./renterPercentage.geo.json");
var commafy = s => (s*1).toLocaleString();

var cats = ["totalPop", "ownerPop", "renterPop"];

for (var x = 0; x < data.features.length; x++){
  for(var y = 0; y < cats.length; y++){
    data.features[x].properties[cats[y]] = commafy(data.features[x].properties[cats[y]]);
  }
}

var mapElement = document.querySelector("leaflet-map");

if (mapElement) {
  var L = mapElement.leaflet;
  var map = mapElement.map;

  // map.scrollWheelZoom.disable();

  var onEachFeature = function(feature, layer) {
    var fullTractName = feature["properties"]["areaName"];

    if(fullTractName != null){
    var tractName = fullTractName.split(",");
    feature["properties"]["areaName"] = tractName[0];
    }
    
    var rent = feature.properties.percentRenter;
    var own = 1 - rent;
    var templateContent = feature.properties;
    templateContent.rentWidth = "style= width:" + (rent*100).toString() + "%;";
    templateContent.ownWidth = "style=width:" + (own*100).toString() + "%;";
    templateContent.rentTitle = "title = " + (rent*100).toFixed(1).toString() + "%";
    templateContent.ownTitle = "title = " + (own*100).toFixed(1).toString() + "%";


// layer.bindPopup(`
//   <div class="popuptext">
//     <h2 class="popheader big">`+ feature["properties"]["areaName"] + `</h2>
//     <h2 class="popheader">Renters: `+ feature["properties"]["percentRenterDisplay"] +`%</h2>
//     <p>Total population: `+ feature["properties"]["totalPop"] +`</p>
//     <p><span class="block block-rent" style="font-size: 20px; width: 12px;color: #a03909">&#x25A0 </span>Renter population: `+ feature["properties"]["renterPop"] +`</p>
//     <p><span class="block block-own" style="font-size: 20px; width: 12px;color: #909090	">&#x25A0 </span>Owner population: `+ feature["properties"]["ownerPop"] +`</p>
//   </div>
//   <div class="bar-container">
//     <div class="bar">
//       <div class="bar--renter" title="` + (rent*100).toFixed(1).toString() +`%" width="`+ (rent*100).toString() +`%"></div>
//       <div class="bar--owner" title="`(own*100).toFixed(1).toString()`%" width="`+ (own*100).toString() +`%"></div>
//     </div>
//   </div>
// `);


    layer.bindPopup(ich.popup(templateContent));

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
     return value >= .8 ? '#253494' :
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

