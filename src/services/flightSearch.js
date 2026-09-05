import { findAirport, loadAirports } from '../data/airports';

/**
 * Frontend-only flight planner.
 *
 * IMPORTANT:
 * This file does NOT search live flights and does NOT claim that a generated
 * flight number, airline, departure time, fare or stop is bookable.
 *
 * It calculates realistic-looking planning options from airport coordinates.
 * Actual availability and fare must be confirmed separately by the travel team.
 */

const AIRLINE_POOLS = {
  png: [
    { code: 'PX', name: 'Air Niugini' },
    { code: 'CG', name: 'PNG Air' },
  ],
  oceania: [
    { code: 'PX', name: 'Air Niugini' },
    { code: 'QF', name: 'Qantas' },
    { code: 'VA', name: 'Virgin Australia' },
    { code: 'NZ', name: 'Air New Zealand' },
    { code: 'FJ', name: 'Fiji Airways' },
  ],
  asia: [
    { code: 'SQ', name: 'Singapore Airlines' },
    { code: 'MH', name: 'Malaysia Airlines' },
    { code: 'TG', name: 'Thai Airways' },
    { code: 'CX', name: 'Cathay Pacific' },
    { code: 'PR', name: 'Philippine Airlines' },
    { code: 'VN', name: 'Vietnam Airlines' },
    { code: 'GA', name: 'Garuda Indonesia' },
    { code: 'JL', name: 'Japan Airlines' },
    { code: 'NH', name: 'ANA' },
    { code: 'KE', name: 'Korean Air' },
  ],
  india: [
    { code: 'AI', name: 'Air India' },
    { code: '6E', name: 'IndiGo' },
    { code: 'SQ', name: 'Singapore Airlines' },
    { code: 'MH', name: 'Malaysia Airlines' },
    { code: 'EK', name: 'Emirates' },
    { code: 'QR', name: 'Qatar Airways' },
  ],
  middleEast: [
    { code: 'EK', name: 'Emirates' },
    { code: 'QR', name: 'Qatar Airways' },
    { code: 'EY', name: 'Etihad Airways' },
    { code: 'WY', name: 'Oman Air' },
    { code: 'TK', name: 'Turkish Airlines' },
  ],
  europe: [
    { code: 'BA', name: 'British Airways' },
    { code: 'LH', name: 'Lufthansa' },
    { code: 'AF', name: 'Air France' },
    { code: 'KL', name: 'KLM' },
    { code: 'TK', name: 'Turkish Airlines' },
    { code: 'EK', name: 'Emirates' },
    { code: 'QR', name: 'Qatar Airways' },
    { code: 'SQ', name: 'Singapore Airlines' },
  ],
  northAmerica: [
    { code: 'UA', name: 'United Airlines' },
    { code: 'AA', name: 'American Airlines' },
    { code: 'DL', name: 'Delta Air Lines' },
    { code: 'AC', name: 'Air Canada' },
    { code: 'AS', name: 'Alaska Airlines' },
    { code: 'FJ', name: 'Fiji Airways' },
    { code: 'QF', name: 'Qantas' },
  ],
  southAmerica: [
    { code: 'LA', name: 'LATAM Airlines' },
    { code: 'AV', name: 'Avianca' },
    { code: 'CM', name: 'Copa Airlines' },
    { code: 'AA', name: 'American Airlines' },
    { code: 'QF', name: 'Qantas' },
  ],
  africa: [
    { code: 'ET', name: 'Ethiopian Airlines' },
    { code: 'KQ', name: 'Kenya Airways' },
    { code: 'SA', name: 'South African Airways' },
    { code: 'MS', name: 'EgyptAir' },
    { code: 'EK', name: 'Emirates' },
    { code: 'QR', name: 'Qatar Airways' },
  ],
};

const HUBS = {
  oceania: ['BNE', 'SYD', 'NAN', 'AKL'],
  asia: ['SIN', 'KUL', 'BKK', 'HKG'],
  india: ['DEL', 'BOM', 'BLR', 'MAA'],
  middleEast: ['DXB', 'DOH', 'AUH'],
  europe: ['LHR', 'FRA', 'CDG', 'AMS'],
  northAmerica: ['LAX', 'SFO', 'YVR', 'JFK'],
  southAmerica: ['GRU', 'SCL', 'LIM', 'BOG'],
  africa: ['ADD', 'NBO', 'JNB', 'CAI'],
};

