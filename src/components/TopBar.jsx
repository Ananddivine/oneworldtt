import React from 'react';
import { Phone, Mail } from 'lucide-react';
import { COMPANY } from '../data/content';

export default function TopBar() {
  return (
    <div className="hidden sm:flex justify-end items-center gap-6 bg-ocean-deep text-faint text-xs px-8 py-2">
      {COMPANY.phones.map((phone) => (
        <a
          key={phone}
          href={`tel:${phone.replace(/\s+/g, '')}`}
          className="flex items-center gap-1.5 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded-sm"
        >
          <Phone size={13} /> {phone}
        </a>
      ))}
      <a
        href={`mailto:${COMPANY.email}`}
        className="flex items-center gap-1.5 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded-sm"
      >
        <Mail size={13} /> {COMPANY.email}
      </a>
    </div>
  );
}
