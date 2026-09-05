import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Radar, Loader2, AlertTriangle, Plus, X } from 'lucide-react';
import AirportInput from '../components/AirportInput';
import { fetchLivePacificTraffic } from '../services/flightStatus';

function todayPlus(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

let legIdCounter = 0;
function makeLeg(overrides = {}) {
  legIdCounter += 1;
  return { id: legIdCounter, from: '', to: '', date: todayPlus(14), ...overrides };
}

export default function Flights() {
  const navigate = useNavigate();

  const [tripType, setTripType] = useState('oneway');

  // One way / round trip fields
  const [from, setFrom] = useState('POM');
  const [to, setTo] = useState('DEL');
  const [departDate, setDepartDate] = useState(todayPlus(14));
  const [returnDate, setReturnDate] = useState(todayPlus(21));

  // Multi-city fields
  const [legs, setLegs] = useState([
    makeLeg({ from: 'POM', to: 'DEL' }),
    makeLeg({ from: 'DEL', to: 'POM', date: todayPlus(21) }),
  ]);

  const [adults, setAdults] = useState(1);
  const [cabinClass, setCabinClass] = useState('Economy');

  const [error, setError] = useState('');

  const [traffic, setTraffic] = useState(null);
  const [trafficError, setTrafficError] = useState('');
  const [trafficLoading, setTrafficLoading] = useState(true);

  useEffect(() => {
    fetchLivePacificTraffic()
      .then(setTraffic)
      .catch(() => setTrafficError('Live flight data is unavailable right now.'))
      .finally(() => setTrafficLoading(false));
  }, []);

  const addLeg = () => {
    const last = legs[legs.length - 1];
    setLegs([...legs, makeLeg({ from: last?.to || '', date: todayPlus(14) })]);
  };

  const removeLeg = (id) => {
    if (legs.length <= 2) return;
    setLegs(legs.filter((l) => l.id !== id));
  };

  const updateLeg = (id, field, value) => {
    setLegs(legs.map((l) => (l.id === id ? { ...l, [field]: value } : l)));
  };

  const handleGetQuote = (e) => {
    e.preventDefault();
    setError('');

    if (tripType === 'multicity') {
      for (const leg of legs) {
        if (!leg.from || !leg.to) {
          setError('Please select a from and to airport for every flight.');
          return;
        }
        if (leg.from === leg.to) {
          setError('Departure and destination cannot be the same airport.');
          return;
        }
      }
    } else {
      if (!from || !to) {
        setError('Please select a from and to airport.');
        return;
      }
      if (from === to) {
        setError('Departure and destination cannot be the same airport.');
        return;
      }
    }

    const summaryLines = [
      `Trip type: ${tripType === 'roundtrip' ? 'Round trip' : tripType === 'multicity' ? 'Multi-city' : 'One way'}`,
      `Passengers: ${adults}, Cabin: ${cabinClass}`,
    ];

    if (tripType === 'multicity') {
      legs.forEach((leg, i) => {
        summaryLines.push(`Flight ${i + 1}: ${leg.from} → ${leg.to} on ${leg.date}`);
      });
    } else {
      summaryLines.push(`Depart: ${from} → ${to} on ${departDate}`);
      if (tripType === 'roundtrip') {
        summaryLines.push(`Return: ${to} → ${from} on ${returnDate}`);
      }
    }

    navigate('/contact', { state: { prefillMessage: summaryLines.join('\n') } });
  };

  return (
    <div>
      <section className="max-w-6xl mx-auto px-6 sm:px-8 pt-16 pb-10">
        <h1 className="font-serif text-3xl sm:text-4xl text-ocean max-w-2xl">Plan your flight</h1>
        <p className="mt-4 text-muted max-w-2xl leading-relaxed">
          Select your airports and travel dates, then request a quote — our team will follow up with fares
          and booking steps.
        </p>
      </section>

      {/* Quote request form */}
      <section className="max-w-6xl mx-auto px-6 sm:px-8">
        <form onSubmit={handleGetQuote} className="border border-line p-6 sm:p-8">
          <div className="flex items-center gap-6 mb-6 text-sm">
            {['oneway', 'roundtrip', 'multicity'].map((t) => (
              <label key={t} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="tripType"
                  checked={tripType === t}
                  onChange={() => setTripType(t)}
                  className="accent-ocean"
                />
                {t === 'oneway' ? 'One way' : t === 'roundtrip' ? 'Round trip' : 'Multi-city'}
              </label>
            ))}
          </div>

          {tripType === 'multicity' ? (
            <div className="space-y-4">
              {legs.map((leg, i) => (
                <div key={leg.id} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 items-end">
                  <AirportInput
                    label={`Flight ${i + 1} — From`}
                    value={leg.from}
                    onChange={(v) => updateLeg(leg.id, 'from', v)}
                    excludeCode={leg.to}
                  />
                  <AirportInput
                    label="To"
                    value={leg.to}
                    onChange={(v) => updateLeg(leg.id, 'to', v)}
                    excludeCode={leg.from}
                  />
                  <label className="text-sm text-[#33454C]">
                    Date
                    <input
                      type="date"
                      required
                      min={todayPlus(0)}
                      value={leg.date}
                      onChange={(e) => updateLeg(leg.id, 'date', e.target.value)}
                      className="mt-1.5 w-full border border-line px-3 py-2.5 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ocean"
                    />
                  </label>
                  <div className="flex items-center h-full">
                    {legs.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeLeg(leg.id)}
                        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-red-700 transition-colors py-2.5"
                      >
                        <X size={15} /> Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addLeg}
                className="inline-flex items-center gap-2 text-sm text-ocean hover:text-ocean-deep transition-colors font-medium"
              >
                <Plus size={15} /> Add another flight
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <AirportInput label="From" value={from} onChange={setFrom} excludeCode={to} />
              <AirportInput label="To" value={to} onChange={setTo} excludeCode={from} />

              <label className="text-sm text-[#33454C]">
                Depart
                <input
                  type="date"
                  required
                  min={todayPlus(0)}
                  value={departDate}
                  onChange={(e) => setDepartDate(e.target.value)}
                  className="mt-1.5 w-full border border-line px-3 py-2.5 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ocean"
                />
              </label>

              {tripType === 'roundtrip' ? (
                <label className="text-sm text-[#33454C]">
                  Return
                  <input
                    type="date"
                    required
                    min={departDate}
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="mt-1.5 w-full border border-line px-3 py-2.5 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ocean"
                  />
                </label>
              ) : (
                <div className="hidden lg:block" aria-hidden="true" />
              )}
            </div>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-5">
            <label className="text-sm text-[#33454C]">
              Passengers
              <input
                type="number"
                min={1}
                max={9}
                value={adults}
                onChange={(e) => setAdults(Number(e.target.value))}
                className="mt-1.5 w-full border border-line px-3 py-2.5 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ocean"
              />
            </label>

            <label className="text-sm text-[#33454C]">
              Cabin class
              <select
                value={cabinClass}
                onChange={(e) => setCabinClass(e.target.value)}
                className="mt-1.5 w-full border border-line px-3 py-2.5 text-sm bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-ocean"
              >
                <option>Economy</option>
                <option>Premium Economy</option>
                <option>Business</option>
                <option>First</option>
              </select>
            </label>

            <div className="sm:col-span-2 lg:col-span-2 flex items-end">
              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gold text-white px-8 py-3 text-sm font-medium hover:bg-gold-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gold"
              >
                <Send size={16} />
                Get Quote
              </button>
            </div>
          </div>

          {error && (
            <p className="mt-4 text-sm text-red-700 flex items-center gap-2">
              <AlertTriangle size={15} /> {error}
            </p>
          )}
        </form>
      </section>

      {/* Live traffic widget */}
      <section className="bg-ocean-deep text-white">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-16">
          <div className="flex items-center gap-3 mb-2">
            <Radar size={20} className="text-gold-light" />
            <h2 className="font-serif text-2xl">Live air traffic over the Pacific</h2>
          </div>
          <p className="text-sm text-[#BFD6DC] max-w-xl mb-8">
            A real, live feed from the OpenSky Network showing aircraft currently broadcasting a position over
            Papua New Guinea and the surrounding region — a snapshot of the skies you'll be flying through.
          </p>

          {trafficLoading && <p className="text-sm text-faint flex items-center gap-2"><Loader2 size={14} className="animate-spin" /> Checking live positions…</p>}
          {trafficError && <p className="text-sm text-faint">{trafficError}</p>}

          {traffic && traffic.length > 0 && (
            <div className="border border-white/15">
              <div className="px-5 py-3 border-b border-white/15 flex items-center justify-between text-xs text-faint">
                <span>Callsign</span>
                <span>Origin country</span>
                <span className="hidden sm:inline">Altitude</span>
              </div>
              {traffic.map((t) => (
                <div key={t.callsign} className="px-5 py-3 border-b border-white/10 last:border-none flex items-center justify-between text-sm">
                  <span className="text-[#E7EEF0]">{t.callsign}</span>
                  <span className="text-faint">{t.originCountry}</span>
                  <span className="hidden sm:inline text-faint">
                    {t.onGround ? 'On ground' : t.altitudeM ? `${Math.round(t.altitudeM).toLocaleString()} m` : '—'}
                  </span>
                </div>
              ))}
            </div>
          )}

          {traffic && traffic.length === 0 && !trafficError && (
            <p className="text-sm text-faint">No aircraft are currently reporting a position in this region.</p>
          )}
        </div>
      </section>
    </div>
  );
}