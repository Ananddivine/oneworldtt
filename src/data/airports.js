/**
 * Worldwide airport data for the frontend flight planner.
 *
 * Source: OurAirports open-data airports.csv.
 * We intentionally use the airport database only — there is NO live flight
 * availability or schedule lookup in this file.
 *
 * The dataset contains airport codes, names, municipalities, countries,
 * continents, coordinates, airport type and scheduled-service information.
 *
 * The first load fetches the public CSV and caches the normalized data in
 * localStorage. This keeps the app independent from flight APIs while still
 * giving the search box a worldwide airport database.
 */

const AIRPORTS_CSV_URL =
  'https://raw.githubusercontent.com/davidmegginson/ourairports-data/main/airports.csv';

const CACHE_KEY = 'wander_worldwide_airports_v1';
const CACHE_TTL = 1000 * 60 * 60 * 24 * 30; // refresh cached airport data monthly

// Useful starter airports so the dropdown is immediately useful before the
// worldwide CSV finishes loading.
const POPULAR_AIRPORTS = [
  { code: 'POM', city: 'Port Moresby', country: 'Papua New Guinea', region: 'png', continent: 'OC', latitude: -9.44338, longitude: 147.22005 },
  { code: 'LAE', city: 'Lae', country: 'Papua New Guinea', region: 'png', continent: 'OC', latitude: -6.5698, longitude: 146.726 },
  { code: 'HGU', city: 'Mount Hagen', country: 'Papua New Guinea', region: 'png', continent: 'OC', latitude: -5.82679, longitude: 144.296 },
  { code: 'BNE', city: 'Brisbane', country: 'Australia', region: 'australia', continent: 'OC', latitude: -27.3842, longitude: 153.117 },
  { code: 'SYD', city: 'Sydney', country: 'Australia', region: 'australia', continent: 'OC', latitude: -33.9461, longitude: 151.177 },
  { code: 'MEL', city: 'Melbourne', country: 'Australia', region: 'australia', continent: 'OC', latitude: -37.6733, longitude: 144.843 },
  { code: 'AKL', city: 'Auckland', country: 'New Zealand', region: 'australia', continent: 'OC', latitude: -37.0081, longitude: 174.792 },
  { code: 'NAN', city: 'Nadi', country: 'Fiji', region: 'pacific', continent: 'OC', latitude: -17.7554, longitude: 177.443 },
  { code: 'HIR', city: 'Honiara', country: 'Solomon Islands', region: 'pacific', continent: 'OC', latitude: -9.428, longitude: 160.054 },
  { code: 'VLI', city: 'Port Vila', country: 'Vanuatu', region: 'pacific', continent: 'OC', latitude: -17.6993, longitude: 168.32 },
  { code: 'SIN', city: 'Singapore', country: 'Singapore', region: 'asia', continent: 'AS', latitude: 1.35019, longitude: 103.994 },
  { code: 'KUL', city: 'Kuala Lumpur', country: 'Malaysia', region: 'asia', continent: 'AS', latitude: 2.74558, longitude: 101.71 },
  { code: 'BKK', city: 'Bangkok', country: 'Thailand', region: 'asia', continent: 'AS', latitude: 13.6811, longitude: 100.747 },
  { code: 'MNL', city: 'Manila', country: 'Philippines', region: 'asia', continent: 'AS', latitude: 14.5086, longitude: 121.019 },
  { code: 'HKG', city: 'Hong Kong', country: 'Hong Kong', region: 'asia', continent: 'AS', latitude: 22.308, longitude: 113.918 },
  { code: 'DEL', city: 'New Delhi', country: 'India', region: 'india', continent: 'AS', latitude: 28.5665, longitude: 77.1031 },
  { code: 'BOM', city: 'Mumbai', country: 'India', region: 'india', continent: 'AS', latitude: 19.0887, longitude: 72.8679 },
  { code: 'MAA', city: 'Chennai', country: 'India', region: 'india', continent: 'AS', latitude: 12.9941, longitude: 80.1709 },
  { code: 'BLR', city: 'Bengaluru', country: 'India', region: 'india', continent: 'AS', latitude: 13.1986, longitude: 77.7066 },
  { code: 'CMB', city: 'Colombo', country: 'Sri Lanka', region: 'asia', continent: 'AS', latitude: 7.18076, longitude: 79.8841 },
  { code: 'DXB', city: 'Dubai', country: 'United Arab Emirates', region: 'other', continent: 'AS', latitude: 25.2528, longitude: 55.3644 },
  { code: 'DOH', city: 'Doha', country: 'Qatar', region: 'other', continent: 'AS', latitude: 25.2731, longitude: 51.6081 },
  { code: 'LHR', city: 'London (Heathrow)', country: 'United Kingdom', region: 'other', continent: 'EU', latitude: 51.4706, longitude: -0.461941 },
  { code: 'CDG', city: 'Paris (Charles de Gaulle)', country: 'France', region: 'other', continent: 'EU', latitude: 49.0128, longitude: 2.55 },
  { code: 'FRA', city: 'Frankfurt', country: 'Germany', region: 'other', continent: 'EU', latitude: 50.0333, longitude: 8.57056 },
  { code: 'JFK', city: 'New York (JFK)', country: 'United States', region: 'other', continent: 'NA', latitude: 40.6398, longitude: -73.7789 },
  { code: 'LAX', city: 'Los Angeles', country: 'United States', region: 'other', continent: 'NA', latitude: 33.9425, longitude: -118.408 },
  { code: 'SFO', city: 'San Francisco', country: 'United States', region: 'other', continent: 'NA', latitude: 37.6188, longitude: -122.375 },
  { code: 'YVR', city: 'Vancouver', country: 'Canada', region: 'other', continent: 'NA', latitude: 49.1939, longitude: -123.184 },
  { code: 'GRU', city: 'São Paulo', country: 'Brazil', region: 'other', continent: 'SA', latitude: -23.4356, longitude: -46.4731 },
  { code: 'SYD', city: 'Sydney', country: 'Australia', region: 'australia', continent: 'OC', latitude: -33.9461, longitude: 151.177 },
];

