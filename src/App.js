import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import LoginPane from './components/LoginPane';
import AuthModal from './components/modals/AuthModal';
import FinishModal from './components/modals/FinishModal';
import 'leaflet/dist/leaflet.css';
import './App.css';

import {
  US_STATE_ABBREVIATIONS,
  US_STATE_CAPITALS,
  US_STATE_NEIGHBORS,
  US_CITY_SKYLINES,
  GEOJSON_URL_US,
} from './constants/usa';

import {
  CA_PROVINCES,
  CA_PROVINCE_CAPITALS,
  CA_PROVINCE_NEIGHBORS,
  CA_PROVINCE_NAME_MAP,
  GEOJSON_URL_CA,
} from './constants/canada';

import {
  MX_STATES,
  MX_STATE_ABBREVIATIONS,
  MX_STATE_CAPITALS,
  MX_STATE_NEIGHBORS,
  MX_STATE_NAME_MAP,
  GEOJSON_URL_MX,
} from './constants/mexico';

// --- Helpers ---
const normalizeProvinceName = (name) => CA_PROVINCE_NAME_MAP[name] || name;
const normalizeMexicoStateName = (name) => MX_STATE_NAME_MAP[name] || name;

const getVisitedList = (country, visitedUS, visitedCA, visitedMX) =>
  country === 'USA' ? visitedUS : country === 'Canada' ? visitedCA : visitedMX;

const getAllRegions = (country, allStates, allProvinces, allMexicoStates) =>
  country === 'USA'
    ? allStates
    : country === 'Canada'
    ? allProvinces
    : allMexicoStates;

const getNeighbors = (country, region) =>
  country === 'USA'
    ? US_STATE_NEIGHBORS[region] || []
    : country === 'Canada'
    ? CA_PROVINCE_NEIGHBORS[region] || []
    : MX_STATE_NEIGHBORS[region] || [];

const getCapital = (country, region) =>
  country === 'USA'
    ? US_STATE_CAPITALS[region]
    : country === 'Canada'
    ? CA_PROVINCE_CAPITALS[region]
    : MX_STATE_CAPITALS[region];

const normalizeRegionName = (country, name) =>
  country === 'Canada'
    ? normalizeProvinceName(name)
    : country === 'Mexico'
    ? normalizeMexicoStateName(name)
    : name;

