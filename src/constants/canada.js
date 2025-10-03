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
  'Newfoundland and Labrador': [],
  'Nova Scotia': ['New Brunswick', 'Prince Edward Island'],
  Ontario: ['Manitoba', 'Quebec'],
  'Prince Edward Island': ['Nova Scotia', 'New Brunswick'],
  Quebec: ['Ontario', 'New Brunswick', 'Newfoundland and Labrador'],
  Saskatchewan: ['Alberta', 'Manitoba', 'Northwest Territories'],
  'Northwest Territories': [
    'Yukon',
    'British Columbia',
    'Alberta',
    'Saskatchewan',
    'Nunavut',
  ],
  Nunavut: ['Northwest Territories', 'Manitoba'],
  Yukon: ['British Columbia', 'Northwest Territories'],
};

const CA_PROVINCE_NAME_MAP = {
  Alberta: 'Alberta',
  'British Columbia': 'British Columbia',
  Manitoba: 'Manitoba',
  'New Brunswick': 'New Brunswick',
  'Newfoundland and Labrador': 'Newfoundland and Labrador',
  'Nova Scotia': 'Nova Scotia',
  Ontario: 'Ontario',
  'Prince Edward Island': 'Prince Edward Island',
  Quebec: 'Quebec',
  Saskatchewan: 'Saskatchewan',
  'Northwest Territories': 'Northwest Territories',
  Nunavut: 'Nunavut',
  Yukon: 'Yukon',
};

const GEOJSON_URL_CA =
  'https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/canada.geojson';

export {
  CA_PROVINCES,
  CA_PROVINCE_CAPITALS,
  CA_PROVINCE_NEIGHBORS,
  CA_PROVINCE_NAME_MAP,
  GEOJSON_URL_CA,
};
