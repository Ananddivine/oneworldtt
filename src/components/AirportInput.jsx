import React, { useMemo, useState } from 'react';
import AIRPORTS from '../data/airports';

export default function AirportInput({ label, value, onChange, excludeCode }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  const selected = AIRPORTS.find((a) => a.code === value);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    return AIRPORTS.filter((a) => a.code !== excludeCode)
      .filter(
        (a) =>
          !q ||
          a.code.toLowerCase().includes(q) ||
          a.city.toLowerCase().includes(q) ||
          a.country.toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [query, excludeCode]);

  return (
    <div className="relative">
      <label className="text-sm text-[#33454C]">
        {label}
        <input
          value={open ? query : selected ? `${selected.city} (${selected.code})` : ''}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => {
            setQuery('');
            setOpen(true);
          }}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
          placeholder="City or airport code"
          className="mt-1.5 w-full border border-line px-3 py-2.5 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ocean"
        />
      </label>

      {open && matches.length > 0 && (
        <ul className="absolute z-20 mt-1 w-full bg-white border border-line shadow-sm max-h-56 overflow-auto">
          {matches.map((a) => (
            <li key={a.code}>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  onChange(a.code);
                  setQuery('');
                  setOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-mist flex items-center justify-between"
              >
                <span>
                  {a.city}, {a.country}
                </span>
                <span className="text-faint">{a.code}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
