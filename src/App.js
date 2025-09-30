import React, { useEffect, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  Marker,
  useMapEvents,
} from 'react-leaflet';
import L from 'leaflet';
import * as turf from '@turf/turf';
import 'leaflet/dist/leaflet.css';
import './App.css';

const GEOJSON_URL =
  'https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json';

// State abbreviations
const STATE_ABBREVIATIONS = {
  Alabama: 'AL',
  Alaska: 'AK',
  Arizona: 'AZ',
  Arkansas: 'AR',
  California: 'CA',
  Colorado: 'CO',
  Connecticut: 'CT',
  Delaware: 'DE',
  Florida: 'FL',
  Georgia: 'GA',
  Hawaii: 'HI',
  Idaho: 'ID',
  Illinois: 'IL',
  Indiana: 'IN',
  Iowa: 'IA',
  Kansas: 'KS',
  Kentucky: 'KY',
  Louisiana: 'LA',
  Maine: 'ME',
  Maryland: 'MD',
  Massachusetts: 'MA',
  Michigan: 'MI',
  Minnesota: 'MN',
  Mississippi: 'MS',
  Missouri: 'MO',
  Montana: 'MT',
  Nebraska: 'NE',
  Nevada: 'NV',
  'New Hampshire': 'NH',
  'New Jersey': 'NJ',
  'New Mexico': 'NM',
  'New York': 'NY',
  'North Carolina': 'NC',
  'North Dakota': 'ND',
  Ohio: 'OH',
  Oklahoma: 'OK',
  Oregon: 'OR',
  Pennsylvania: 'PA',
  'Rhode Island': 'RI',
  'South Carolina': 'SC',
  'South Dakota': 'SD',
  Tennessee: 'TN',
  Texas: 'TX',
  Utah: 'UT',
  Vermont: 'VT',
  Virginia: 'VA',
  Washington: 'WA',
  'West Virginia': 'WV',
  Wisconsin: 'WI',
  Wyoming: 'WY',
  'District of Columbia': 'DC',
};

// Manual positions for small states
const SMALL_STATE_POSITIONS = {
  Delaware: [39.0, -75.5],
  Maryland: [39.0, -76.8],
  'District of Columbia': [38.9, -77.0],
  'Rhode Island': [41.6, -71.5],
  Connecticut: [41.6, -72.7],
  'New Jersey': [40.1, -74.7],
  Hawaii: [20.7, -157.5],
};

// Component for rendering state labels with dynamic font
const StateLabels = ({ geoJson, zoom }) => {
  if (!geoJson) return null;

  return (
    <>
      {geoJson.features.map((feature) => {
        const name = feature.properties.name;
        const abbr = STATE_ABBREVIATIONS[name] || name;

        const latlng =
          SMALL_STATE_POSITIONS[name] ||
          (() => {
            const point = turf.pointOnFeature(feature);
            const [lng, lat] = point.geometry.coordinates;
            return [lat, lng];
          })();

        const fontSize = Math.min(zoom * 2, 16);

        const icon = L.divIcon({
          className: 'state-label',
          html: `<span style="font-size:${fontSize}px">${abbr}</span>`,
          iconSize: [0, 0],
        });

        return <Marker key={name} position={latlng} icon={icon} />;
      })}
    </>
  );
};

function App() {
  const [geoJson, setGeoJson] = useState(null);
  const [visited, setVisited] = useState(() => {
    const saved = localStorage.getItem('visitedStates');
    return saved ? JSON.parse(saved) : [];
  });
  const [zoom, setZoom] = useState(4);

  useEffect(() => {
    fetch(GEOJSON_URL)
      .then((res) => res.json())
      .then((data) => setGeoJson(data));
  }, []);

  useEffect(() => {
    localStorage.setItem('visitedStates', JSON.stringify(visited));
  }, [visited]);

  const toggleState = (name) => {
    setVisited((prev) =>
      prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
    );
  };

  const clearAll = () => setVisited([]);

  const selectAll = () => setVisited(Object.keys(STATE_ABBREVIATIONS));

  const copyToClipboard = () => {
    if (visited.length > 0) {
      navigator.clipboard.writeText(visited.join(', '));
      alert('Copied visited states to clipboard!');
    }
  };

  const onEachFeature = (feature, layer) => {
    const name = feature.properties.name;
    layer.on({ click: () => toggleState(name) });
  };

  const style = (feature) => {
    const name = feature.properties.name;
    return {
      fillColor: visited.includes(name) ? 'blue' : 'lightgray',
      weight: 1,
      color: 'black',
      fillOpacity: 0.6,
    };
  };

  // Sorted list of all states
  const allStates = Object.keys(STATE_ABBREVIATIONS).sort();

  return (
    <div className='container'>
      <div className='sidebar left'>
        <h3>Visited States ({visited.length}/50)</h3>
        <div className='buttons'>
          <button onClick={clearAll}>Clear</button>
          <button onClick={selectAll}>Select All</button>
          <button onClick={copyToClipboard}>Copy</button>
        </div>
        {visited.length === 0 ? (
          <p>No states selected — click a state on the map or right sidebar.</p>
        ) : (
          <ul>
            {visited.map((state) => (
              <li key={state}>{state}</li>
            ))}
          </ul>
        )}
      </div>

      <div className='map'>
        <MapContainer
          center={[37.8, -96]}
          zoom={zoom}
          style={{ height: '100%', width: '100%' }}
          whenCreated={(map) => {
            map.on('zoomend', () => setZoom(map.getZoom()));
          }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          />
          {geoJson && (
            <>
              <GeoJSON
                data={geoJson}
                style={style}
                onEachFeature={onEachFeature}
              />
              <StateLabels geoJson={geoJson} zoom={zoom} />
            </>
          )}
        </MapContainer>
      </div>

      <div className='sidebar right'>
        <h3>All States</h3>
        <ul>
          {allStates.map((state) => (
            <li
              key={state}
              className={visited.includes(state) ? 'selected' : ''}
              onClick={() => toggleState(state)}
            >
              {state}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
