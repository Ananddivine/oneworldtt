import React, { useEffect, useMemo, useState } from 'react';
import { Plane } from 'lucide-react';

const ROTATION_DURATION = '30s';

const STYLES = `
  @keyframes meridianSweep {
    0%   { transform: scaleX(1); }
    25%  { transform: scaleX(0); }
    50%  { transform: scaleX(-1); }
    75%  { transform: scaleX(0); }
    100% { transform: scaleX(1); }
  }

  .meridian { transform-box: fill-box; transform-origin: center; animation: meridianSweep 22s linear infinite; }
  .meridian-2 { animation-delay: -7.3s; }
  .meridian-3 { animation-delay: -14.6s; }

  @media (prefers-reduced-motion: reduce) {
    .meridian { animation: none; }
  }
`;

const CENTER = { x: 150, y: 150 };
const GLOBE_R = 110;

// Home base: Port Moresby, Jacksons International Airport
const HOME = { x: 81, y: 233, country: 'Papua New Guinea', code: 'POM' };

// Destinations One World books flights to. Positions are stylised points
// spread around the globe face (not literal geography), described as an
// angle (degrees, 0 = right, increasing clockwise) and a radius inside
// GLOBE_R. To add another country/airport, just add one line here —
// paths, colors, timing, and labels are all generated from this list.
const DESTINATION_DEFS = [
  { country: 'Australia', code: 'BNE', angle: 170, radius: 100, accent: 'cool' },
  { country: 'UAE', code: 'DXB', angle: 205, radius: 88, accent: 'warm' },
  { country: 'United Kingdom', code: 'LHR', angle: 240, radius: 95, accent: 'cool' },
  { country: 'USA', code: 'LAX', angle: 275, radius: 100, accent: 'warm' },
  { country: 'Japan', code: 'NRT', angle: 310, radius: 90, accent: 'cool' },
  { country: 'South Korea', code: 'ICN', angle: 345, radius: 95, accent: 'warm' },
  { country: 'Singapore', code: 'SIN', angle: 20, radius: 88, accent: 'cool' },
  { country: 'Philippines', code: 'MNL', angle: 55, radius: 100, accent: 'warm' },
  { country: 'India', code: 'DEL', angle: 90, radius: 92, accent: 'highlight' },
];

const ACCENT_COLORS = {
  cool: '#9BB6BE',
  warm: '#C68A3D',
  highlight: '#B5482A',
};

function toXY(angleDeg, radius) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: CENTER.x + radius * Math.cos(rad),
    y: CENTER.y + radius * Math.sin(rad),
  };
}

// Quadratic-bezier "flight arc" from home to a destination, bulging
// outward from the globe's centre so routes read as curved great-circle
// paths rather than straight chords. Because this whole layer rotates
// together as one rigid group, the arc's own math never needs to change.
function arcPath(from, to, bow = 26) {
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2;
  const outX = mx - CENTER.x;
  const outY = my - CENTER.y;
  const outLen = Math.hypot(outX, outY) || 1;
  const cx = mx + (outX / outLen) * bow;
  const cy = my + (outY / outLen) * bow;
  return `M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}`;
}

// A label: country name + airport code, always drawn upright and
// centred just below its point — regardless of where that point has
// spun to, since a counter-rotation cancels the parent group's spin.
function PointLabel({ x, y, title, code, spinning }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g>
        {spinning && (
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 0 0"
            to="-360 0 0"
            dur={ROTATION_DURATION}
            repeatCount="indefinite"
          />
        )}
        <text x="0" y="16" textAnchor="middle" fontSize="10.5" fontWeight="600" fill="#33454C" fontFamily="Inter">
          {title}
        </text>
        <text x="0" y="27" textAnchor="middle" fontSize="8.5" fontWeight="500" fill="#7A8D93" fontFamily="Inter">
          {code}
        </text>
      </g>
    </g>
  );
}

