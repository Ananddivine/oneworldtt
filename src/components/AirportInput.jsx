import React, { useEffect, useMemo, useState } from 'react';
import {
  REGION_LABELS,
  POPULAR_CODES,
  findAirport,
  loadAirports,
  searchAirports,
} from '../data/airports';

function groupByRegion(list) {
  const groups = [];
  const byRegion = new Map();

  for (const airport of list) {
    const region = airport.region || 'other';

    if (!byRegion.has(region)) {
      const group = { region, items: [] };
      byRegion.set(region, group);
      groups.push(group);
    }

    byRegion.get(region).items.push(airport);
  }

  return groups;
}

function popularAirports(excludeCode) {
  return POPULAR_CODES
    .map((code) => findAirport(code))
    .filter((airport) => airport && airport.code !== excludeCode);
}

export default function AirportInput({
  label,
  value,
  onChange,
  excludeCode,
}) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [airportsReady, setAirportsReady] = useState(false);

  const selected = useMemo(() => findAirport(value), [value]);

  useEffect(() => {
    let cancelled = false;

    loadAirports()
      .finally(() => {
        if (!cancelled) setAirportsReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const matches = useMemo(() => {
    const q = query.trim();

    if (!q) {
      return popularAirports(excludeCode);
    }

    return searchAirports(q, {
      excludeCode,
      limit: 16,
    });
  }, [query, excludeCode, airportsReady]);

  const groups = useMemo(() => groupByRegion(matches), [matches]);

  const showGroupLabels = groups.length > 1;

  const handleSelect = (airport) => {
    onChange(airport.code);
    setQuery('');
    setOpen(false);
  };

  return (
    <div className="relative">
      <label className="text-sm text-[#33454C]">
        {label}

        <input
          value={
            open
              ? query
              : selected
                ? `${selected.city} (${selected.code})`
                : ''
          }
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => {
            setQuery('');
            setOpen(true);
          }}
          onBlur={() => {
            // Allow mouse/touch selection before closing.
            setTimeout(() => setOpen(false), 150);
          }}
          placeholder="City, country, or airport code"
          autoComplete="off"
          className="mt-1.5 w-full border border-line px-3 py-2.5 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ocean"
          aria-label={label}
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
        />
      </label>

      {open && (
        <ul
          className="absolute z-20 mt-1 w-full bg-white border border-line shadow-sm max-h-80 overflow-auto"
          role="listbox"
        >
          {!query.trim() && (
            <li className="px-3 py-1.5 text-[11px] uppercase tracking-wide text-faint bg-mist/60 sticky top-0">
              Popular airports
            </li>
          )}

          {!airportsReady && (
            <li className="px-3 py-2 text-sm text-faint">
              Loading worldwide airports…
            </li>
          )}

          {groups.map((group) => (
            <React.Fragment key={group.region}>
              {showGroupLabels && (
                <li className="px-3 py-1.5 text-[11px] uppercase tracking-wide text-faint bg-mist/60 sticky top-0">
                  {REGION_LABELS[group.region] || 'Other destinations'}
                </li>
              )}

              {group.items.map((airport) => (
                <li key={airport.code} role="option">
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSelect(airport);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-mist flex items-center justify-between gap-4"
                  >
                    <span className="min-w-0">
                      <span className="block text-sm truncate">
                        {airport.city}, {airport.country}
                      </span>

                      {airport.name &&
                        airport.name.toLowerCase() !==
                          airport.city.toLowerCase() && (
                          <span className="block text-xs text-faint truncate mt-0.5">
                            {airport.name}
                          </span>
                        )}
                    </span>

                    <span className="shrink-0 text-faint font-medium">
                      {airport.code}
                    </span>
                  </button>
                </li>
              ))}
            </React.Fragment>
          ))}

          {airportsReady && matches.length === 0 && (
            <li className="px-3 py-2 text-sm text-faint">
              No airports match "{query}"
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