const CONTINENT_TO_TIER = {
  OC: 'oceania',
  AS: 'asia',
  EU: 'europe',
  NA: 'northAmerica',
  SA: 'southAmerica',
  AF: 'africa',
};

function hashString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i += 1) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0;
  }
  return h;
}

function seededRandom(seed) {
  let value = seed % 2147483647;
  if (value <= 0) value += 2147483646;

  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

function pad(n) {
  return String(n).padStart(2, '0');
}

export function formatDuration(mins) {
  const safe = Math.max(0, Math.round(mins || 0));
  const h = Math.floor(safe / 60);
  const m = safe % 60;
  return `${h}h ${pad(m)}m`;
}

function formatTime(hours, minutes) {
  const total = hours * 60 + minutes;
  const normalized = ((total % 1440) + 1440) % 1440;
  return `${pad(Math.floor(normalized / 60))}:${pad(normalized % 60)}`;
}

function addMinutes(hours, minutes, add) {
  const total = hours * 60 + minutes + add;
  return {
    hours: Math.floor(total / 60) % 24,
    minutes: total % 60,
    dayOffset: Math.floor(total / 1440),
  };
}

function toRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

export function calculateDistanceKm(from, to) {
  const earthRadiusKm = 6371;

  const lat1 = toRadians(from.latitude);
  const lat2 = toRadians(to.latitude);
  const dLat = toRadians(to.latitude - from.latitude);
  const dLon = toRadians(to.longitude - from.longitude);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(dLon / 2) ** 2;

  return (
    earthRadiusKm *
    2 *
    Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  );
}

function estimatedBlockMinutes(distanceKm) {
  // Approximate block time. Adds time for taxi/climb/descent and keeps very
  // short sectors from becoming unrealistically fast.
  if (distanceKm < 300) return Math.max(50, Math.round(distanceKm / 6 + 25));
  if (distanceKm < 1000) return Math.round(distanceKm / 8.2 + 35);
  if (distanceKm < 3000) return Math.round(distanceKm / 8.7 + 45);
  if (distanceKm < 7000) return Math.round(distanceKm / 8.9 + 55);
  if (distanceKm < 12000) return Math.round(distanceKm / 8.5 + 65);
  return Math.round(distanceKm / 8.2 + 75);
}

function tierFor(from, to, distanceKm) {
  if (from.country === 'Papua New Guinea' && to.country === 'Papua New Guinea') {
    return 'png';
  }

  if (distanceKm <= 2500 && (from.continent === 'OC' || to.continent === 'OC')) {
    return 'oceania';
  }

  if (from.country === 'India' || to.country === 'India') {
    return 'india';
  }

  // Middle East is treated separately for airline selection.
  const middleEastCodes = new Set([
    'AE', 'QA', 'SA', 'OM', 'BH', 'KW', 'JO', 'IL', 'TR',
  ]);

  if (
    middleEastCodes.has(from.countryCode) ||
    middleEastCodes.has(to.countryCode)
  ) {
    return 'middleEast';
  }

  if (from.continent === 'EU' || to.continent === 'EU') return 'europe';
  if (from.continent === 'NA' || to.continent === 'NA') return 'northAmerica';
  if (from.continent === 'SA' || to.continent === 'SA') return 'southAmerica';
  if (from.continent === 'AF' || to.continent === 'AF') return 'africa';

  return 'asia';
}

function airlinePoolFor(tier) {
  return AIRLINE_POOLS[tier] || AIRLINE_POOLS.asia;
}

function chooseHub(from, to, tier, rng) {
  const candidates = (HUBS[tier] || []).filter(
    (code) => code !== from.code && code !== to.code
  );

  if (!candidates.length) return null;

  return candidates[Math.floor(rng() * candidates.length)];
}

function estimatedPricePgk(distanceKm, stops, rng) {
  // Planning-only fare estimate. It is deliberately not tied to live fares.
  let base;

  if (distanceKm < 1000) base = 650;
  else if (distanceKm < 2500) base = 1400;
  else if (distanceKm < 5000) base = 2600;
  else if (distanceKm < 8000) base = 3900;
  else if (distanceKm < 12000) base = 5200;
  else base = 6900;

  const stopFactor = 1 + stops * 0.18;
  const variation = 0.85 + rng() * 0.35;

  return Math.round((base * stopFactor * variation) / 10) * 10;
}

function buildLeg({
  from,
  to,
  date,
  rng,
  optionIndex,
  forcedStops,
}) {
  const distanceKm = calculateDistanceKm(from, to);
  const directDuration = estimatedBlockMinutes(distanceKm);

  let stops = forcedStops;

  if (typeof stops !== 'number') {
    if (distanceKm < 1800) {
      stops = rng() > 0.82 ? 1 : 0;
    } else if (distanceKm < 5000) {
      stops = rng() > 0.45 ? 1 : 0;
    } else {
      stops = rng() > 0.35 ? 2 : 1;
    }
  }

  const tier = tierFor(from, to, distanceKm);
  const pool = airlinePoolFor(tier);
  const airline = pool[optionIndex % pool.length];

  let stopCity = null;
  let durationMins = directDuration;

  if (stops > 0) {
    const hubCode = chooseHub(from, to, tier, rng);
    const hub = hubCode ? findAirport(hubCode) : null;

    if (hub) {
      stopCity = hub.city;
    }

    // Connection/ground time is an estimate, not a schedule.
    durationMins += stops === 1 ? 120 : 240;
  }

  const depHour = 5 + Math.floor(rng() * 17);
  const depMinute = rng() > 0.5 ? 0 : 30;
  const arrival = addMinutes(depHour, depMinute, durationMins);

  return {
    id: `${from.code}-${to.code}-${date}-${optionIndex}-${hashString(
      `${from.code}${to.code}${date}${optionIndex}`
    )}`,
    airline: airline.name,
    airlineCode: airline.code,
    flightNumber: `${airline.code}${100 + Math.floor(rng() * 8900)}`,
    from: from.code,
    to: to.code,
    date,
    departTime: formatTime(depHour, depMinute),
    arriveTime: formatTime(arrival.hours, arrival.minutes),
    arriveNextDay: arrival.dayOffset > 0,
    durationMins,
    distanceKm: Math.round(distanceKm),
    stops,
    stopCity,
    price: estimatedPricePgk(distanceKm, stops, rng),
    currency: 'PGK',
    source: 'estimated',
  };
}

function generateMockLeg({ from, to, date, seed }) {
  const options = [];

  for (let i = 0; i < 5; i += 1) {
    const rng = seededRandom(seed + i * 7919);

    options.push(
      buildLeg({
        from,
        to,
        date,
        rng,
        optionIndex: i,
      })
    );
  }

  return options.sort((a, b) => a.price - b.price);
}

export async function searchFlights(params) {
  await loadAirports();

  const from = findAirport(params.from);
  const to = findAirport(params.to);

  if (!from || !to) {
    throw new Error('Please choose a valid departure and destination airport.');
  }

  if (from.code === to.code) {
    throw new Error('Departure and destination cannot be the same airport.');
  }

  const {
    departDate,
    returnDate,
    tripType = 'oneway',
  } = params;

  const outboundSeed = hashString(
    `${from.code}-${to.code}-${departDate}`
  );

  const outbound = generateMockLeg({
    from,
    to,
    date: departDate,
    seed: outboundSeed,
  });

  let inbound = null;

  if (tripType === 'roundtrip' && returnDate) {
    const inboundSeed = hashString(
      `${to.code}-${from.code}-${returnDate}`
    );

    inbound = generateMockLeg({
      from: to,
      to: from,
      date: returnDate,
      seed: inboundSeed,
    });
  }

  return {
    outbound,
    inbound,
    source: 'estimated',
    disclaimer:
      'Estimated planning data only. Airline, flight number, times, stops and fares are illustrative and must be confirmed before booking.',
  };
}
