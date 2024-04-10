'use client';

import * as React from 'react';
import Map from './components/Map';
import { useMap } from 'react-map-gl';

export default function Home() {
  const [zoom, setZoom] = React.useState(15);

  const handleZoomIn = () => {
    setZoom(zoom + 1);
  };

  const handleZoomOut = () => {
    setZoom(zoom - 1);
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
      <Map zoom={zoom} />
    </div>
  );
}
