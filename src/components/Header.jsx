import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { NAV_LINKS } from '../data/content';

export default function Header() {
  const [navOpen, setNavOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `hover:text-ocean transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ocean rounded-sm ${
      isActive ? 'text-ocean' : 'text-[#33454C]'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-line">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 flex items-center justify-between h-20">
        <NavLink to="/" className="flex items-baseline gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-ocean rounded-sm">
          <span className="font-serif text-2xl text-ocean">One World</span>
          <span className="text-xs text-faint hidden sm:inline">Tours &amp; Travel</span>
        </NavLink>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {NAV_LINKS.map((n) => (
            <NavLink key={n.to} to={n.to} className={linkClass} end={n.to === '/'}>
              {n.label}
            </NavLink>
          ))}
        </nav>

        <NavLink
          to="/contact"
          className="hidden md:inline-flex items-center gap-1 bg-gold text-white text-sm font-medium px-5 py-2.5 rounded-sm hover:bg-gold-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gold"
        >
          Get a quote
        </NavLink>

        <button
          onClick={() => setNavOpen((v) => !v)}
          aria-label="Toggle navigation"
          className="md:hidden text-ocean focus:outline-none focus-visible:ring-2 focus-visible:ring-ocean rounded-sm p-1"
        >
          {navOpen ? <X /> : <Menu />}
        </button>
      </div>

      {navOpen && (
        <div className="md:hidden border-t border-line px-6 py-4 flex flex-col gap-4 text-[#33454C]">
          {NAV_LINKS.map((n) => (
            <NavLink key={n.to} to={n.to} onClick={() => setNavOpen(false)} end={n.to === '/'}>
              {n.label}
            </NavLink>
          ))}
          <NavLink to="/contact" onClick={() => setNavOpen(false)} className="text-gold font-medium">
            Get a quote
          </NavLink>
        </div>
      )}
    </header>
  );
}
