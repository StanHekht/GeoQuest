import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';

const GEOJSON_URL =
  'https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json';

// State abbreviations (still useful for sidebars)
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

  const allStates = Object.keys(STATE_ABBREVIATIONS).sort();

  return (
    <div className='container'>
      <div className='sidebar left'>
        <h3>
          Visited: {visited.filter((s) => s !== 'District of Columbia').length}{' '}
          / 50 states
          {visited.includes('District of Columbia') ? ' + DC' : ''}
        </h3>

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
            <GeoJSON
              data={geoJson}
              style={style}
              onEachFeature={onEachFeature}
            />
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
