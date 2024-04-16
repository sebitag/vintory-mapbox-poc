"use client";

import React, { useMemo } from "react";
import {
  Layer,
  Map as Mapbox,
  Marker,
  ScaleControl,
  Source,
  useMap,
} from "react-map-gl";
import Pin from "./Pin";
import type { LayerProps } from "react-map-gl";
import { Feature } from "geojson";
import DrawControl, { useMapboxDraw } from "../../hooks/draw-control";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";

export const clusterLayer: LayerProps = {
  id: "clusters",
  type: "circle",
  source: "earthquakes",
  filter: ["has", "point_count"],
  paint: {
    "circle-color": [
      "step",
      ["get", "point_count"],
      "#51bbd6",
      100,
      "#f1f075",
      750,
      "#f28cb1",
    ],
    "circle-radius": ["step", ["get", "point_count"], 20, 100, 30, 750, 40],
  },
};

export const clusterCountLayer: LayerProps = {
  id: "cluster-count",
  type: "symbol",
  source: "earthquakes",
  filter: ["has", "point_count"],
  layout: {
    "text-field": "{point_count_abbreviated}",
    "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
    "text-size": 12,
  },
};

export const unclusteredPointLayer: LayerProps = {
  id: "unclustered-point",
  type: "circle",
  source: "earthquakes",
  filter: ["!", ["has", "point_count"]],
  paint: {
    "circle-color": "red",
    "circle-radius": 4,
    "circle-stroke-width": 1,
    "circle-stroke-color": "#fff",
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

  const onUpdate = React.useCallback((e) => {
    setFeatures((currFeatures) => {
      const newFeatures = { ...currFeatures };
      for (const f of e.features) {
        newFeatures[f.id] = f;
      }
      return newFeatures;
    });
  }, []);

  const onDelete = React.useCallback((e) => {
    setFeatures((currFeatures) => {
      const newFeatures = { ...currFeatures };
      for (const f of e.features) {
        delete newFeatures[f.id];
      }
      return newFeatures;
    });
  }, []);

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
        type: "Feature",
        properties: {
          mag: 3,
        },
        geometry: {
          type: "Point",
          coordinates: [marker.longitude, marker.latitude],
        },
      })),
    [markers]
  );

  const [zoomLevel, setZoomLevel] = React.useState(INITIAL_ZOOM);

  return (
    <Mapbox
      onZoom={(e) => setZoomLevel(e.target.getZoom())}
      id="mapbox"
      mapboxAccessToken={accessToken}
      initialViewState={{
        longitude: -122.4,
        latitude: 37.8,
        zoom: INITIAL_ZOOM,
        bearing: 0,
        pitch: 0,
      }}
      style={{
        width: "100vw",
        height: "100vh",
        position: "absolute",
        zIndex: 100,
      }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      onClick={handleClick}
    >
      {/* <DrawControl
        position="bottom-left"
        displayControlsDefault={false}
        controls={{
          polygon: true,
          trash: true,
        }}
        defaultMode="draw_polygon"
        onCreate={onUpdate}
        onUpdate={onUpdate}
        onDelete={onDelete}
      /> */}
      {geoJson && (
        <Source id="geojson" type="geojson" data={geoJson}>
          <Layer
            id="data"
            type="fill"
            paint={{ "fill-color": "red", "fill-opacity": 0.4 }}
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
              type: "FeatureCollection",
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
            type: "FeatureCollection",
            features: markersFeatures as Feature[],
          }}
        >
          <Layer
            id="clusters"
            type="circle"
            source="makersSource"
            filter={["has", "point_count"]}
            paint={{
              "circle-color": [
                "step",
                ["get", "point_count"],
                "#51bbd6",
                100,
                "#f1f075",
                750,
                "#f28cb1",
              ],
              "circle-radius": [
                "step",
                ["get", "point_count"],
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

      {/* 
            We need to use something like the code above to mix the markers and the clusters.

            I think we can use supercluster library too for cluster the markers for example.
            https://github.dev/jamalx31/mapbox-supercluster-example/tree/master/src
            https://github.com/mapbox/supercluster
      */}

      <ScaleControl />
    </Mapbox>
  );
};

export default Map;
