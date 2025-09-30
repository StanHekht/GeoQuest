import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

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

  const onEachFeature = (feature, layer) => {
    const name = feature.properties.name;
    layer.on('click', () => toggleState(name));
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
    <div style={{ height: '100vh', width: '100%' }}>
      <h2 style={{ textAlign: 'center' }}>
        States I Visited ({visited.length}/50)
      </h2>
      <MapContainer
        center={[37.8, -96]}
        zoom={4}
        style={{ height: '90%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        {geoJson && (
          <GeoJSON data={geoJson} style={style} onEachFeature={onEachFeature} />
        )}
      </MapContainer>
    </div>
  );
}

export default App;
