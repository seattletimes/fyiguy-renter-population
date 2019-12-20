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

var onEachFeature = function(feature, layer) {
  layer.bindPopup(ich.popup(feature.properties));
};



var data = require("./renterPercentage.geo.json");
var commafy = s => (s*1).toLocaleString().replace(/1.0+$/, "");

data.features.forEach(function(f) {
	["totalPop", "ownerPop", "renterPop"].forEach(function(prop) {
		f.properties[prop] = commafy ((f.properties[prop]));
	});
});

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
    
    layer.bindPopup(ich.popup(feature.properties))
    // console.log(feature.properties);

    var focused = false;
    var popup = false;


    layer.on({
        mouseover: function(e) {
            layer.setStyle({ weight: 2.5, fillOpacity: .7 });
        },
        mouseout: function(e) {
            if (focused && focused == layer) { return }
            layer.setStyle({ weight: 1.5, fillOpacity: 0.4
            });
        },
        popupopen: function(e) {
            layer.setStyle({ weight: 2, fillOpacity: 1 });

            var barRenter = document.querySelector(".bar--renter");
            var barOwner = document.querySelector(".bar--owner");
          
            var renter = e["target"]["feature"]["properties"]["percentRenter"];
            var owner = 1 - renter;
          
            barRenter.style.width = (renter*100).toString() + "%";
            barRenter.title = (renter*100).toString() + "%";

            barOwner.style.width = (owner*100).toString() + "%";

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
     return value >= .8 ? '#7f2704' :
     		value >= .6 ? '#d94801' :
     		value >= .4 ? '#f16913' :
        value >= .2 ? '#fdae6b' :
        value >= 0 ? '#fee6ce' :
             
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

//  var onClick = function(e){
//   var barRenter = document.querySelector(".bar--renter");
//   var barOwner = document.querySelector(".bar--owner");

//   var renter = e["target"]["feature"]["properties"]["percentRenter"];
//   var owner = 1 - renter;

//   barRenter.style.width = (renter*100).toString() + "%";
//   barOwner.style.width = (owner*100).toString() + "%";
//  }
