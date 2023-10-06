import { useRef, useEffect } from "react";
import { Map, View, Feature } from "ol";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { Style, Fill, Stroke, Icon, Text } from "ol/style";
import { OSM } from "ol/source";
import * as proj from "ol/proj";
import { Point } from "ol/geom";

// eslint-disable-next-line react-hooks/rules-of-hooks
proj.useGeographic();

const gpsLayer = new VectorLayer({
  source: new VectorSource(),
  style: new Style({
    image: new Icon({
      src: "http://www.avatarsinpixels.com/minipix/eyJIYWlyTG93ZXIiOiIxOCIsIkJvZHkiOiIzIiwiRXllcyI6IjE4IiwiTW91dGgiOiI3IiwiU29ja3MiOiI1IiwiU2hvZXMiOiIzIiwiR2xvdmVzIjoiNyIsIlBhbnRzIjoiMyIsIlRvcCI6IjE2IiwiSGFpciI6IjMyIiwiSGF0IjoiNSIsImV5ZXNUb25lIjoiZTRiNGNkIiwiZXllc1RvbmUyIjoiOTQxNTU0IiwibWFza1RvbmUiOiJkZTA1YmMiLCJoYWlyVG9uZSI6IjQ0OWVlMyIsImhhaXJUb25lMiI6ImMwMjRiMyIsInVuZGVyd2VhclRvbmUiOiJmNWRlNzkiLCJ1bmRlcndlYXJUb25lMiI6IjVhNTgxNyIsInBhbnRzVG9uZSI6IjViZTE5MSIsInBhbnRzVG9uZTIiOiIwZDA4NzIiLCJ0b3BUb25lIjoiMTIyYjQ3IiwidG9wVG9uZTIiOiI2MWMxNGYiLCJ3aW5nc1RvbmUiOiI0NmNlZjQiLCJ3aW5nc1RvbmUyIjoiN2NjODQxIiwic2hvZXNUb25lIjoiNjk2MjAwIiwic29ja3NUb25lIjoiYTg5NTlhIiwic29ja3NUb25lMiI6ImE4MDNmNCIsImdsb3Zlc1RvbmUiOiI5NjIxZjciLCJnbG92ZXNUb25lMiI6ImYwODJiZiIsImhhdFRvbmUiOiIxNzI1YTEiLCJoYXRUb25lMiI6ImY4OGI0NSIsImNhcGVUb25lIjoiZTliN2M5IiwiY2FwZVRvbmUyIjoiOTk5MDc0IiwiYmVsdFRvbmUiOiI3MGJjNDgiLCJqYWNrZXRUb25lIjoiN2M1YzVmIiwiamFja2V0VG9uZTIiOiJiZjMxMzciLCJuZWNrVG9uZSI6ImM0NWM4OCIsIm5lY2tUb25lMiI6IjBmZjM5NCJ9/1/show.png",
      scale: 1.2,
      anchor: [0.5, 0.8],
    }),
    text: new Text({
      text: `@willbreitkreutz`,
      font: "bold italic 12px sans-serif",
      offsetY: -45,
      overflow: true,
      fill: new Fill({
        color: "#000",
      }),
      stroke: new Stroke({
        color: "#fff",
        width: 3,
      }),
    }),
  }),
});

const myLocation = new Feature();
gpsLayer.getSource().addFeature(myLocation);

const map = new Map({
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
    gpsLayer,
  ],
  view: new View({
    center: [0, 0],
    zoom: 2,
  }),
});

if ("geolocation" in navigator) {
  console.log("geolocation available, starting watch");
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      const coords = [longitude, latitude];
      myLocation.setGeometry(new Point(coords));
      map.getView().fit(gpsLayer.getSource().getExtent(), { maxZoom: 18 });
    },
    console.error,
    { enableHighAccuracy: true }
  );
}

export default function GameMap() {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;
    map.setTarget(mapRef.current);
  }, [mapRef]);

  return <div id="map" className="bg-primary" ref={mapRef}></div>;
}
