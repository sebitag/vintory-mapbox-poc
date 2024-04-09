"use client";

import React from "react";
import { Map as Mapbox } from "react-map-gl";

const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

const Map: React.FC = () => {
  return (
    <Mapbox
      mapboxAccessToken={accessToken}
      initialViewState={{
        longitude: -122.4,
        latitude: 37.8,
        zoom: 14,
      }}
      style={{ width: "100vw", height: "100vh" }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
    />
  );
};

export default Map;
