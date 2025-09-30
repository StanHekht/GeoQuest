import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';

const GEOJSON_URL =
  'https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json';

function App() {
  const [geoJson, setGeoJson] = useState(null);
  const [visited, setVisited] = useState(() => {
    const saved = localStorage.getItem('visitedStates');
    return saved ? JSON.parse(saved) : [];
  });

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

  const clearAll = () => {
    setVisited([]);
  };

  const copyToClipboard = () => {
    if (visited.length > 0) {
      navigator.clipboard.writeText(visited.join(', '));
      alert('Copied visited states to clipboard!');
    }
  };

  const onEachFeature = (feature, layer) => {
    const name = feature.properties.name;
    layer.on({
      click: () => toggleState(name),
    });
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

  return (
    <div className='container'>
      <div className='sidebar'>
        <h3>Visited States ({visited.length}/50)</h3>

        <div className='buttons'>
          <button onClick={clearAll}>Clear</button>
          <button onClick={copyToClipboard}>Copy</button>
        </div>

        {visited.length === 0 ? (
          <p>No states selected — click a state on the map.</p>
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
          zoom={4}
          style={{ height: '100%', width: '100%' }}
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
    </div>
  );
}

export default App;
