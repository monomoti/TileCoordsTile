var map = L.map("map",{center:[34,135],zoom:8});

var baseTileUrl = "http://j.tile.openstreetmap.jp/{z}/{x}/{y}.png",
attribution = 'Map data &copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors,&nbsp;'
 + 'Imagery <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>';


var baseLayer = L.tileLayer(baseTileUrl
,{
minZoom:2,maxZoom:17,attribution:attribution
}).addTo(map);


var GridLayerClass = L.GridLayer.extend({
    createTile: function(coords){
        var tile = L.DomUtil.create('div', 'leaflet-tile mytile');
        var coordsContainer = L.DomUtil.create('ul', 'mycoords',tile);

        coordsContainer.innerHTML = "<li>こっちは選択できない</li>"
            + "<li>z/x/y:&nbsp;<input type=\"text\" value=\" "+ coords.z + "/" + coords.x + "/"  + coords.y  +  " \" ></li>";

        return tile;
    },

});

var markers = {};
var overLay = new GridLayerClass();

overLay.on("tileload",function(e){
    var bounds = this._tileCoordsToBounds(e.coords);

    var html = "<ul class=\"mycoords2\"><li>こっちは選択できる</li>"
            + "<li>z/x/y:&nbsp;<input type=\"text\" value=\" "+ e.coords.z + "/" + e.coords.x + "/"  + e.coords.y  +  " \" ></li></ul>";

    

    var mk = L.marker([bounds.getSouth(),bounds.getWest()],
        {
            icon:L.divIcon({
                iconSize:[200,50],
                iconAnchor:[-20,150],
                html: html,
                className:"mydivicon"
            })

        }
    ).addTo(this._map);

    L.DomEvent.on(mk._icon,"click",L.DomEvent.stopPropagation);
    L.DomEvent.on(mk._icon,"mousedown",L.DomEvent.stopPropagation);
    L.DomEvent.on(mk._icon,"dblclick",L.DomEvent.stopPropagation);
    L.DomEvent.on(mk._icon,"mousewheel",L.DomEvent.stopPropagation);


    markers[this._tileCoordsToKey(e.coords)] = mk;

});


overLay.on("tileunload",function(e){
    this._map.removeLayer(markers[this._tileCoordsToKey(e.coords)]);
    delete markers[this._tileCoordsToKey(e.coords)];
});


overLay.addTo(map);

L.control.layers({"base":baseLayer}, {"over lay":overLay}).addTo(map);

