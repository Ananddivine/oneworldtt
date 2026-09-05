import React from 'react';
import { Plane } from 'lucide-react';
import { formatDuration } from '../services/flightSearch';

export default function ItineraryCard({ flight, selected, onSelect }) {
  return (
    <div
      className={`border px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-colors ${
        selected ? 'border-ocean bg-mist' : 'border-line'
      }`}
    >
      <div className="flex items-center gap-4">
        <Plane size={18} className="text-gold shrink-0" />
        <div>
          <p className="text-sm font-medium text-ink">
            {flight.airline} · {flight.flightNumber}
          </p>
          <p className="text-xs text-faint mt-0.5">
            {flight.stops === 0 ? 'Nonstop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}${flight.stopCity ? ` · ${flight.stopCity}` : ''}`}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6 text-sm">
        <div className="text-center">
          <p className="font-medium text-ink">{flight.departTime}</p>
          <p className="text-xs text-faint">{flight.from}</p>
        </div>
        <div className="text-center text-xs text-faint">
          <p>{formatDuration(flight.durationMins)}</p>
          <div className="w-16 h-px bg-line my-1" />
        </div>
        <div className="text-center">
          <p className="font-medium text-ink">
            {flight.arriveTime}
            {flight.arriveNextDay && <span className="text-gold">+1</span>}
          </p>
          <p className="text-xs text-faint">{flight.to}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 sm:justify-end">
        <button
          type="button"
          onClick={onSelect}
          className={`text-sm font-medium px-4 py-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ocean ${
            selected ? 'bg-ocean text-white' : 'border border-ocean text-ocean hover:bg-ocean hover:text-white'
          }`}
        >
          {selected ? 'Selected' : 'Select'}
        </button>
      </div>
    </div>
  );
}
