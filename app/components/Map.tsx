'use client';

import React from 'react';
import { Map as Mapbox, Marker, ScaleControl, useMap } from 'react-map-gl';
import Pin from './Pin';

const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

type MapProps = {
  showMarker?: boolean;
};

const Map: React.FC<MapProps> = ({ showMarker }) => {
  const [markers, setMarkers] = React.useState([
    { longitude: -122.4, latitude: 37.8, id: 1 },
  ]);

  const handleClick = (e: mapboxgl.MapLayerMouseEvent) =>
    setMarkers((markers) => [
      ...markers,
      {
        longitude: e.lngLat.lng,
        latitude: e.lngLat.lat,
        id: markers.length + 1,
      },
    ]);

  const deleteMarker = (id: number) => {
    setMarkers((markers) => markers.filter((marker) => marker.id !== id));
  };

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
        width: '100vw',
        height: '100vh',
        position: 'absolute',
        zIndex: 100,
      }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      onClick={handleClick}
    >
      {showMarker && (
        <>
          {markers.map((marker, index) => (
            <Marker
              key={index}
              longitude={marker.longitude}
              latitude={marker.latitude}
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                deleteMarker(marker.id);
              }}
            >
              <Pin />
            </Marker>
          ))}
        </>
      )}

      <ScaleControl />
    </Mapbox>
  );
};

export default Map;
