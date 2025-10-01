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
  Alabama: ['Mississippi', 'Tennessee', 'Georgia', 'Florida'],
  Alaska: [],
  Arizona: ['California', 'Nevada', 'Utah', 'Colorado', 'New Mexico'],
  Arkansas: [
    'Texas',
    'Oklahoma',
    'Missouri',
    'Tennessee',
    'Mississippi',
    'Louisiana',
  ],
  California: ['Oregon', 'Nevada', 'Arizona'],
  Colorado: [
    'Wyoming',
    'Nebraska',
    'Kansas',
    'Oklahoma',
    'New Mexico',
    'Arizona',
    'Utah',
  ],
  Connecticut: ['New York', 'Massachusetts', 'Rhode Island'],
  Delaware: ['Maryland', 'Pennsylvania', 'New Jersey'],
  Florida: ['Georgia', 'Alabama'],
  Georgia: [
    'Florida',
    'Alabama',
    'Tennessee',
    'North Carolina',
    'South Carolina',
  ],
  Hawaii: [],
  Idaho: ['Montana', 'Wyoming', 'Utah', 'Nevada', 'Oregon', 'Washington'],
  Illinois: [
    'Wisconsin',
    'Iowa',
    'Missouri',
    'Kentucky',
    'Indiana',
    'Michigan',
  ],
  Indiana: ['Michigan', 'Ohio', 'Kentucky', 'Illinois'],
  Iowa: [
    'Minnesota',
    'Wisconsin',
    'Illinois',
    'Missouri',
    'Nebraska',
    'South Dakota',
  ],
  Kansas: ['Nebraska', 'Missouri', 'Oklahoma', 'Colorado'],
  Kentucky: [
    'Illinois',
    'Indiana',
    'Ohio',
    'West Virginia',
    'Virginia',
    'Tennessee',
    'Missouri',
  ],
  Louisiana: ['Texas', 'Arkansas', 'Mississippi'],
  Maine: ['New Hampshire'],
  Maryland: ['Virginia', 'West Virginia', 'Pennsylvania', 'Delaware'],
  Massachusetts: [
    'New York',
    'Vermont',
    'New Hampshire',
    'Connecticut',
    'Rhode Island',
  ],
  Michigan: ['Ohio', 'Indiana', 'Wisconsin', 'Minnesota'],
  Minnesota: ['North Dakota', 'South Dakota', 'Iowa', 'Wisconsin', 'Michigan'],
  Mississippi: ['Louisiana', 'Arkansas', 'Tennessee', 'Alabama'],
  Missouri: [
    'Iowa',
    'Illinois',
    'Kentucky',
    'Tennessee',
    'Arkansas',
    'Oklahoma',
    'Kansas',
    'Nebraska',
  ],
  Montana: ['North Dakota', 'South Dakota', 'Wyoming', 'Idaho'],
  Nebraska: [
    'South Dakota',
    'Iowa',
    'Missouri',
    'Kansas',
    'Colorado',
    'Wyoming',
  ],
  Nevada: ['Oregon', 'Idaho', 'Utah', 'Arizona', 'California'],
  'New Hampshire': ['Vermont', 'Maine', 'Massachusetts'],
  'New Jersey': ['New York', 'Pennsylvania', 'Delaware'],
  'New Mexico': ['Arizona', 'Utah', 'Colorado', 'Oklahoma', 'Texas'],
  'New York': [
    'Pennsylvania',
    'New Jersey',
    'Connecticut',
    'Massachusetts',
    'Vermont',
  ],
  'North Carolina': ['Virginia', 'Tennessee', 'Georgia', 'South Carolina'],
  'North Dakota': ['Minnesota', 'South Dakota', 'Montana'],
  Ohio: ['Michigan', 'Indiana', 'Kentucky', 'West Virginia', 'Pennsylvania'],
  Oklahoma: [
    'Texas',
    'New Mexico',
    'Colorado',
    'Kansas',
    'Missouri',
    'Arkansas',
  ],
  Oregon: ['Washington', 'Idaho', 'Nevada', 'California'],
  Pennsylvania: [
    'New York',
    'New Jersey',
    'Delaware',
    'Maryland',
    'West Virginia',
    'Ohio',
  ],
  'Rhode Island': ['Connecticut', 'Massachusetts'],
  'South Carolina': ['North Carolina', 'Georgia'],
  'South Dakota': [
    'North Dakota',
    'Minnesota',
    'Iowa',
    'Nebraska',
    'Wyoming',
    'Montana',
  ],
  Tennessee: [
    'Kentucky',
    'Virginia',
    'North Carolina',
    'Georgia',
    'Alabama',
    'Mississippi',
    'Arkansas',
    'Missouri',
  ],
  Texas: ['New Mexico', 'Oklahoma', 'Arkansas', 'Louisiana'],
  Utah: ['Idaho', 'Wyoming', 'Colorado', 'New Mexico', 'Arizona', 'Nevada'],
  Vermont: ['New York', 'New Hampshire', 'Massachusetts'],
  Virginia: [
    'North Carolina',
    'Tennessee',
    'Kentucky',
    'West Virginia',
    'Maryland',
  ],
  Washington: ['Oregon', 'Idaho'],
  'West Virginia': ['Ohio', 'Pennsylvania', 'Maryland', 'Virginia', 'Kentucky'],
  Wisconsin: ['Minnesota', 'Iowa', 'Illinois', 'Michigan'],
  Wyoming: ['Montana', 'South Dakota', 'Nebraska', 'Colorado', 'Utah', 'Idaho'],
  'District of Columbia': ['Maryland', 'Virginia'],
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
  Alberta: ['British Columbia', 'Saskatchewan', 'Northwest Territories'],
  'British Columbia': ['Alberta', 'Yukon', 'Northwest Territories'],
  Manitoba: ['Saskatchewan', 'Ontario', 'Nunavut'],
  'New Brunswick': ['Quebec', 'Nova Scotia', 'Prince Edward Island'],
  'Newfoundland and Labrador': ['Quebec'],
  'Nova Scotia': ['New Brunswick', 'Prince Edward Island'],
  Ontario: ['Manitoba', 'Quebec'],
  'Prince Edward Island': ['Nova Scotia', 'New Brunswick'],
  Quebec: ['Ontario', 'New Brunswick', 'Newfoundland and Labrador', 'Nunavut'],
  Saskatchewan: ['Alberta', 'Manitoba', 'Northwest Territories'],
  'Northwest Territories': [
    'Yukon',
    'British Columbia',
    'Alberta',
    'Saskatchewan',
    'Nunavut',
  ],
  Nunavut: ['Manitoba', 'Quebec', 'Northwest Territories'],
  Yukon: ['British Columbia', 'Northwest Territories'],
};