export const REGION_LABELS = {
  png: 'Papua New Guinea',
  pacific: 'Pacific Islands',
  australia: 'Australia & New Zealand',
  asia: 'Asia',
  india: 'India',
  other: 'Other destinations',
};

export const POPULAR_CODES = [
  'POM', 'LAE', 'BNE', 'SYD', 'SIN', 'DEL', 'BOM', 'NAN',
];

let AIRPORTS = [...POPULAR_AIRPORTS];
let loadPromise = null;
let loaded = false;

function regionFor(continent, country) {
  if (country === 'Papua New Guinea') return 'png';
  if (continent === 'OC') {
    if (['Australia', 'New Zealand'].includes(country)) return 'australia';
    return 'pacific';
  }
  if (continent === 'AS') {
    if (country === 'India') return 'india';
    return 'asia';
  }
  return 'other';
}

function parseCsvLine(line) {
  const fields = [];
  let current = '';
  let quoted = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];

    if (char === '"') {
      if (quoted && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        quoted = !quoted;
      }
    } else if (char === ',' && !quoted) {
      fields.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  fields.push(current);
  return fields;
}

function parseAirportsCsv(csv) {
  const lines = csv.replace(/^\uFEFF/, '').split(/\r?\n/);
  if (!lines.length) return [];

  const headers = parseCsvLine(lines[0]);
  const index = Object.fromEntries(headers.map((h, i) => [h, i]));

  const result = [];

  for (let i = 1; i < lines.length; i += 1) {
    if (!lines[i]) continue;

    const row = parseCsvLine(lines[i]);
    const iata = row[index.iata_code]?.trim();

    // Passenger search is much more useful with airports that have an IATA
    // code. This still includes small/medium/large airports with IATA codes.
    if (!iata || iata.length !== 3) continue;

    const type = row[index.type]?.trim() || 'airport';
    if (type === 'closed_airport') continue;

    const latitude = Number(row[index.latitude_deg]);
    const longitude = Number(row[index.longitude_deg]);

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) continue;

    const country = row[index.iso_country]?.trim() || '';
    const continent = row[index.continent]?.trim() || '';

    result.push({
      code: iata.toUpperCase(),
      icao: row[index.icao_code]?.trim() || row[index.gps_code]?.trim() || '',
      city: row[index.municipality]?.trim() || row[index.name]?.trim() || iata,
      name: row[index.name]?.trim() || '',
      country,
      countryCode: country,
      region: regionFor(continent, country),
      continent,
      latitude,
      longitude,
      type,
      scheduledService: row[index.scheduled_service]?.trim() === 'yes',
      keywords: row[index.keywords]?.trim() || '',
    });
  }

  // IATA codes should be unique for our UI. Prefer scheduled-service and
  // larger airport types when duplicates exist in source data.
  const priority = {
    large_airport: 4,
    medium_airport: 3,
    small_airport: 2,
    seaplane_base: 1,
  };

  const byCode = new Map();

  for (const airport of result) {
    const existing = byCode.get(airport.code);
    if (
      !existing ||
      Number(airport.scheduledService) > Number(existing.scheduledService) ||
      (airport.scheduledService === existing.scheduledService &&
        (priority[airport.type] || 0) > (priority[existing.type] || 0))
    ) {
      byCode.set(airport.code, airport);
    }
  }

  return Array.from(byCode.values()).sort((a, b) =>
    `${a.city} ${a.country}`.localeCompare(`${b.city} ${b.country}`)
  );
}

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;

    const cached = JSON.parse(raw);
    if (!cached?.timestamp || !Array.isArray(cached.airports)) return null;

    if (Date.now() - cached.timestamp > CACHE_TTL) return null;

    return cached.airports;
  } catch {
    return null;
  }
}

