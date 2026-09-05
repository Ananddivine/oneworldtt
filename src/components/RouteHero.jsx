import React, { useEffect, useState } from 'react';
import { Plane } from 'lucide-react';

const STYLES = `
  @keyframes spinGlobe { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes flowDash { to { stroke-dashoffset: -120; } }
  .globe-spin { transform-origin: 150px 150px; animation: spinGlobe 24s linear infinite; }
  .flow-line { animation: flowDash 3.5s linear infinite; }
  .flow-line-slow { animation-duration: 6.5s; animation-direction: reverse; }
  @media (prefers-reduced-motion: reduce) {
    .globe-spin, .flow-line, .flow-line-slow { animation: none; }
  }
`;

export default function RouteHero() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <div className="relative w-full max-w-md mx-auto">
      <style>{STYLES}</style>
      <svg
        viewBox="0 0 300 300"
        className="w-full h-auto"
        role="img"
        aria-label="Rotating globe with an animated flight route between Port Moresby and India"
      >
        {/* Outer globe frame */}
        <circle cx="150" cy="150" r="110" fill="none" stroke="#C7D8DC" strokeWidth="1.5" />

        {/* Rotating meridians simulate a spinning globe */}
        <g className="globe-spin">
          <ellipse cx="150" cy="150" rx="110" ry="110" fill="none" stroke="#DCE7E9" strokeWidth="1" />
          <ellipse cx="150" cy="150" rx="72" ry="110" fill="none" stroke="#DCE7E9" strokeWidth="1" />
          <ellipse cx="150" cy="150" rx="34" ry="110" fill="none" stroke="#DCE7E9" strokeWidth="1" />
        </g>

        {/* Static latitude lines */}
        <ellipse cx="150" cy="105" rx="97" ry="24" fill="none" stroke="#DCE7E9" strokeWidth="1" />
        <ellipse cx="150" cy="150" rx="110" ry="34" fill="none" stroke="#DCE7E9" strokeWidth="1" />
        <ellipse cx="150" cy="195" rx="97" ry="24" fill="none" stroke="#DCE7E9" strokeWidth="1" />

        {/* Flight route arcs */}
        <path
          id="route-pom-india"
          d="M 88 198 C 120 90, 195 235, 214 96"
          fill="none"
          stroke="#C68A3D"
          strokeWidth="1.5"
          strokeDasharray="5 7"
          className="flow-line"
        />
        <path
          d="M 55 145 C 150 30, 205 270, 248 150"
          fill="none"
          stroke="#9BB6BE"
          strokeWidth="1"
          strokeDasharray="3 6"
          opacity="0.5"
          className="flow-line flow-line-slow"
        />

        {/* Airports */}
        <circle cx="88" cy="198" r="4.5" fill="#0D3B4F" />
        <text x="88" y="219" textAnchor="middle" fontSize="12" fill="#33454C" fontFamily="Inter">POM</text>

        <circle cx="214" cy="96" r="4.5" fill="#C68A3D" />
        <text x="214" y="80" textAnchor="middle" fontSize="12" fill="#33454C" fontFamily="Inter">IND</text>

        {/* Plane travelling the route */}
        {!reducedMotion && (
          <g>
            <Plane size={16} color="#0D3B4F" strokeWidth={2} />
            <animateMotion dur="4.5s" repeatCount="indefinite" rotate="auto">
              <mpath href="#route-pom-india" />
            </animateMotion>
          </g>
        )}
      </svg>
    </div>
  );
}
