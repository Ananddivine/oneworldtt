// OpenSky Network (https://opensky-network.org) publishes anonymised, real-time
// aircraft position data for free with no API key required, subject to fair-use
// rate limits. We use it to show genuine live air traffic over the PNG / SW
// Pacific region as a "flight status" style feature — it is not tied to any
// specific passenger flight, since that level of detail sits behind paid APIs.

const PNG_REGION_BBOX = { lamin: -12, lomin: 138, lamax: 0, lomax: 158 };

export async function fetchLivePacificTraffic() {
  const { lamin, lomin, lamax, lomax } = PNG_REGION_BBOX;
  const url = `https://opensky-network.org/api/states/all?lamin=${lamin}&lomin=${lomin}&lamax=${lamax}&lomax=${lomax}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('Live flight data is unavailable right now.');
  const data = await res.json();
  const states = data.states || [];

  return states
    .filter((s) => s[1]) // has a callsign
    .slice(0, 8)
    .map((s) => ({
      callsign: s[1].trim(),
      originCountry: s[2],
      altitudeM: s[7],
      velocityMs: s[9],
      onGround: s[8],
    }));
}
