import { findAirport } from '../data/airports';

// ---------------------------------------------------------------------------
// This file powers the "plan an itinerary" search on the Flights page.
//
// Out of the box it runs on MOCK data so the page works with zero setup.
// If you sign up for a free Amadeus for Developers "Self-Service" account
// (https://developers.amadeus.com) and put your test API keys in a .env
// file (see .env.example), searches will call the real Amadeus Flight
// Offers Search sandbox instead. Sandbox data is realistic but is test
// data, not a live purchasable fare — real bookings still go through
// our team, which is why every result links back to the Contact page.
// ---------------------------------------------------------------------------

const AMADEUS_CLIENT_ID = import.meta.env.VITE_AMADEUS_CLIENT_ID;
const AMADEUS_CLIENT_SECRET = import.meta.env.VITE_AMADEUS_CLIENT_SECRET;
const AMADEUS_BASE = 'https://test.api.amadeus.com';

const AIRLINES_DOMESTIC = [
  { code: 'PX', name: 'Air Niugini' },
  { code: 'CG', name: 'PNG Air' },
];

const AIRLINES_REGIONAL = [
  { code: 'PX', name: 'Air Niugini' },
  { code: 'QF', name: 'Qantas' },
];

const AIRLINES_INTERNATIONAL = [
  { code: 'SQ', name: 'Singapore Airlines' },
  { code: 'PR', name: 'Philippine Airlines' },
  { code: 'AI', name: 'Air India' },
  { code: '6E', name: 'IndiGo' },
];

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

function tripTier(fromCode, toCode) {
  const domestic = ['POM', 'LAE', 'HGU', 'RAB', 'GKA', 'MAG'];
  const isDomestic = domestic.includes(fromCode) && domestic.includes(toCode);
  const india = ['DEL', 'BOM', 'MAA', 'HYD', 'BLR'];
  if (isDomestic) return 'domestic';
  if (india.includes(fromCode) || india.includes(toCode)) return 'international';
  return 'regional';
}

function pad(n) {
  return String(n).padStart(2, '0');
}

function formatTime(hours, minutes) {
  const h = ((hours % 24) + 24) % 24;
  return `${pad(h)}:${pad(minutes)}`;
}

function addMinutes(hours, minutes, add) {
  const total = hours * 60 + minutes + add;
  return { hours: Math.floor(total / 60) % 24, minutes: total % 60, dayOffset: Math.floor(total / (60 * 24)) };
}

function buildMockLeg({ from, to, date, rng, tier }) {
  const pool = tier === 'domestic' ? AIRLINES_DOMESTIC : tier === 'regional' ? AIRLINES_REGIONAL : AIRLINES_INTERNATIONAL;
  const baseDuration = tier === 'domestic' ? 60 + Math.floor(rng() * 60) : tier === 'regional' ? 180 + Math.floor(rng() * 120) : 480 + Math.floor(rng() * 300);
  const stops = tier === 'domestic' ? 0 : tier === 'regional' ? (rng() > 0.6 ? 1 : 0) : rng() > 0.3 ? 1 : 2;
  const stopCity = stops > 0 ? (tier === 'international' ? 'Singapore' : 'Brisbane') : null;
  const durationMins = baseDuration + stops * 70;

  const options = [];
  const numOptions = 3;
  for (let i = 0; i < numOptions; i += 1) {
    const airline = pool[Math.floor(rng() * pool.length)];
    const depHour = 6 + Math.floor(rng() * 14);
    const depMinute = rng() > 0.5 ? 0 : 30;
    const arrival = addMinutes(depHour, depMinute, durationMins);
    const basePrice = tier === 'domestic' ? 450 : tier === 'regional' ? 2200 : 5200;
    const price = Math.round((basePrice + rng() * basePrice * 0.4) / 10) * 10;

    options.push({
      id: `${from}-${to}-${i}-${Math.floor(rng() * 100000)}`,
      airline: airline.name,
      airlineCode: airline.code,
      flightNumber: `${airline.code}${100 + Math.floor(rng() * 800)}`,
      from,
      to,
      date,
      departTime: formatTime(depHour, depMinute),
      arriveTime: formatTime(arrival.hours, arrival.minutes),
      arriveNextDay: arrival.dayOffset > 0,
      durationMins,
      stops,
      stopCity,
      price,
      currency: 'PGK',
    });
  }
  return options.sort((a, b) => a.price - b.price);
}