function App() {
  const [country, setCountry] = useState('USA');
  const [geoJsonUS, setGeoJsonUS] = useState(null);
  const [geoJsonCA, setGeoJsonCA] = useState(null);
  const [geoJsonMX, setGeoJsonMX] = useState(null);

  const [visitedUS, setVisitedUS] = useState(
    () => JSON.parse(localStorage.getItem('visitedStates')) || []
  );
  const [visitedCA, setVisitedCA] = useState(
    () => JSON.parse(localStorage.getItem('visitedProvinces')) || []
  );
  const [visitedMX, setVisitedMX] = useState(
    () => JSON.parse(localStorage.getItem('visitedMexicoStates')) || []
  );

  const [quizMode, setQuizMode] = useState(false);
  const [quizType, setQuizType] = useState('state');
  const [quizRegion, setQuizRegion] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [showFinishModal, setShowFinishModal] = useState(false);
  // --- Auth modal state (LoginPane / AuthModal) ---
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'
  const [authError, setAuthError] = useState('');
  const QUIZ_LENGTH = 10;

  // --- Fetch GeoJSON ---
  useEffect(() => {
    fetch(GEOJSON_URL_US)
      .then((res) => res.json())
      .then(setGeoJsonUS);
    fetch(GEOJSON_URL_CA)
      .then((res) => res.json())
      .then(setGeoJsonCA);
    fetch(GEOJSON_URL_MX)
      .then((res) => res.json())
      .then(setGeoJsonMX);
  }, []);

  // --- Persist visited lists ---
  useEffect(() => {
    localStorage.setItem('visitedStates', JSON.stringify(visitedUS));
  }, [visitedUS]);
  useEffect(() => {
    localStorage.setItem('visitedProvinces', JSON.stringify(visitedCA));
  }, [visitedCA]);
  useEffect(() => {
    localStorage.setItem('visitedMexicoStates', JSON.stringify(visitedMX));
  }, [visitedMX]);

  // --- Region data ---
  const allStates = Object.keys(US_STATE_ABBREVIATIONS).sort();
  const allProvinces = CA_PROVINCES.sort();
  const allMexicoStates = MX_STATES.sort();

  // --- Handlers ---
  const toggleRegion = (name) => {
    if (country === 'USA')
      setVisitedUS((prev) =>
        prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
      );
    else if (country === 'Canada')
      setVisitedCA((prev) =>
        prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
      );
    else
      setVisitedMX((prev) =>
        prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
      );
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
    const visited = getVisitedList(country, visitedUS, visitedCA, visitedMX);
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
    const canonicalName = normalizeRegionName(country, rawName);
    layer.on({ click: () => toggleRegion(canonicalName) });
  };

  const style = (feature) => {
    const rawName =
      feature.properties.name ||
      feature.properties.PROV ||
      feature.properties.PRENAME ||
      feature.properties.NOM_ENT;
    const canonicalName = normalizeRegionName(country, rawName);
    const visited = getVisitedList(country, visitedUS, visitedCA, visitedMX);

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

  // --- Quiz logic ---
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

  const nextQuestion = (type) => {
    if (type === 'city') {
      const allCities = Object.keys(US_CITY_SKYLINES);
      const correct = allCities[Math.floor(Math.random() * allCities.length)];
      const wrongCities = allCities
        .filter((c) => c !== correct)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      setQuizRegion(correct);
      setOptions([...wrongCities, correct].sort(() => 0.5 - Math.random()));
      setFeedback('');
      return;
    }

    const all = getAllRegions(
      country,
      allStates,
      allProvinces,
      allMexicoStates
    );
    const correct = all[Math.floor(Math.random() * all.length)];

    let choices = [];
    if (type === 'state') {
      let wrongRegions = getNeighbors(country, correct).filter(
        (s) => s !== correct
      );
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
      } else
        wrongRegions = wrongRegions.sort(() => 0.5 - Math.random()).slice(0, 3);
      choices = [...wrongRegions, correct].sort(() => 0.5 - Math.random());
    } else if (type === 'capital') {
      const correctCapital = getCapital(country, correct);
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
      quizType === 'state' || quizType === 'city'
        ? quizRegion
        : getCapital(country, quizRegion);

    if (selected === correctAnswer) {
      setScore((prev) => prev + 1);
      setFeedback('✅ Correct!');
    } else setFeedback(`❌ Wrong! Correct answer: ${correctAnswer}`);

    if (questionIndex + 1 >= QUIZ_LENGTH) {
      setTimeout(() => {
        setShowFinishModal(true);
        exitQuiz();
      }, 800);
    } else {
      setQuestionIndex((prev) => prev + 1);
      setTimeout(() => nextQuestion(quizType), 800);
    }
  };

  const closeModal = () => setShowFinishModal(false);

  // --- UI ---
  const visitedList = getVisitedList(country, visitedUS, visitedCA, visitedMX);
  const allRegions = getAllRegions(
    country,
    allStates,
    allProvinces,
    allMexicoStates
  );

  return (
    <div className='app-root'>
      {/* Top login pane (component) */}
      <LoginPane
        onOpenAuth={(mode) => {
          setAuthMode(mode);
          setAuthError('');
          setShowAuthModal(true);
        }}
      />

      {/* Auth modal (mock) - shown when user clicks Log in / Sign up */}
      {showAuthModal && (
        <AuthModal
          mode={authMode}
          onClose={() => setShowAuthModal(false)}
          onLocalAuth={(e) => {
            e?.preventDefault();
            setAuthError('');
            // mock success
            alert(
              `Mock: ${authMode === 'login' ? 'Signed in' : 'Account created'}`
            );
            setShowAuthModal(false);
          }}
          onGoogleAuth={() => {
            // mock Google flow
            setAuthError('');
            alert('Mock: Signed in with Google');
            setShowAuthModal(false);
          }}
          error={authError}
        />
      )}
      <div className='container'>
        <div className='sidebar left'>
          <div className='buttons'>
            {['USA', 'Canada', 'Mexico'].map((c) => (
              <button
                key={c}
                onClick={() => setCountry(c)}
                style={{
                  fontWeight: country === c ? 'bold' : 'normal',
                  background: country === c ? '#d0e0ff' : undefined,
                }}
              >
                {c}
              </button>
            ))}
          </div>

          <h3>
            Visited: {visitedList.length} / {allRegions.length}
          </h3>

          <div className='buttons'>
            <button onClick={clearAll}>Clear</button>
            <button onClick={selectAll}>Select All</button>
            <button onClick={copyToClipboard}>Copy</button>

            {!quizMode && (
              <>
                <button onClick={() => startQuiz('state')}>
                  Start {country === 'Canada' ? 'Province' : 'State'} Quiz
                </button>
                <button onClick={() => startQuiz('capital')}>
                  Start Capital Quiz
                </button>
                {country === 'USA' && (
                  <button onClick={() => startQuiz('city')}>
                    Start City Skyline Quiz
                  </button>
                )}
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
              {visitedList.map((region) => (
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

        {/* Right Sidebar */}
        <div className='sidebar right'>
          {!quizMode && (
            <>
              <h3>
                {country === 'USA'
                  ? 'All States'
                  : country === 'Canada'
                  ? 'All Provinces'
                  : 'All States'}
              </h3>
              <ul>
                {allRegions.map((region) => (
                  <li
                    key={region}
                    className={visitedList.includes(region) ? 'selected' : ''}
                    onClick={() => toggleRegion(region)}
                  >
                    {region}
                  </li>
                ))}
              </ul>
            </>
          )}
          {quizMode && options.length > 0 && (
            <>
              <h3>
                Question {questionIndex + 1} of {QUIZ_LENGTH}
              </h3>
              <p>
                {quizType === 'state'
                  ? `Which ${
                      country === 'Canada' ? 'province' : 'state'
                    } is highlighted?`
                  : quizType === 'capital'
                  ? `What is the capital of ${quizRegion}?`
                  : 'Which city skyline is this?'}
              </p>
              {quizType === 'city' && (
                <img
                  src={US_CITY_SKYLINES[quizRegion]}
                  alt={quizRegion}
                  style={{
                    width: '100%',
                    borderRadius: '8px',
                    marginBottom: '10px',
                    maxHeight: '250px',
                    objectFit: 'cover',
                  }}
                />
              )}
              <ul>
                {options.map((opt) => (
                  <li key={opt} onClick={() => handleAnswer(opt)}>
                    {opt}
                  </li>
                ))}
              </ul>
              {feedback && <p className='feedback'>{feedback}</p>}
            </>
          )}
        </div>

        {showFinishModal && (
          <FinishModal score={score} total={QUIZ_LENGTH} onClose={closeModal} />
        )}
      </div>
    </div>
  );
}

export default App;
