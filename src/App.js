import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';

// --- US Data ---
const US_STATE_ABBREVIATIONS = {
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

const US_STATE_CAPITALS = {
  Alabama: 'Montgomery',
  Alaska: 'Juneau',
  Arizona: 'Phoenix',
  Arkansas: 'Little Rock',
  California: 'Sacramento',
  Colorado: 'Denver',
  Connecticut: 'Hartford',
  Delaware: 'Dover',
  Florida: 'Tallahassee',
  Georgia: 'Atlanta',
  Hawaii: 'Honolulu',
  Idaho: 'Boise',
  Illinois: 'Springfield',
  Indiana: 'Indianapolis',
  Iowa: 'Des Moines',
  Kansas: 'Topeka',
  Kentucky: 'Frankfort',
  Louisiana: 'Baton Rouge',
  Maine: 'Augusta',
  Maryland: 'Annapolis',
  Massachusetts: 'Boston',
  Michigan: 'Lansing',
  Minnesota: 'Saint Paul',
  Mississippi: 'Jackson',
  Missouri: 'Jefferson City',
  Montana: 'Helena',
  Nebraska: 'Lincoln',
  Nevada: 'Carson City',
  'New Hampshire': 'Concord',
  'New Jersey': 'Trenton',
  'New Mexico': 'Santa Fe',
  'New York': 'Albany',
  'North Carolina': 'Raleigh',
  'North Dakota': 'Bismarck',
  Ohio: 'Columbus',
  Oklahoma: 'Oklahoma City',
  Oregon: 'Salem',
  Pennsylvania: 'Harrisburg',
  'Rhode Island': 'Providence',
  'South Carolina': 'Columbia',
  'South Dakota': 'Pierre',
  Tennessee: 'Nashville',
  Texas: 'Austin',
  Utah: 'Salt Lake City',
  Vermont: 'Montpelier',
  Virginia: 'Richmond',
  Washington: 'Olympia',
  'West Virginia': 'Charleston',
  Wisconsin: 'Madison',
  Wyoming: 'Cheyenne',
  'District of Columbia': 'Washington, D.C.',
};

const US_STATE_NEIGHBORS = {
  // ...existing US neighbors...
  // (Omitted for brevity, use previous code)
};

// --- Canada Data ---
const CA_PROVINCES = [
  'Alberta',
  'British Columbia',
  'Manitoba',
  'New Brunswick',
  'Newfoundland and Labrador',
  'Nova Scotia',
  'Ontario',
  'Prince Edward Island',
  'Quebec',
  'Saskatchewan',
  'Northwest Territories',
  'Nunavut',
  'Yukon',
];

const CA_PROVINCE_ABBREVIATIONS = {
  Alberta: 'AB',
  'British Columbia': 'BC',
  Manitoba: 'MB',
  'New Brunswick': 'NB',
  'Newfoundland and Labrador': 'NL',
  'Nova Scotia': 'NS',
  Ontario: 'ON',
  'Prince Edward Island': 'PE',
  Quebec: 'QC',
  Saskatchewan: 'SK',
  'Northwest Territories': 'NT',
  Nunavut: 'NU',
  Yukon: 'YT',
};

const CA_PROVINCE_CAPITALS = {
  Alberta: 'Edmonton',
  'British Columbia': 'Victoria',
  Manitoba: 'Winnipeg',
  'New Brunswick': 'Fredericton',
  'Newfoundland and Labrador': "St. John's",
  'Nova Scotia': 'Halifax',
  Ontario: 'Toronto',
  'Prince Edward Island': 'Charlottetown',
  Quebec: 'Quebec City',
  Saskatchewan: 'Regina',
  'Northwest Territories': 'Yellowknife',
  Nunavut: 'Iqaluit',
  Yukon: 'Whitehorse',
};

const CA_PROVINCE_NEIGHBORS = {
  // ...existing Canada neighbors...
  // (Omitted for brevity, use previous code)
};

const CA_PROVINCE_NAME_MAP = {
  Yukon: 'Yukon',
  'Yukon Territory': 'Yukon',
  'Northwest Territories': 'Northwest Territories',
  Nunavut: 'Nunavut',
  'British Columbia': 'British Columbia',
  Alberta: 'Alberta',
  Saskatchewan: 'Saskatchewan',
  Manitoba: 'Manitoba',
  Ontario: 'Ontario',
  Quebec: 'Quebec',
  'New Brunswick': 'New Brunswick',
  'Nova Scotia': 'Nova Scotia',
  'Prince Edward Island': 'Prince Edward Island',
  'Newfoundland and Labrador': 'Newfoundland and Labrador',
  Newfoundland: 'Newfoundland and Labrador',
};

function normalizeProvinceName(name) {
  return CA_PROVINCE_NAME_MAP[name] || name;
}

// --- Mexico Data ---
const MX_STATES = [
  'Aguascalientes',
  'Baja California',
  'Baja California Sur',
  'Campeche',
  'Chiapas',
  'Chihuahua',
  'Coahuila',
  'Colima',
  'Durango',
  'Guanajuato',
  'Guerrero',
  'Hidalgo',
  'Jalisco',
  'México',
  'Michoacán',
  'Morelos',
  'Nayarit',
  'Nuevo León',
  'Oaxaca',
  'Puebla',
  'Querétaro',
  'Quintana Roo',
  'San Luis Potosí',
  'Sinaloa',
  'Sonora',
  'Tabasco',
  'Tamaulipas',
  'Tlaxcala',
  'Veracruz',
  'Yucatán',
  'Zacatecas',
  'Ciudad de México',
];

const MX_STATE_ABBREVIATIONS = {
  Aguascalientes: 'AGU',
  'Baja California': 'BCN',
  'Baja California Sur': 'BCS',
  Campeche: 'CAM',
  Chiapas: 'CHIS',
  Chihuahua: 'CHIH',
  Coahuila: 'COAH',
  Colima: 'COL',
  Durango: 'DGO',
  Guanajuato: 'GTO',
  Guerrero: 'GRO',
  Hidalgo: 'HGO',
  Jalisco: 'JAL',
  México: 'MEX',
  Michoacán: 'MIC',
  Morelos: 'MOR',
  Nayarit: 'NAY',
  'Nuevo León': 'NL',
  Oaxaca: 'OAX',
  Puebla: 'PUE',
  Querétaro: 'QRO',
  'Quintana Roo': 'QROO',
  'San Luis Potosí': 'SLP',
  Sinaloa: 'SIN',
  Sonora: 'SON',
  Tabasco: 'TAB',
  Tamaulipas: 'TAM',
  Tlaxcala: 'TLAX',
  Veracruz: 'VER',
  Yucatán: 'YUC',
  Zacatecas: 'ZAC',
  'Ciudad de México': 'CDMX',
};

const MX_STATE_CAPITALS = {
  Aguascalientes: 'Aguascalientes',
  'Baja California': 'Mexicali',
  'Baja California Sur': 'La Paz',
  Campeche: 'Campeche',
  Chiapas: 'Tuxtla Gutiérrez',
  Chihuahua: 'Chihuahua',
  Coahuila: 'Saltillo',
  Colima: 'Colima',
  Durango: 'Durango',
  Guanajuato: 'Guanajuato',
  Guerrero: 'Chilpancingo',
  Hidalgo: 'Pachuca',
  Jalisco: 'Guadalajara',
  México: 'Toluca',
  Michoacán: 'Morelia',
  Morelos: 'Cuernavaca',
  Nayarit: 'Tepic',
  'Nuevo León': 'Monterrey',
  Oaxaca: 'Oaxaca',
  Puebla: 'Puebla',
  Querétaro: 'Querétaro',
  'Quintana Roo': 'Chetumal',
  'San Luis Potosí': 'San Luis Potosí',
  Sinaloa: 'Culiacán',
  Sonora: 'Hermosillo',
  Tabasco: 'Villahermosa',
  Tamaulipas: 'Ciudad Victoria',
  Tlaxcala: 'Tlaxcala',
  Veracruz: 'Xalapa',
  Yucatán: 'Mérida',
  Zacatecas: 'Zacatecas',
  'Ciudad de México': 'Ciudad de México',
};

// For brevity, only a few neighbors are listed. You should expand this for full accuracy.
const MX_STATE_NEIGHBORS = {
  Aguascalientes: ['Zacatecas', 'Jalisco'],
  'Baja California': ['Sonora', 'Baja California Sur'],
  'Baja California Sur': ['Baja California'],
  Campeche: ['Yucatán', 'Quintana Roo', 'Tabasco'],
  Chiapas: ['Tabasco', 'Veracruz', 'Oaxaca'],
  Chihuahua: ['Sonora', 'Sinaloa', 'Durango', 'Coahuila'],
  Coahuila: [
    'Chihuahua',
    'Durango',
    'Zacatecas',
    'Nuevo León',
    'San Luis Potosí',
  ],
  Colima: ['Jalisco', 'Michoacán'],
  Durango: ['Chihuahua', 'Sinaloa', 'Nayarit', 'Zacatecas', 'Coahuila'],
  Guanajuato: [
    'Jalisco',
    'Zacatecas',
    'San Luis Potosí',
    'Querétaro',
    'Michoacán',
  ],
  Guerrero: ['Michoacán', 'México', 'Morelos', 'Puebla', 'Oaxaca'],
  Hidalgo: [
    'San Luis Potosí',
    'Querétaro',
    'México',
    'Tlaxcala',
    'Puebla',
    'Veracruz',
  ],
  Jalisco: [
    'Nayarit',
    'Zacatecas',
    'Aguascalientes',
    'Guanajuato',
    'Michoacán',
    'Colima',
  ],
  México: [
    'Querétaro',
    'Hidalgo',
    'Tlaxcala',
    'Puebla',
    'Morelos',
    'Guerrero',
    'Michoacán',
  ],
  Michoacán: ['Colima', 'Jalisco', 'Guanajuato', 'México', 'Guerrero'],
  Morelos: ['México', 'Guerrero', 'Puebla'],
  Nayarit: ['Sinaloa', 'Durango', 'Zacatecas', 'Jalisco'],
  'Nuevo León': ['Coahuila', 'Tamaulipas', 'San Luis Potosí'],
  Oaxaca: ['Guerrero', 'Puebla', 'Veracruz', 'Chiapas'],
  Puebla: [
    'Tlaxcala',
    'México',
    'Guerrero',
    'Oaxaca',
    'Veracruz',
    'Hidalgo',
    'Morelos',
  ],
  Querétaro: ['San Luis Potosí', 'Guanajuato', 'México', 'Hidalgo'],
  'Quintana Roo': ['Yucatán', 'Campeche'],
  'San Luis Potosí': [
    'Zacatecas',
    'Coahuila',
    'Nuevo León',
    'Tamaulipas',
    'Veracruz',
    'Hidalgo',
    'Querétaro',
    'Guanajuato',
  ],
  Sinaloa: ['Sonora', 'Chihuahua', 'Durango', 'Nayarit'],
  Sonora: ['Chihuahua', 'Sinaloa', 'Baja California'],
  Tabasco: ['Campeche', 'Veracruz', 'Chiapas'],
  Tamaulipas: ['Nuevo León', 'San Luis Potosí', 'Veracruz'],
  Tlaxcala: ['Puebla', 'México', 'Hidalgo'],
  Veracruz: [
    'Tamaulipas',
    'San Luis Potosí',
    'Hidalgo',
    'Puebla',
    'Oaxaca',
    'Tabasco',
  ],
  Yucatán: ['Campeche', 'Quintana Roo'],
  Zacatecas: [
    'Durango',
    'Coahuila',
    'San Luis Potosí',
    'Guanajuato',
    'Aguascalientes',
    'Jalisco',
    'Nayarit',
  ],
  'Ciudad de México': ['México'],
};

const MX_STATE_NAME_MAP = {
  Aguascalientes: 'Aguascalientes',
  'Baja California': 'Baja California',
  'Baja California Sur': 'Baja California Sur',
  Campeche: 'Campeche',
  Chiapas: 'Chiapas',
  Chihuahua: 'Chihuahua',
  Coahuila: 'Coahuila',
  Colima: 'Colima',
  Durango: 'Durango',
  Guanajuato: 'Guanajuato',
  Guerrero: 'Guerrero',
  Hidalgo: 'Hidalgo',
  Jalisco: 'Jalisco',
  México: 'México',
  Michoacán: 'Michoacán',
  Morelos: 'Morelos',
  Nayarit: 'Nayarit',
  'Nuevo León': 'Nuevo León',
  Oaxaca: 'Oaxaca',
  Puebla: 'Puebla',
  Querétaro: 'Querétaro',
  'Quintana Roo': 'Quintana Roo',
  'San Luis Potosí': 'San Luis Potosí',
  Sinaloa: 'Sinaloa',
  Sonora: 'Sonora',
  Tabasco: 'Tabasco',
  Tamaulipas: 'Tamaulipas',
  Tlaxcala: 'Tlaxcala',
  Veracruz: 'Veracruz',
  Yucatán: 'Yucatán',
  Zacatecas: 'Zacatecas',
  'Ciudad de México': 'Ciudad de México',
  'Mexico City': 'Ciudad de México',
};

function normalizeMexicoStateName(name) {
  return MX_STATE_NAME_MAP[name] || name;
}

const GEOJSON_URL_US =
  'https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json';
const GEOJSON_URL_CA =
  'https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/canada.geojson';
const GEOJSON_URL_MX =
  'https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/mexico.geojson';

function App() {
  const [country, setCountry] = useState('USA'); // 'USA', 'Canada', 'Mexico'
  const [geoJsonUS, setGeoJsonUS] = useState(null);
  const [geoJsonCA, setGeoJsonCA] = useState(null);
  const [geoJsonMX, setGeoJsonMX] = useState(null);

  // Separate visited lists for each country
  const [visitedUS, setVisitedUS] = useState(() => {
    const saved = localStorage.getItem('visitedStates');
    return saved ? JSON.parse(saved) : [];
  });
  const [visitedCA, setVisitedCA] = useState(() => {
    const saved = localStorage.getItem('visitedProvinces');
    return saved ? JSON.parse(saved) : [];
  });
  const [visitedMX, setVisitedMX] = useState(() => {
    const saved = localStorage.getItem('visitedMexicoStates');
    return saved ? JSON.parse(saved) : [];
  });

  // Quiz state
  const [quizMode, setQuizMode] = useState(false);
  const [quizType, setQuizType] = useState('state'); // "state" or "capital"
  const [quizRegion, setQuizRegion] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [showFinishModal, setShowFinishModal] = useState(false);
  const QUIZ_LENGTH = 10;

  useEffect(() => {
    fetch(GEOJSON_URL_US)
      .then((res) => res.json())
      .then((data) => setGeoJsonUS(data));
    fetch(GEOJSON_URL_CA)
      .then((res) => res.json())
      .then((data) => setGeoJsonCA(data));
    fetch(GEOJSON_URL_MX)
      .then((res) => res.json())
      .then((data) => setGeoJsonMX(data));
  }, []);

  useEffect(() => {
    localStorage.setItem('visitedStates', JSON.stringify(visitedUS));
  }, [visitedUS]);
  useEffect(() => {
    localStorage.setItem('visitedProvinces', JSON.stringify(visitedCA));
  }, [visitedCA]);
  useEffect(() => {
    localStorage.setItem('visitedMexicoStates', JSON.stringify(visitedMX));
  }, [visitedMX]);

  // --- Region lists ---
  const allStates = Object.keys(US_STATE_ABBREVIATIONS).sort();
  const allProvinces = CA_PROVINCES.sort();
  const allMexicoStates = MX_STATES.sort();

  // --- Handlers ---
  const toggleRegion = (name) => {
    if (country === 'USA') {
      setVisitedUS((prev) =>
        prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
      );
    } else if (country === 'Canada') {
      setVisitedCA((prev) =>
        prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
      );
    } else {
      setVisitedMX((prev) =>
        prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
      );
    }
  };

  const clearAll = () => {
    if (country === 'USA') setVisitedUS([]);
    else if (country === 'Canada') setVisitedCA([]);
    else setVisitedMX([]);
  };
  const selectAll = () => {
    if (country === 'USA') setVisitedUS(allStates);
    else if (country === 'Canada') setVisitedCA(allProvinces);
    else setVisitedMX(allMexicoStates);
  };
  const copyToClipboard = () => {
    const visited =
      country === 'USA'
        ? visitedUS
        : country === 'Canada'
        ? visitedCA
        : visitedMX;
    if (visited.length > 0) {
      navigator.clipboard.writeText(visited.join(', '));
      alert('Copied visited regions to clipboard!');
    }
  };

  const onEachFeature = (feature, layer) => {
    const rawName =
      feature.properties.name ||
      feature.properties.PROV ||
      feature.properties.PRENAME ||
      feature.properties.NOM_ENT;
    let canonicalName = rawName;
    if (country === 'Canada') canonicalName = normalizeProvinceName(rawName);
    if (country === 'Mexico') canonicalName = normalizeMexicoStateName(rawName);
    layer.on({ click: () => toggleRegion(canonicalName) });
  };

  const style = (feature) => {
    const rawName =
      feature.properties.name ||
      feature.properties.PROV ||
      feature.properties.PRENAME ||
      feature.properties.NOM_ENT;
    let canonicalName = rawName;
    if (country === 'Canada') canonicalName = normalizeProvinceName(rawName);
    if (country === 'Mexico') canonicalName = normalizeMexicoStateName(rawName);
    const visited =
      country === 'USA'
        ? visitedUS
        : country === 'Canada'
        ? visitedCA
        : visitedMX;
    if (quizMode && quizType === 'state' && canonicalName === quizRegion) {
      return {
        fillColor: 'yellow',
        weight: 2,
        color: 'black',
        fillOpacity: 0.6,
      };
    }
    return {
      fillColor: visited.includes(canonicalName) ? 'blue' : 'lightgray',
      weight: 1,
      color: 'black',
      fillOpacity: 0.6,
    };
  };

  // --- Quiz functions ---
  const startQuiz = (type) => {
    setQuizType(type);
    setScore(0);
    setQuestionIndex(0);
    setFeedback('');
    setShowFinishModal(false);
    nextQuestion(type);
    setQuizMode(true);
  };

  const exitQuiz = () => {
    setQuizMode(false);
    setQuizRegion(null);
    setOptions([]);
    setFeedback('');
    setQuestionIndex(0);
    setScore(0);
  };

  const getNeighbors = (region) => {
    if (country === 'USA') return US_STATE_NEIGHBORS[region] || [];
    if (country === 'Canada') return CA_PROVINCE_NEIGHBORS[region] || [];
    return MX_STATE_NEIGHBORS[region] || [];
  };

  const nextQuestion = (type) => {
    const all =
      country === 'USA'
        ? allStates
        : country === 'Canada'
        ? allProvinces
        : allMexicoStates;
    const correct = all[Math.floor(Math.random() * all.length)];

    let choices = [];
    if (type === 'state') {
      const neighbors = getNeighbors(correct) || [];
      let wrongRegions = neighbors.filter((s) => s !== correct);
      if (wrongRegions.length < 3) {
        const others = all.filter(
          (s) => s !== correct && !wrongRegions.includes(s)
        );
        wrongRegions = [
          ...wrongRegions,
          ...others
            .sort(() => 0.5 - Math.random())
            .slice(0, 3 - wrongRegions.length),
        ];
      } else {
        wrongRegions = wrongRegions.sort(() => 0.5 - Math.random()).slice(0, 3);
      }
      choices = [...wrongRegions, correct].sort(() => 0.5 - Math.random());
    } else if (type === 'capital') {
      const correctCapital =
        country === 'USA'
          ? US_STATE_CAPITALS[correct]
          : country === 'Canada'
          ? CA_PROVINCE_CAPITALS[correct]
          : MX_STATE_CAPITALS[correct];
      const wrongCapitals = Object.values(
        country === 'USA'
          ? US_STATE_CAPITALS
          : country === 'Canada'
          ? CA_PROVINCE_CAPITALS
          : MX_STATE_CAPITALS
      )
        .filter((c) => c !== correctCapital)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      choices = [...wrongCapitals, correctCapital].sort(
        () => 0.5 - Math.random()
      );
    }

    setQuizRegion(correct);
    setOptions(choices);
    setFeedback('');
  };

  const handleAnswer = (selected) => {
    let correctAnswer =
      quizType === 'state'
        ? quizRegion
        : country === 'USA'
        ? US_STATE_CAPITALS[quizRegion]
        : country === 'Canada'
        ? CA_PROVINCE_CAPITALS[quizRegion]
        : MX_STATE_CAPITALS[quizRegion];
    if (selected === correctAnswer) {
      setScore((prev) => prev + 1);
      setFeedback('✅ Correct!');
    } else {
      setFeedback(`❌ Wrong! Correct answer: ${correctAnswer}`);
    }

    if (questionIndex + 1 >= QUIZ_LENGTH) {
      setTimeout(() => {
        setShowFinishModal(true);
        setQuizMode(false);
        setQuizRegion(null);
        setOptions([]);
        setFeedback('');
      }, 800);
    } else {
      setQuestionIndex((prev) => prev + 1);
      setTimeout(() => nextQuestion(quizType), 800);
    }
  };

  const closeModal = () => setShowFinishModal(false);

  // --- UI ---
  return (
    <div className='container'>
      <div className='sidebar left'>
        <div className='buttons'>
          <button
            onClick={() => setCountry('USA')}
            style={{
              fontWeight: country === 'USA' ? 'bold' : 'normal',
              background: country === 'USA' ? '#d0e0ff' : undefined,
            }}
          >
            USA
          </button>
          <button
            onClick={() => setCountry('Canada')}
            style={{
              fontWeight: country === 'Canada' ? 'bold' : 'normal',
              background: country === 'Canada' ? '#d0e0ff' : undefined,
            }}
          >
            Canada
          </button>
          <button
            onClick={() => setCountry('Mexico')}
            style={{
              fontWeight: country === 'Mexico' ? 'bold' : 'normal',
              background: country === 'Mexico' ? '#d0e0ff' : undefined,
            }}
          >
            Mexico
          </button>
        </div>
        <h3>
          Visited:{' '}
          {country === 'USA'
            ? visitedUS.length
            : country === 'Canada'
            ? visitedCA.length
            : visitedMX.length}{' '}
          /{' '}
          {country === 'USA'
            ? allStates.length
            : country === 'Canada'
            ? allProvinces.length
            : allMexicoStates.length}
        </h3>
        <div className='buttons'>
          <button onClick={clearAll}>Clear</button>
          <button onClick={selectAll}>Select All</button>
          <button onClick={copyToClipboard}>Copy</button>

          {!quizMode && (
            <>
              <button onClick={() => startQuiz('state')}>
                Start{' '}
                {country === 'USA'
                  ? 'State'
                  : country === 'Canada'
                  ? 'Province'
                  : 'State'}{' '}
                Quiz
              </button>
              <button onClick={() => startQuiz('capital')}>
                Start Capital Quiz
              </button>
            </>
          )}

          {quizMode && <button onClick={exitQuiz}>Exit Quiz</button>}
        </div>

        {quizMode && (
          <p>
            Score: {score} / {QUIZ_LENGTH}
          </p>
        )}

        {!quizMode && (
          <ul>
            {(country === 'USA'
              ? visitedUS
              : country === 'Canada'
              ? visitedCA
              : visitedMX
            ).map((region) => (
              <li key={region}>{region}</li>
            ))}
          </ul>
        )}
      </div>

      <div className='map'>
        <MapContainer
          center={
            country === 'USA'
              ? [37.8, -96]
              : country === 'Canada'
              ? [54, -96]
              : [23.6345, -102.5528]
          }
          zoom={country === 'USA' ? 4 : country === 'Canada' ? 3 : 5}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          />
          {country === 'USA' && geoJsonUS && (
            <GeoJSON
              data={geoJsonUS}
              style={style}
              onEachFeature={onEachFeature}
            />
          )}
          {country === 'Canada' && geoJsonCA && (
            <GeoJSON
              data={geoJsonCA}
              style={style}
              onEachFeature={onEachFeature}
            />
          )}
          {country === 'Mexico' && geoJsonMX && (
            <GeoJSON
              data={geoJsonMX}
              style={style}
              onEachFeature={onEachFeature}
            />
          )}
        </MapContainer>
      </div>

      {!quizMode && (
        <div className='sidebar right'>
          <h3>
            {country === 'USA'
              ? 'All States'
              : country === 'Canada'
              ? 'All Provinces'
              : 'All States'}
          </h3>
          <ul>
            {(country === 'USA'
              ? allStates
              : country === 'Canada'
              ? allProvinces
              : allMexicoStates
            ).map((region) => (
              <li
                key={region}
                className={
                  (country === 'USA'
                    ? visitedUS
                    : country === 'Canada'
                    ? visitedCA
                    : visitedMX
                  ).includes(region)
                    ? 'selected'
                    : ''
                }
                onClick={() => toggleRegion(region)}
              >
                {region}
              </li>
            ))}
          </ul>
        </div>
      )}

      {quizMode && options.length > 0 && (
        <div className='sidebar right'>
          <h3>
            Question {questionIndex + 1} of {QUIZ_LENGTH}
          </h3>
          <p>
            {quizType === 'state'
              ? `Which ${
                  country === 'USA'
                    ? 'state'
                    : country === 'Canada'
                    ? 'province'
                    : 'state'
                } is highlighted?`
              : `What is the capital of ${quizRegion}?`}
          </p>
          <ul>
            {options.map((opt) => (
              <li key={opt} onClick={() => handleAnswer(opt)}>
                {opt}
              </li>
            ))}
          </ul>
          {feedback && <p className='feedback'>{feedback}</p>}
        </div>
      )}

      {showFinishModal && (
        <div className='modal-overlay'>
          <div className='modal'>
            <h2>Quiz Finished!</h2>
            <p>
              Your score: {score} / {QUIZ_LENGTH}
            </p>
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