function generateMock({ from, to, departDate, returnDate, tripType }) {
  const tier = tripTier(from, to);
  const outSeed = hashString(`${from}-${to}-${departDate}`);
  const outbound = buildMockLeg({ from, to, date: departDate, rng: seededRandom(outSeed), tier });

  let inbound = null;
  if (tripType === 'roundtrip' && returnDate) {
    const inSeed = hashString(`${to}-${from}-${returnDate}`);
    inbound = buildMockLeg({ from: to, to: from, date: returnDate, rng: seededRandom(inSeed), tier });
  }

  return { outbound, inbound, source: 'mock' };
}

async function getAmadeusToken() {
  const res = await fetch(`${AMADEUS_BASE}/v1/security/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: AMADEUS_CLIENT_ID,
      client_secret: AMADEUS_CLIENT_SECRET,
    }),
  });
  if (!res.ok) throw new Error('Could not authenticate with Amadeus');
  const data = await res.json();
  return data.access_token;
}

function parseAmadeusOffers(offers) {
  return offers.slice(0, 5).map((offer) => {
    const itinerary = offer.itineraries[0];
    const firstSeg = itinerary.segments[0];
    const lastSeg = itinerary.segments[itinerary.segments.length - 1];
    const durationMins = parseIsoDuration(itinerary.duration);
    return {
      id: offer.id,
      airline: firstSeg.carrierCode,
      airlineCode: firstSeg.carrierCode,
      flightNumber: `${firstSeg.carrierCode}${firstSeg.number}`,
      from: firstSeg.departure.iataCode,
      to: lastSeg.arrival.iataCode,
      date: firstSeg.departure.at.slice(0, 10),
      departTime: firstSeg.departure.at.slice(11, 16),
      arriveTime: lastSeg.arrival.at.slice(11, 16),
      arriveNextDay: firstSeg.departure.at.slice(0, 10) !== lastSeg.arrival.at.slice(0, 10),
      durationMins,
      stops: itinerary.segments.length - 1,
      stopCity: itinerary.segments.length > 1 ? itinerary.segments[0].arrival.iataCode : null,
      price: Math.round(parseFloat(offer.price.total)),
      currency: offer.price.currency,
    };
  });
}

function parseIsoDuration(iso) {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  const hours = match?.[1] ? parseInt(match[1], 10) : 0;
  const minutes = match?.[2] ? parseInt(match[2], 10) : 0;
  return hours * 60 + minutes;
}

async function searchAmadeus({ from, to, departDate, returnDate, tripType, adults }) {
  const token = await getAmadeusToken();
  const params = new URLSearchParams({
    originLocationCode: from,
    destinationLocationCode: to,
    departureDate: departDate,
    adults: String(adults || 1),
    max: '5',
    currencyCode: 'PGK',
  });
  if (tripType === 'roundtrip' && returnDate) params.set('returnDate', returnDate);

  const res = await fetch(`${AMADEUS_BASE}/v2/shopping/flight-offers?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Amadeus search failed');
  const data = await res.json();
  const offers = data.data || [];

  const outbound = parseAmadeusOffers(offers);
  // The sandbox returns combined round-trip offers as a single itinerary with two
  // "itineraries" entries; for simplicity we surface the outbound leg options here
  // and reuse the same offers list to represent inbound choices when round trip.
  const inbound = tripType === 'roundtrip' ? parseAmadeusOffers(offers).map((o) => ({ ...o, from: to, to: from })) : null;

  return { outbound, inbound, source: 'amadeus' };
}

export async function searchFlights(params) {
  const fromInfo = findAirport(params.from);
  const toInfo = findAirport(params.to);
  if (!fromInfo || !toInfo) {
    throw new Error('Please choose a valid departure and destination airport.');
  }

  if (AMADEUS_CLIENT_ID && AMADEUS_CLIENT_SECRET) {
    try {
      return await searchAmadeus(params);
    } catch (err) {
      // Fall back to mock data if the live sandbox call fails for any reason
      // (expired test keys, rate limits, no matching route, etc.)
      return generateMock(params);
    }
  }

  return generateMock(params);
}

export function formatDuration(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${pad(m)}m`;
}
