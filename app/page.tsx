"use client";

import * as React from "react";
import Map from "./components/Map";
import { MapProvider, useMap } from "react-map-gl";
import styles from "./page.module.css";
import { polygon_examples } from "./polygon_example";

import sanFrancisco from "../data/san-francisco.geo.json";
import losAngeles from "../data/los-angeles.geo.json";
import newYork from "../data/new-york.geo.json";
import miami from "../data/miami.geo.json";
import palmBeach from "../data/palm-beach.geo.json";
import sanDiego from "../data/san-diego.geo.json";
import { useMapboxDraw } from "@/hooks/draw-control";

const geojsons = [
  { name: "San Francisco", geojson: sanFrancisco },
  { name: "Los Angeles", geojson: losAngeles },
  { name: "New York", geojson: newYork },
  { name: "Miami", geojson: miami },
  { name: "Palm Beach", geojson: palmBeach },
  { name: "San Diego", geojson: sanDiego },
];

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

  const [enableMarker, setEnableMarker] = React.useState(false);
  const [drawMode, setDrawMode] = React.useState("");

  const [draw, setDraw] = React.useState<MapboxDraw>();

  const handleShowMarker = () => {
    setShowMarker(!showMarker);
  };

  React.useEffect(() => {
    console.log("useEffect", mapbox);

    mapbox?.on("draw.modechange", function (e) {
      setDrawMode(e.mode);
    });

    const draw = useMapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true,
      },
      onCreate: (e) => console.log("onCreate", e),
      onUpdate: (e) => console.log("onUpdate", e),
      onDelete: (e) => console.log("onDelete", e),
    });

    setDraw(draw);

    mapbox?.addControl(draw);
  }, [mapbox]);

  const handleZoomIn = () => {
    mapbox?.setZoom(mapbox.getZoom() + 1);
  };

  const handleZoomOut = () => {
    mapbox?.setZoom(mapbox.getZoom() - 1);
  };

  const [inputValue, setInputValue] = React.useState(
    '{"type":"FeatureCollection","features":[]}'
  );
  const [geoJson, setGeoJson] = React.useState<any | undefined>(undefined);
  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = (input?: string) => {
    try {
      const parsedValue = JSON.parse(input ?? inputValue);
      if (
        Object.keys(parsedValue).length === 0 &&
        parsedValue.type !== "FeatureCollection" &&
        parsedValue.type !== "Feature"
      ) {
        throw new Error("Invalid GeoJson");
      }
      setGeoJson(
        parsedValue.type === "Feature"
          ? {
              type: "FeatureCollection",
              features: [parsedValue],
            }
          : parsedValue
      );
    } catch (e) {
      alert("Invalid GeoJson");
      return;
    }
  };

  return (
    <div>
      <div
        style={{
          position: "absolute",
          display: "flex",
          flex: 1,
          width: "100vw",
          height: "100vh",
          flexDirection: "column",
        }}
      >
        <div className={styles.header}>
          <h3>Vintory</h3>
        </div>
        <div className={styles.funcContainer}>
          <div className={styles.section}>
            <p className={styles.funcTitle}>draw</p>
            <div>
              <button
                className={styles.buttonWhite}
                style={{
                  border: drawMode === "draw_polygon" ? "2px solid green" : "",
                }}
                onClick={() => {
                  const mode =
                    drawMode === "draw_polygon"
                      ? "simple_select"
                      : "draw_polygon";
                  draw.changeMode(mode as string);
                  setDrawMode(mode);
                }}
              >
                {drawMode === "draw_polygon" ? "stop drawing" : "Allow drawing"}
              </button>
              <button
                className={styles.buttonWhite}
                onClick={() => {
                  draw?.delete(draw.getSelectedIds());
                }}
              >
                delete
              </button>
              <button
                className={styles.buttonWhite}
                onClick={() => {
                  draw?.deleteAll();
                }}
              >
                delete all
              </button>
            </div>
          </div>
          <div className={styles.section}>
            <p className={styles.funcTitle}>Zoom</p>
            <div>
              <button className={styles.buttonWhite} onClick={handleZoomIn}>
                +
              </button>
              <button className={styles.buttonWhite} onClick={handleZoomOut}>
                -
              </button>
            </div>
          </div>

          <div className={styles.section}>
            <p className={styles.funcTitle}>GeoJson</p>
            <select
              className={styles.select}
              onChange={(event) => {
                setInputValue(event.target.value);
                handleSubmit(event.target.value);
              }}
            >
              <option value='{"type":"FeatureCollection","features":[]}'>
                Clean
              </option>
              {geojsons.map((geojson, index) => (
                <option
                  key={geojson.name}
                  value={JSON.stringify(geojson.geojson)}
                >
                  {geojson.name}
                </option>
              ))}
              {polygon_examples.map((example, index) => (
                <option key={index} value={example}>
                  Example {index + 1}
                </option>
              ))}
            </select>
            <textarea
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Enter Feature or FeatureCollection here"
            ></textarea>
            <button
              className={styles.buttonWhite}
              onClick={() => handleSubmit()}
            >
              Submit
            </button>
          </div>
          <div className={styles.section}>
            <p className={styles.funcTitle}>Markers</p>
            <button
              className={styles.buttonWhite}
              style={{ border: enableMarker ? "2px solid green" : "" }}
              onClick={() => setEnableMarker(!enableMarker)}
            >
              {enableMarker ? "stop adding markers" : "allow adding markers"}
            </button>
            <button className={styles.buttonWhite} onClick={handleShowMarker}>
              {showMarker ? "Hide markers" : "Show markers"}
            </button>
          </div>
          <div className={styles.section}>
            <p className={styles.funcTitle}>Clusters</p>
            <button
              className={styles.buttonWhite}
              onClick={() => setShowClusters((showClusters) => !showClusters)}
            >
              {showClusters ? "Hide clusters" : "Show clusters"}
            </button>
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
                ? "Hide cluster-marker"
                : "Show cluster-marker"}
            </button>
          </div>
        </div>
      </div>
      <Map
        enableMarker={enableMarker}
        showMarker={showMarker}
        showClusters={showClusters}
        geoJson={geoJson}
        clusterCustomMarkers={showClusterCustomMarkers}
      ></Map>
    </div>
  );
}

export default Page;
