'use client';

import * as React from 'react';
import Map from './components/Map';
import { MapProvider, useMap } from 'react-map-gl';

const Page = () => {
  return (
    <div>
      <MapProvider>
        <Home />
      </MapProvider>
    </div>
  );
};

function Home() {
  const [zoom, setZoom] = React.useState(15);
  const { mapbox } = useMap();

  const handleZoomIn = () => {
    console.log('zoom in', mapbox);
    mapbox?.setZoom(mapbox.getZoom() + 1);
  };

  const handleZoomOut = () => {
    mapbox?.setZoom(0);
  };

  return (
    <div>
      <div
        style={{
          position: 'absolute',
          display: 'flex',
          flex: 1,
          width: '100vw',
          height: '100vh',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            zIndex: 101,
            backgroundColor: 'rgba(255,255,255)',
            boxShadow: '0px 10px 20px 10px rgba(255,255,255,1)',
            paddingLeft: 20,
          }}
        >
          <h3>Vintory</h3>
        </div>
        <div
          style={{
            zIndex: 101,
            display: 'flex',
            justifyContent: 'flex-end',
            alignContent: 'flex-end',
            padding: 20,
          }}
        >
          <button onClick={handleZoomIn}> + </button>
          <button onClick={handleZoomOut}> - </button>
        </div>
      </div>
      <Map zoom={zoom} setZoom={setZoom} />
    </div>
  );
}

export default Page;