function writeCache(airports) {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        timestamp: Date.now(),
        airports,
      })
    );
  } catch {
    // localStorage may be disabled or too small. The app still works in memory.
  }
}

/**
 * Load the worldwide airport database.
 *
 * Returns all IATA-coded airports from the public airport dataset.
 */
export async function loadAirports() {
  if (loaded) return AIRPORTS;
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    const cached = readCache();

    if (cached?.length) {
      AIRPORTS = cached;
      loaded = true;
      return AIRPORTS;
    }

    try {
      const response = await fetch(AIRPORTS_CSV_URL);
      if (!response.ok) throw new Error(`Airport database HTTP ${response.status}`);

      const csv = await response.text();
      const parsed = parseAirportsCsv(csv);

      if (!parsed.length) throw new Error('Airport database was empty');

      AIRPORTS = parsed;
      writeCache(AIRPORTS);
      loaded = true;

      return AIRPORTS;
    } catch (error) {
      // Keep the starter airports if the public dataset is temporarily
      // unavailable. Flight search can still operate with those airports.
      console.warn('Worldwide airport database could not be loaded:', error);
      loaded = true;
      return AIRPORTS;
    }
  })();

  return loadPromise;
}

export function getAirports() {
  return AIRPORTS;
}

export function findAirport(code) {
  if (!code) return undefined;
  const normalized = String(code).trim().toUpperCase();
  return AIRPORTS.find((airport) => airport.code === normalized);
}

export async function findAirportAsync(code) {
  await loadAirports();
  return findAirport(code);
}

export function searchAirports(query, { excludeCode, limit = 12 } = {}) {
  const q = (query || '').trim().toLowerCase();
  const excluded = excludeCode?.toUpperCase();

  const pool = excluded
    ? AIRPORTS.filter((airport) => airport.code !== excluded)
    : AIRPORTS;

  if (!q) return pool.slice(0, limit);

  return pool
    .filter((airport) => {
      const haystack = [
        airport.code,
        airport.icao,
        airport.city,
        airport.name,
        airport.country,
        airport.countryCode,
        airport.keywords,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(q);
    })
    .sort((a, b) => {
      const aCode = a.code.toLowerCase();
      const bCode = b.code.toLowerCase();
      const aCity = a.city.toLowerCase();
      const bCity = b.city.toLowerCase();

      const score = (airport, code, city) =>
        code === q ? 0 : code.startsWith(q) ? 1 : city.startsWith(q) ? 2 : 3;

      return score(a, aCode, aCity) - score(b, bCode, bCity);
    })
    .slice(0, limit);
}

export async function searchAirportsAsync(
  query,
  { excludeCode, limit = 12 } = {}
) {
  await loadAirports();
  return searchAirports(query, { excludeCode, limit });
}

export default AIRPORTS;
