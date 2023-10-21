import { useEffect, useRef } from "react";
import { useGameConnection } from "../../hooks/useGameConnection";
import * as olProj from "ol/proj";
import Map from "ol/Map.js";
import TileLayer from "ol/layer/Tile.js";
import View from "ol/View.js";
import GeoJSON from "ol/format/GeoJSON.js";
import { Circle as CircleStyle, Fill, Stroke, Style, Text } from "ol/style.js";
import { Vector as VectorSource, XYZ } from "ol/source.js";
import { Vector as VectorLayer } from "ol/layer.js";
import Feature from "ol/Feature.js";
import circle from "@turf/circle";
import "./_game-map.css";

olProj.useGeographic();

const boundaryStyle = new Style({
  stroke: new Stroke({
    color: "rgba(148, 12, 201)",
    lineDash: [4],
    width: 3,
  }),
  fill: new Fill({
    color: "rgba(148, 12, 201, 0.05)",
  }),
});

const boundaryLayer = new VectorLayer({
  source: new VectorSource(),
  style: boundaryStyle,
});

const prizeAreaStyle = function (feature) {
  return new Style({
    stroke: new Stroke({
      color: "rgba(255, 0, 0)",
      width: 1,
    }),
    fill: new Fill({
      color: "rgba(255, 0, 0, 0.05)",
    }),
    text: new Text({
      text: `${feature.get("value")} pts`,
      overflow: true,
      fill: new Fill({
        color: "#000",
      }),
      stroke: new Stroke({
        color: "#fff",
        width: 3,
      }),
    }),
  });
};

const prizeAreaLayer = new VectorLayer({
  source: new VectorSource(),
  style: prizeAreaStyle,
});

const prizeStyle = new Style({
  image: new CircleStyle({
    radius: 7,
    fill: new Fill({
      color: "rgba(255, 0, 0, 0.5)",
    }),
  }),
});

const prizeLayer = new VectorLayer({
  source: new VectorSource(),
  style: prizeStyle,
});

const map = new Map({
  layers: [
    new TileLayer({
      source: new XYZ({
        url: "https://cartodb-basemaps-{a-c}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png",
      }),
    }),
    boundaryLayer,
    prizeAreaLayer,
    prizeLayer,
  ],
  view: new View({
    center: [0, 0],
    zoom: 2,
  }),
});

function prizeHandler(prize) {
  // center of prize area
  const feature = new GeoJSON().readFeature(prize);
  // constant timestep for prize area expansion
  const dt = 1;
  // prizeLayer.getSource().addFeature(feature);
  // prize area, expands over time
  const prizeAreaFeature = new Feature();
  prizeAreaFeature.set("prizeId", prize.id);
  prizeAreaFeature.set("radius", 0);
  prizeAreaFeature.set("t", 0);
  prizeAreaFeature.set("maxT", 100);
  prizeAreaFeature.set("value", 100);
  prizeAreaFeature.set(
    "timer",
    window.setInterval(() => {
      const t = prizeAreaFeature.get("t") + dt;
      const maxT = prizeAreaFeature.get("maxT");
      if (t > maxT) {
        window.clearInterval(prizeAreaFeature.get("timer"));
        prizeAreaLayer.getSource().removeFeature(prizeAreaFeature);
        return;
      }
      const pctT = Math.ceil((t / maxT) * 100);
      const radius = 1 + 0.1 * Math.pow(pctT, 2);
      const value = Math.ceil(100 - 0.01 * Math.pow(pctT, 2));

      prizeAreaFeature.set("t", t);
      prizeAreaFeature.set("radius", radius);
      prizeAreaFeature.set("value", value);

      const prizeArea = circle(feature.getGeometry().getCoordinates(), radius, {
        units: "meters",
      });
      prizeAreaFeature.setGeometry(
        new GeoJSON().readGeometry(prizeArea.geometry)
      );
      const prizeAreaLabel = prizeAreaLayer
        .getStyle()(prizeAreaFeature)
        .getText();
      prizeAreaLabel.setText(`${value} pts`);
    }, dt * 1000)
  );
  prizeAreaLayer.getSource().addFeature(prizeAreaFeature);
}

export default function GameMap({ game }) {
  const mapRef = useRef(null);
  useGameConnection(game, prizeHandler);

  useEffect(() => {
    if (!mapRef.current) return;
    map.setTarget(mapRef.current);
    const boundary = new GeoJSON().readFeatures(game.geometry);
    console.log(boundary);
    boundaryLayer.getSource().addFeatures(boundary);
    map.getView().fit(boundaryLayer.getSource().getExtent());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapRef.current]);

  return <div id="map" ref={mapRef}></div>;
}
