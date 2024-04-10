'use client';

import React from 'react';
import { Map as Mapbox, ScaleControl } from 'react-map-gl';

const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

type MapProps = {
  zoom?: number;
};

const Map: React.FC<MapProps> = ({ zoom = 15 }) => {
  return (
    <Mapbox
      mapboxAccessToken={accessToken}
      initialViewState={{
        longitude: -122.4,
        latitude: 37.8,
        zoom: 14,
        bearing: 0,
        pitch: 0,
      }}
      zoom={zoom}
      style={{
        width: '100vw',
        height: '100vh',
        position: 'absolute',
        zIndex: 100,
      }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
    >
      <ScaleControl />
    </Mapbox>
  );
};

export default Map;
