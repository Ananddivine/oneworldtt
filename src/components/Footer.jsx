import React from 'react';
import { Link } from 'react-router-dom';
import { COMPANY, NAV_LINKS } from '../data/content';

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <p className="font-serif text-lg text-ocean">{COMPANY.name}</p>
          <p className="text-xs text-faint mt-1">Port Moresby, Papua New Guinea</p>
        </div>
        <nav className="flex flex-wrap gap-6 text-sm text-muted">
          {NAV_LINKS.map((n) => (
            <Link key={n.to} to={n.to} className="hover:text-ocean transition-colors">
              {n.label}
            </Link>
          ))}
        </nav>
        <p className="text-xs text-faint">© {new Date().getFullYear()} {COMPANY.name}</p>
      </div>
    </footer>
  );
}
