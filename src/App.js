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

function App() {
  const [geoJson, setGeoJson] = useState(null);
  const [visited, setVisited] = useState(() => {
    const saved = localStorage.getItem('visitedStates');
    return saved ? JSON.parse(saved) : [];
  });

  // Quiz state
  const [quizMode, setQuizMode] = useState(false);
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
    if (quizMode && name === quizState) {
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
  const startQuiz = () => {
    setScore(0);
    setQuestionIndex(0);
    setFeedback('');
    setShowFinishModal(false);
    nextQuestion();
    setQuizMode(true);
  };

  const nextQuestion = () => {
    if (!geoJson) return;
    const allStates = geoJson.features.map((f) => f.properties.name);
    const correct = allStates[Math.floor(Math.random() * allStates.length)];

    const wrongStates = allStates
      .filter((s) => s !== correct)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    const choices = [...wrongStates, correct].sort(() => 0.5 - Math.random());

    setQuizState(correct);
    setOptions(choices);
    setFeedback(''); // reset feedback for new question
  };

  const handleAnswer = (selected) => {
    if (selected === quizState) {
      setScore((prev) => prev + 1);
      setFeedback('✅ Correct!');
    } else {
      setFeedback(`❌ Wrong! The correct answer was ${quizState}.`);
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
      setTimeout(nextQuestion, 800); // small delay to show feedback
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
          <button onClick={quizMode ? () => setQuizMode(false) : startQuiz}>
            {quizMode ? 'Exit Quiz' : 'Start Quiz'}
          </button>
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
          <p>Which state is highlighted?</p>
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

      {/* Custom Finish Modal */}
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
