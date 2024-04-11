"use client";

import React from "react";
import {
  Layer,
  Map as Mapbox,
  ScaleControl,
  Source,
  useMap,
} from "react-map-gl";

const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

type MapProps = {
  geoJson?: string;
};

const Map: React.FC<MapProps> = ({ geoJson }) => {
  return (
    <Mapbox
      id="mapbox"
      mapboxAccessToken={accessToken}
      initialViewState={{
        longitude: -122.4,
        latitude: 37.8,
        zoom: 14,
        bearing: 0,
        pitch: 0,
      }}
      style={{
        width: "100vw",
        height: "100vh",
        position: "absolute",
        zIndex: 100,
      }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
    >
      {geoJson && (
        <Source id="geojson" type="geojson" data={JSON.parse(geoJson)}>
          <Layer
            id="data"
            type="fill"
            paint={{ "fill-color": "#088", "fill-opacity": 0.8 }}
          />
        </Source>
      )}
      <ScaleControl />
    </Mapbox>
  );
};

export default Map;
