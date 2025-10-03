import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
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

function normalizeProvinceName(name) {
  return CA_PROVINCE_NAME_MAP[name] || name;
}

function normalizeMexicoStateName(name) {
  return MX_STATE_NAME_MAP[name] || name;
}

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
  const [quizType, setQuizType] = useState('state'); // "state" | "capital" | "city"
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
    // --- City Skyline Quiz ---

    if (type === 'city') {
      const allCities = Object.keys(US_CITY_SKYLINES);
      const correct = allCities[Math.floor(Math.random() * allCities.length)];
      const wrongCities = allCities
        .filter((c) => c !== correct)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

      const choices = [...wrongCities, correct].sort(() => 0.5 - Math.random());

      setQuizRegion(correct);
      setOptions(choices);
      setFeedback('');

      return;
    }

    // --- State/Capital Quizzes ---
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
    let correctAnswer;

    if (quizType === 'state') {
      correctAnswer = quizRegion;
    } else if (quizType === 'capital') {
      correctAnswer =
        country === 'USA'
          ? US_STATE_CAPITALS[quizRegion]
          : country === 'Canada'
          ? CA_PROVINCE_CAPITALS[quizRegion]
          : MX_STATE_CAPITALS[quizRegion];
    } else if (quizType === 'city') {
      correctAnswer = quizRegion;
    }
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
