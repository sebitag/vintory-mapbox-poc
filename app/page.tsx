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
  const { mapbox } = useMap();

  const handleZoomIn = () => {
    mapbox?.setZoom(mapbox.getZoom() + 1);
  };

  const handleZoomOut = () => {
    mapbox?.setZoom(mapbox.getZoom() - 1);
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
            backgroundColor: 'rgba(255,255,255)',
            display: 'flex',
            flexDirection: 'column',
            alignSelf: 'flex-end',
            padding: 10,
            marginTop: 40,
            marginRight: 10,

            width: '30%',
            maxWidth: 200,
            height: '30%',
            borderRadius: 10,

            alignContent: 'center',
          }}
        >
          <div>
            <button onClick={handleZoomIn}> + </button>
            <button onClick={handleZoomOut}> - </button>
          </div>
          <div>
            <textarea></textarea>
          </div>
          <div>
            <button>Submit</button>
          </div>
        </div>
      </div>
      <Map />
    </div>
  );
}

export default Page;
