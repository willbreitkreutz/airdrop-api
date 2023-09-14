import { useEffect, useRef } from "react";
import { useGameConnection } from "../../hooks/useGameConnection";
import Map from "ol/Map.js";
import OSM from "ol/source/OSM.js";
import TileLayer from "ol/layer/Tile.js";
import View from "ol/View.js";
import "./_game-map.css";

const map = new Map({
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
  ],
  view: new View({
    center: [0, 0],
    zoom: 2,
  }),
});

export default function GameMap({ game }) {
  const mapRef = useRef(null);
  useGameConnection(game);

  useEffect(() => {
    if (!mapRef.current) return;
    map.setTarget(mapRef.current);
  }, [mapRef.current]);

  return <div id="map" ref={mapRef}></div>;
}
