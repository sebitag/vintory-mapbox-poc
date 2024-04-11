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
  const [showMarker, setShowMarker] = React.useState(true);
  const [showClusters, setShowClusters] = React.useState(false);
  const [showClusterCustomMarkers, setShowClusterCustomMarkers] =
    React.useState(false);

  const handleShowMarker = () => {
    setShowMarker(!showMarker);
  };

  const handleZoomIn = () => {
    mapbox?.setZoom(mapbox.getZoom() + 1);
  };

  const handleZoomOut = () => {
    mapbox?.setZoom(mapbox.getZoom() - 1);
  };

  const [inputValue, setInputValue] = React.useState('');
  const [geoJson, setGeoJson] = React.useState<string | undefined>(undefined);
  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = () => {
    setGeoJson(inputValue);
    setInputValue('');
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
        <div className={styles.header}>
          <h3>Vintory</h3>
        </div>
        <div className={styles.funcContainer}>
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
            <textarea
              value={inputValue}
              onChange={handleInputChange}
            ></textarea>
            <button className={styles.buttonWhite} onClick={handleSubmit}>
              Submit
            </button>
          </div>
          <div>
            <p className={styles.funcTitle}>Markers</p>
            <button className={styles.buttonWhite} onClick={handleShowMarker}>
              {showMarker ? 'Hide markers' : 'Show markers'}
            </button>
          </div>
          <div>
            <p className={styles.funcTitle}>Clusters</p>
            <button
              className={styles.buttonWhite}
              onClick={() => setShowClusters((showClusters) => !showClusters)}
            >
              {showClusters ? 'Hide clusters' : 'Show clusters'}
            </button>
          </div>
          <div>
            <p className={styles.funcTitle}>Clusters with custom markers</p>
            <button
              className={styles.buttonWhite}
              onClick={() =>
                setShowClusterCustomMarkers(
                  (showClusterCustomMarkers) => !showClusterCustomMarkers
                )
              }
            >
              {showClusterCustomMarkers
                ? 'Hide cluster-marker'
                : 'Show cluster-marker'}
            </button>
          </div>
        </div>
      </div>
      <Map
        showMarker={showMarker}
        showClusters={showClusters}
        geoJson={geoJson}
        clusterCustomMarkers={showClusterCustomMarkers}
      />
    </div>
  );
}

export default Page;
