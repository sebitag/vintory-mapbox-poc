'use client';

import * as React from 'react';
import Map from './components/Map';
import { MapProvider, useMap } from 'react-map-gl';
import styles from './page.module.css';

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
  const [showMarker, setShowMarker] = React.useState(false);

  const handleShowMarker = () => {
    setShowMarker(!showMarker);
  };

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
            backgroundColor: '#20314D',
            display: 'flex',
            flexDirection: 'column',
            alignSelf: 'flex-end',
            padding: 10,
            marginTop: 40,
            marginRight: 10,

            gap: 20,

            width: '30%',
            maxWidth: 200,
            height: '30%',
            borderRadius: 10,

            alignContent: 'center',
          }}
        >
          <div>
            <p className={styles.funcTitle}>Zoom</p>
            <button className={styles.buttonWhite} onClick={handleZoomIn}>
              +
            </button>
            <button className={styles.buttonWhite} onClick={handleZoomOut}>
              -
            </button>
          </div>
          <div>
            <p className={styles.funcTitle}>GeoJson</p>
            <textarea></textarea>
            <button className={styles.buttonWhite}>Submit</button>
          </div>
          <div>
            <p className={styles.funcTitle}>Markers</p>
            <button className={styles.buttonWhite} onClick={handleShowMarker}>
              {showMarker ? 'Hide markers' : 'Show markers'}
            </button>
          </div>
        </div>
      </div>
      <Map showMarker={showMarker} />
    </div>
  );
}

export default Page;
