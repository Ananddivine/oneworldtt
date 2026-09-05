import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Radar, Loader2, AlertTriangle } from 'lucide-react';
import AirportInput from '../components/AirportInput';
import ItineraryCard from '../components/ItineraryCard';
import { searchFlights } from '../services/flightSearch';
import { fetchLivePacificTraffic } from '../services/flightStatus';

function todayPlus(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export default function Flights() {
  const navigate = useNavigate();

  const [tripType, setTripType] = useState('oneway');
  const [from, setFrom] = useState('POM');
  const [to, setTo] = useState('DEL');
  const [departDate, setDepartDate] = useState(todayPlus(14));
  const [returnDate, setReturnDate] = useState(todayPlus(21));
  const [adults, setAdults] = useState(1);
  const [cabinClass, setCabinClass] = useState('Economy');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState(null);
  const [selectedOutbound, setSelectedOutbound] = useState(null);
  const [selectedInbound, setSelectedInbound] = useState(null);

  const [traffic, setTraffic] = useState(null);
  const [trafficError, setTrafficError] = useState('');
  const [trafficLoading, setTrafficLoading] = useState(true);

  useEffect(() => {
    fetchLivePacificTraffic()
      .then(setTraffic)
      .catch(() => setTrafficError('Live flight data is unavailable right now.'))
      .finally(() => setTrafficLoading(false));
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setResults(null);
    setSelectedOutbound(null);
    setSelectedInbound(null);

    if (from === to) {
      setError('Departure and destination cannot be the same airport.');
      return;
    }

    setLoading(true);
    try {
      const data = await searchFlights({ from, to, departDate, returnDate, tripType, adults, cabinClass });
      setResults(data);
    } catch (err) {
      setError(err.message || 'Something went wrong while searching. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const canSendItinerary = selectedOutbound && (tripType === 'oneway' || selectedInbound);

  const handleSendItinerary = () => {
    const summaryLines = [
      `Trip type: ${tripType === 'roundtrip' ? 'Round trip' : 'One way'}`,
      `Passengers: ${adults}, Cabin: ${cabinClass}`,
      `Outbound: ${selectedOutbound.from} → ${selectedOutbound.to} on ${selectedOutbound.date}, ${selectedOutbound.airline} ${selectedOutbound.flightNumber}, ${selectedOutbound.departTime}–${selectedOutbound.arriveTime}`,
    ];
    if (selectedInbound) {
      summaryLines.push(
        `Return: ${selectedInbound.from} → ${selectedInbound.to} on ${selectedInbound.date}, ${selectedInbound.airline} ${selectedInbound.flightNumber}, ${selectedInbound.departTime}–${selectedInbound.arriveTime}`
      );
    }
    navigate('/contact', { state: { prefillMessage: summaryLines.join('\n') } });
  };

  return (
    <div>
      <section className="max-w-6xl mx-auto px-6 sm:px-8 pt-16 pb-10">
        <h1 className="font-serif text-3xl sm:text-4xl text-ocean max-w-2xl">Plan your flight</h1>
        <p className="mt-4 text-muted max-w-2xl leading-relaxed">
          Compare dates and times and put together an itinerary. This is a planning tool, not a live booking —
          once you've picked flights you like, send them to our team and we'll confirm the fare and issue your
          ticket.
        </p>
      </section>

      {/* Search form */}
      <section className="max-w-6xl mx-auto px-6 sm:px-8">
        <form onSubmit={handleSearch} className="border border-line p-6 sm:p-8">
          <div className="flex items-center gap-6 mb-6 text-sm">
            {['oneway', 'roundtrip'].map((t) => (
              <label key={t} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="tripType"
                  checked={tripType === t}
                  onChange={() => setTripType(t)}
                  className="accent-ocean"
                />
                {t === 'oneway' ? 'One way' : 'Round trip'}
              </label>
            ))}
          </div>

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
                disabled={loading}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-ocean text-white px-8 py-3 text-sm font-medium hover:bg-ocean-deep transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ocean disabled:opacity-60"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                {loading ? 'Searching…' : 'Search flights'}
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

      {/* Results */}
      {results && (
        <section className="max-w-6xl mx-auto px-6 sm:px-8 py-14">
          <div className="mb-3 flex items-center justify-between flex-wrap gap-2">
            <h2 className="font-serif text-2xl text-ocean">Outbound — {results.outbound[0]?.from} to {results.outbound[0]?.to}</h2>
            {results.source === 'mock' && (
              <span className="text-xs text-faint">Estimated schedule for planning purposes</span>
            )}
          </div>
          <div className="space-y-3">
            {results.outbound.map((f) => (
              <ItineraryCard key={f.id} flight={f} selected={selectedOutbound?.id === f.id} onSelect={() => setSelectedOutbound(f)} />
            ))}
          </div>

          {results.inbound && (
            <>
              <h2 className="font-serif text-2xl text-ocean mt-12 mb-3">
                Return — {results.inbound[0]?.from} to {results.inbound[0]?.to}
              </h2>
              <div className="space-y-3">
                {results.inbound.map((f) => (
                  <ItineraryCard key={f.id} flight={f} selected={selectedInbound?.id === f.id} onSelect={() => setSelectedInbound(f)} />
                ))}
              </div>
            </>
          )}

          {canSendItinerary && (
            <div className="mt-10 border border-ocean bg-mist p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
              <div>
                <p className="font-medium text-ocean">Your itinerary is ready</p>
                <p className="text-sm text-muted mt-1">
                  Send these flight details to our team and we'll follow up with a confirmed fare and booking steps.
                </p>
              </div>
              <button
                onClick={handleSendItinerary}
                className="shrink-0 inline-flex items-center gap-2 bg-gold text-white px-6 py-3 text-sm font-medium hover:bg-gold-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gold"
              >
                Send itinerary to our team
              </button>
            </div>
          )}
        </section>
      )}

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
