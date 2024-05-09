'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import {
  Layer,
  MapRef,
  Map as Mapbox,
  Marker,
  ScaleControl,
  Source,
  useMap,
} from 'react-map-gl';
import Pin from './Pin';
import type { LayerProps } from 'react-map-gl';
import { Feature } from 'geojson';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import useSupercluster from 'use-supercluster';
import { MapCollection } from 'react-map-gl/dist/esm/components/use-map';

export const clusterLayer: LayerProps = {
  id: 'clusters',
  type: 'circle',
  source: 'earthquakes',
  filter: ['has', 'point_count'],
  paint: {
    'circle-color': [
      'step',
      ['get', 'point_count'],
      '#51bbd6',
      100,
      '#f1f075',
      750,
      '#f28cb1',
    ],
    'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40],
  },
};

export const clusterCountLayer: LayerProps = {
  id: 'cluster-count',
  type: 'symbol',
  source: 'earthquakes',
  filter: ['has', 'point_count'],
  layout: {
    'text-field': '{point_count_abbreviated}',
    'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
    'text-size': 12,
  },
};

export const unclusteredPointLayer: LayerProps = {
  id: 'unclustered-point',
  type: 'circle',
  source: 'earthquakes',
  filter: ['!', ['has', 'point_count']],
  paint: {
    'circle-color': 'red',
    'circle-radius': 4,
    'circle-stroke-width': 1,
    'circle-stroke-color': '#fff',
  },
};
const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
const INITIAL_ZOOM = 13;

type MapProps = {
  geoJson?: any;
  showMarker?: boolean;
  showClusters?: boolean;
  clusterCustomMarkers?: boolean;
  enableMarker?: boolean;
};

const Map: React.FC<MapProps> = ({
  showMarker,
  showClusters,
  geoJson,
  clusterCustomMarkers,
  enableMarker,
}) => {
  const [features, setFeatures] = React.useState({});

  const [markers, setMarkers] = React.useState([
    { longitude: -122.4, latitude: 37.8, id: 1 },
  ]);

  const handleClick = (e: mapboxgl.MapLayerMouseEvent) => {
    if (!enableMarker) return;
    if (!showMarker) return;
    setMarkers((markers) => [
      ...markers,
      {
        longitude: e.lngLat.lng,
        latitude: e.lngLat.lat,
        id: markers.length + 1,
      },
    ]);
  };

  const deleteMarker = (id: number) => {
    setMarkers((markers) => markers.filter((marker) => marker.id !== id));
  };

  const markersFeatures = useMemo(
    () =>
      markers.map((marker) => ({
        type: 'Feature',
        properties: {
          mag: 3,
        },
        geometry: {
          type: 'Point',
          coordinates: [marker.longitude, marker.latitude],
        },
      })),
    [markers]
  );

  const [zoomLevel, setZoomLevel] = React.useState(INITIAL_ZOOM);

  const mapRef = useRef(null);
  const points = markersFeatures;

  const map: MapCollection<mapboxgl.Map> | null = mapRef.current;
  const [bound3, setBound3] = React.useState([-180, -90, 180, 90, 0, 0]);

  useEffect(() => {
    if (map) {
      setBound3(map.getMap().getBounds().toArray().flat());
    }
  }, [map]);

  console.log('bounds', bound3);

  const { clusters, supercluster } = useSupercluster({
    points,
    bounds: bound3,
    zoom: zoomLevel,
    options: { radius: 75, maxZoom: 20 },
  });

  return (
    <Mapbox
      ref={mapRef}
      onZoom={(e) => setZoomLevel(e.target.getZoom())}
      onMove={(e) => {
        setBound3(e.target.getBounds().toArray().flat());
      }}
      id="mapbox"
      mapboxAccessToken={accessToken}
      initialViewState={{
        longitude: -122.4,
        latitude: 37.8,
        zoom: zoomLevel,
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
      {geoJson && (
        <Source id="geojson" type="geojson" data={geoJson}>
          <Layer
            id="data"
            type="fill"
            paint={{ 'fill-color': 'red', 'fill-opacity': 0.4 }}
          />
        </Source>
      )}
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

      {showClusters && (
        <>
          <Source
            id="markersFeatures"
            type="geojson"
            data={{
              type: 'FeatureCollection',
              features: markersFeatures as Feature[],
            }}
            cluster={true}
            clusterMaxZoom={14}
            clusterRadius={50}
          >
            <Layer {...clusterLayer} />
            <Layer {...clusterCountLayer} />
            <Layer {...unclusteredPointLayer} />
          </Source>
        </>
      )}

      {clusterCustomMarkers && (
        <Source
          id="makersSource"
          type="geojson"
          cluster={true}
          clusterMaxZoom={14}
          clusterRadius={50}
          data={{
            type: 'FeatureCollection',
            features: markersFeatures as Feature[],
          }}
        >
          <Layer
            id="clusters"
            type="circle"
            source="makersSource"
            filter={['has', 'point_count']}
            paint={{
              'circle-color': [
                'step',
                ['get', 'point_count'],
                '#51bbd6',
                100,
                '#f1f075',
                750,
                '#f28cb1',
              ],
              'circle-radius': [
                'step',
                ['get', 'point_count'],
                20,
                100,
                30,
                750,
                40,
              ],
            }}
          />

          {zoomLevel > INITIAL_ZOOM &&
            markers.map((marker, index) => (
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
        </Source>
      )}

      {clusters.map((cluster) => {
        const [longitude, latitude] = cluster.geometry.coordinates;
        const { cluster: isCluster, point_count: pointCount } =
          cluster.properties;

        if (isCluster) {
          return (
            <Marker
              key={`cluster-${cluster.id}`}
              latitude={latitude}
              longitude={longitude}
            >
              <div
                className="cluster-marker"
                style={{
                  width: `${10 + (pointCount / points.length) * 20}px`,
                  height: `${10 + (pointCount / points.length) * 20}px`,
                }}
              >
                {pointCount}
              </div>
            </Marker>
          );
        }

        return (
          <Marker
            key={`crime-${Math.random() * 1000}`}
            latitude={latitude}
            longitude={longitude}
          >
            <button className="crime-marker">
              <img src="https://picsum.photos/50" alt="crime" />
            </button>
          </Marker>
        );
      })}

      <ScaleControl />
    </Mapbox>
  );
};

export default Map;
