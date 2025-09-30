import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';

const GEOJSON_URL =
  'https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json';

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

const STATE_CAPITALS = {
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

function App() {
  const [geoJson, setGeoJson] = useState(null);
  const [visited, setVisited] = useState(() => {
    const saved = localStorage.getItem('visitedStates');
    return saved ? JSON.parse(saved) : [];
  });

  // Quiz state
  const [quizMode, setQuizMode] = useState(false);
  const [quizType, setQuizType] = useState('state'); // "state" or "capital"
  const [quizState, setQuizState] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [showFinishModal, setShowFinishModal] = useState(false);
  const QUIZ_LENGTH = 10;

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
    if (quizMode && quizType === 'state' && name === quizState) {
      return {
        fillColor: 'yellow',
        weight: 2,
        color: 'black',
        fillOpacity: 0.6,
      };
    }
    return {
      fillColor: visited.includes(name) ? 'blue' : 'lightgray',
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
    setQuizState(null);
    setOptions([]);
    setFeedback('');
    setQuestionIndex(0);
    setScore(0);
  };

  const nextQuestion = (type) => {
    if (!geoJson) return;
    const allStates = geoJson.features.map((f) => f.properties.name);
    const correct = allStates[Math.floor(Math.random() * allStates.length)];

    let choices = [];
    if (type === 'state') {
      const wrongStates = allStates
        .filter((s) => s !== correct)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      choices = [...wrongStates, correct].sort(() => 0.5 - Math.random());
    } else if (type === 'capital') {
      const correctCapital = STATE_CAPITALS[correct];
      const wrongCapitals = Object.values(STATE_CAPITALS)
        .filter((c) => c !== correctCapital)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      choices = [...wrongCapitals, correctCapital].sort(
        () => 0.5 - Math.random()
      );
    }

    setQuizState(correct);
    setOptions(choices);
    setFeedback('');
  };

  const handleAnswer = (selected) => {
    let correctAnswer =
      quizType === 'state' ? quizState : STATE_CAPITALS[quizState];
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
        setQuizState(null);
        setOptions([]);
        setFeedback('');
      }, 800);
    } else {
      setQuestionIndex((prev) => prev + 1);
      setTimeout(() => nextQuestion(quizType), 800);
    }
  };

  const closeModal = () => setShowFinishModal(false);

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

          {!quizMode && (
            <>
              <button onClick={() => startQuiz('state')}>
                Start State Quiz
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

      {!quizMode && (
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
      )}

      {quizMode && options.length > 0 && (
        <div className='sidebar right'>
          <h3>
            Question {questionIndex + 1} of {QUIZ_LENGTH}
          </h3>
          <p>
            {quizType === 'state'
              ? 'Which state is highlighted?'
              : `What is the capital of ${quizState}?`}
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
