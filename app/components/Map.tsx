'use client';

import React from 'react';
import { Map as Mapbox, ScaleControl, useMap } from 'react-map-gl';

const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

type MapProps = {
  zoom?: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
};

const Map: React.FC<MapProps> = ({ zoom = 15, setZoom }) => {
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
      // zoom={zoom}
      // onWheel={(e) => {
      //   e.preventDefault();

      //   if (e.originalEvent.deltaY < 0) {
      //     setZoom(zoom + 0.05);
      //   } else {
      //     setZoom(zoom - 0.05);
      //   }
      // }}
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