export default function RouteHero() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const routes = useMemo(
    () =>
      DESTINATION_DEFS.map((d, i) => {
        const to = toXY(d.angle, d.radius);
        return {
          id: `route-png-${d.code.toLowerCase()}`,
          country: d.country,
          code: d.code,
          to,
          path: arcPath(HOME, to),
          color: ACCENT_COLORS[d.accent],
          highlight: d.accent === 'highlight',
          planeDuration: `${3.4 + (i % 5) * 0.5}s`,
          planeDelay: `-${(i * 1.1).toFixed(1)}s`,
        };
      }),
    []
  );

  return (
    <div className="relative w-full max-w-md mx-auto">
      <style>{STYLES}</style>
      <svg
        viewBox="0 0 300 300"
        className="w-full h-auto"
        role="img"
        aria-label={`Rotating globe with animated flight routes from Papua New Guinea to ${routes
          .map((r) => r.country)
          .join(', ')}`}
      >
        <defs>
          <radialGradient id="globeFill" cx="38%" cy="32%" r="75%">
            <stop offset="0%" stopColor="#F3F8F9" />
            <stop offset="100%" stopColor="#E4EEF0" />
          </radialGradient>
        </defs>

        {/* Globe sphere */}
        <circle cx={CENTER.x} cy={CENTER.y} r={GLOBE_R} fill="url(#globeFill)" stroke="#C7D8DC" strokeWidth="1.5" />

        {/* Rotating meridians give the sphere its spin */}
        <ellipse className="meridian meridian-1" cx={CENTER.x} cy={CENTER.y} rx={GLOBE_R} ry={GLOBE_R} fill="none" stroke="#CBDBDE" strokeWidth="1" />
        <ellipse className="meridian meridian-2" cx={CENTER.x} cy={CENTER.y} rx={GLOBE_R} ry={GLOBE_R} fill="none" stroke="#CBDBDE" strokeWidth="1" />
        <ellipse className="meridian meridian-3" cx={CENTER.x} cy={CENTER.y} rx={GLOBE_R} ry={GLOBE_R} fill="none" stroke="#CBDBDE" strokeWidth="1" />

        {/* Static latitude lines */}
        <ellipse cx={CENTER.x} cy="105" rx="97" ry="24" fill="none" stroke="#DCE7E9" strokeWidth="1" />
        <ellipse cx={CENTER.x} cy={CENTER.y} rx={GLOBE_R} ry="34" fill="none" stroke="#DCE7E9" strokeWidth="1" />
        <ellipse cx={CENTER.x} cy="195" rx="97" ry="24" fill="none" stroke="#DCE7E9" strokeWidth="1" />

        {/* Globe outline redrawn on top so it stays crisp over the meridians */}
        <circle cx={CENTER.x} cy={CENTER.y} r={GLOBE_R} fill="none" stroke="#C7D8DC" strokeWidth="1.5" />

        {/*
          Everything below — routes, markers, and labels — lives in one
          rigid group that spins around the globe's centre together, so
          the whole route map (including the country names) turns with
          the globe instead of sitting on top of it as a static overlay.
        */}
        <g>
          {!reducedMotion && (
            <animateTransform
              attributeName="transform"
              type="rotate"
              from={`0 ${CENTER.x} ${CENTER.y}`}
              to={`360 ${CENTER.x} ${CENTER.y}`}
              dur={ROTATION_DURATION}
              repeatCount="indefinite"
            />
          )}

          {/* Flight routes, home base to each destination country */}
          {routes.map((r) => (
            <path
              key={r.id}
              id={r.id}
              d={r.path}
              fill="none"
              stroke={r.color}
              strokeWidth={r.highlight ? 2 : 1.4}
              strokeDasharray="5 7"
            >
              {!reducedMotion && (
                <animate attributeName="stroke-dashoffset" from="0" to="-120" dur={r.planeDuration} repeatCount="indefinite" />
              )}
            </path>
          ))}

          {/* Home base marker + label */}
          <circle cx={HOME.x} cy={HOME.y} r="5" fill="#0D3B4F" />
          <PointLabel x={HOME.x} y={HOME.y} title={HOME.country} code={HOME.code} spinning={!reducedMotion} />

          {/* Destination markers + labels */}
          {routes.map((r) => (
            <g key={`${r.id}-marker`}>
              <circle cx={r.to.x} cy={r.to.y} r={r.highlight ? 4.5 : 3.6} fill={r.color} />
              <PointLabel x={r.to.x} y={r.to.y} title={r.country} code={r.code} spinning={!reducedMotion} />
            </g>
          ))}

          {/* Planes travelling each route */}
          {!reducedMotion &&
            routes.map((r) => (
              <g key={`${r.id}-plane`}>
                <Plane size={13} color="#0D3B4F" strokeWidth={2} />
                <animateMotion dur={r.planeDuration} begin={r.planeDelay} repeatCount="indefinite" rotate="auto">
                  <mpath href={`#${r.id}`} />
                </animateMotion>
              </g>
            ))}
        </g>
      </svg>
    </div>
  );
}