// --- Province Name Normalization ---
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

const GEOJSON_URL_US =
  'https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json';
const GEOJSON_URL_CA =
  'https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/canada.geojson';

function App() {
  const [country, setCountry] = useState('USA'); // 'USA' or 'Canada'
  const [geoJsonUS, setGeoJsonUS] = useState(null);
  const [geoJsonCA, setGeoJsonCA] = useState(null);

  // Separate visited lists for each country
  const [visitedUS, setVisitedUS] = useState(() => {
    const saved = localStorage.getItem('visitedStates');
    return saved ? JSON.parse(saved) : [];
  });
  const [visitedCA, setVisitedCA] = useState(() => {
    const saved = localStorage.getItem('visitedProvinces');
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
  }, []);

  useEffect(() => {
    localStorage.setItem('visitedStates', JSON.stringify(visitedUS));
  }, [visitedUS]);
  useEffect(() => {
    localStorage.setItem('visitedProvinces', JSON.stringify(visitedCA));
  }, [visitedCA]);

  // --- Region lists ---
  const allStates = Object.keys(US_STATE_ABBREVIATIONS).sort();
  const allProvinces = CA_PROVINCES.sort();

  // --- Handlers ---
  const toggleRegion = (name) => {
    if (country === 'USA') {
      setVisitedUS((prev) =>
        prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
      );
    } else {
      setVisitedCA((prev) =>
        prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
      );
    }
  };

  const clearAll = () => {
    if (country === 'USA') setVisitedUS([]);
    else setVisitedCA([]);
  };
  const selectAll = () => {
    if (country === 'USA') setVisitedUS(allStates);
    else setVisitedCA(allProvinces);
  };
  const copyToClipboard = () => {
    const visited = country === 'USA' ? visitedUS : visitedCA;
    if (visited.length > 0) {
      navigator.clipboard.writeText(visited.join(', '));
      alert('Copied visited regions to clipboard!');
    }
  };

  const onEachFeature = (feature, layer) => {
    const rawName =
      feature.properties.name ||
      feature.properties.PROV ||
      feature.properties.PRENAME;
    const canonicalName =
      country === 'Canada' ? normalizeProvinceName(rawName) : rawName;
    layer.on({ click: () => toggleRegion(canonicalName) });
  };

  const style = (feature) => {
    const rawName =
      feature.properties.name ||
      feature.properties.PROV ||
      feature.properties.PRENAME;
    const canonicalName =
      country === 'Canada' ? normalizeProvinceName(rawName) : rawName;
    const visited = country === 'USA' ? visitedUS : visitedCA;
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
    return CA_PROVINCE_NEIGHBORS[region] || [];
  };

  const nextQuestion = (type) => {
    const all = country === 'USA' ? allStates : allProvinces;
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
          : CA_PROVINCE_CAPITALS[correct];
      const wrongCapitals = Object.values(
        country === 'USA' ? US_STATE_CAPITALS : CA_PROVINCE_CAPITALS
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
        : CA_PROVINCE_CAPITALS[quizRegion];
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
        </div>
        <h3>
          Visited: {country === 'USA' ? visitedUS.length : visitedCA.length} /{' '}
          {country === 'USA' ? allStates.length : allProvinces.length}
        </h3>
        <div className='buttons'>
          <button onClick={clearAll}>Clear</button>
          <button onClick={selectAll}>Select All</button>
          <button onClick={copyToClipboard}>Copy</button>

          {!quizMode && (
            <>
              <button onClick={() => startQuiz('state')}>
                Start {country === 'USA' ? 'State' : 'Province'} Quiz
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
            {(country === 'USA' ? visitedUS : visitedCA).map((region) => (
              <li key={region}>{region}</li>
            ))}
          </ul>
        )}
      </div>

      <div className='map'>
        <MapContainer
          center={country === 'USA' ? [37.8, -96] : [54, -96]}
          zoom={country === 'USA' ? 4 : 3}
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
        </MapContainer>
      </div>

      {!quizMode && (
        <div className='sidebar right'>
          <h3>{country === 'USA' ? 'All States' : 'All Provinces'}</h3>
          <ul>
            {(country === 'USA' ? allStates : allProvinces).map((region) => (
              <li
                key={region}
                className={
                  (country === 'USA' ? visitedUS : visitedCA).includes(region)
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
                  country === 'USA' ? 'state' : 'province'
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
