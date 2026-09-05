import React from 'react';
import { Link } from 'react-router-dom';
import { SPECIALTIES, PROCESS, FAQS } from '../data/content';

export default function MedicalTourism() {
  return (
    <div>
      <section className="max-w-6xl mx-auto px-6 sm:px-8 pt-16 pb-14">
        <h1 className="font-serif text-3xl sm:text-4xl text-ocean max-w-2xl">
          Medical treatment in India, arranged from Port Moresby
        </h1>
        <p className="mt-5 text-muted leading-relaxed max-w-2xl">
          Many treatments are more accessible, faster to schedule, and more affordable in India's leading
          hospitals than they are locally. We coordinate the hospital, the paperwork and the travel, so your
          focus can stay on getting well.
        </p>
      </section>

      <section className="bg-mist">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-16">
          <h2 className="font-serif text-2xl text-ocean mb-10">Specialties we arrange care for</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {SPECIALTIES.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex gap-3 bg-white border border-line p-5">
                <Icon size={22} className="text-gold shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-ink">{label}</p>
                  <p className="text-sm text-faint mt-1 leading-snug">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 sm:px-8 py-16">
        <h2 className="font-serif text-2xl text-ocean mb-10">How a medical trip comes together</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {PROCESS.map((p) => (
            <div key={p.step} className="border-t-2 border-ocean pt-4">
              <span className="text-sm text-gold font-medium">{p.step}</span>
              <h4 className="mt-2 font-medium text-ink">{p.title}</h4>
              <p className="mt-2 text-sm text-faint leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-ocean-deep text-white">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-16 grid md:grid-cols-2 gap-14">
          <div>
            <h2 className="font-serif text-2xl">What travels with the patient</h2>
            <ul className="mt-6 space-y-3 text-sm text-[#BFD6DC] leading-relaxed">
              <li>— Flights for the patient and one accompanying family member</li>
              <li>— Medical visa guidance and required documents</li>
              <li>— Airport pickup and hospital-area accommodation</li>
              <li>— A point of contact reachable while you're in India</li>
              <li>— Arrangements for the flight home once discharged</li>
            </ul>
          </div>
          <div>
            <h2 className="font-serif text-2xl">Before you travel</h2>
            <p className="mt-6 text-sm text-[#BFD6DC] leading-relaxed">
              Send us your existing medical reports, scans or a referral letter if you have one. We pass these
              to the hospital so they can give a realistic treatment plan and cost estimate before you book any
              flights — so you're not travelling on guesswork.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 sm:px-8 py-16">
        <h2 className="font-serif text-2xl text-ocean mb-8">Questions we're often asked</h2>
        <div className="divide-y divide-line">
          {FAQS.map((f) => (
            <div key={f.q} className="py-5">
              <p className="font-medium text-ink">{f.q}</p>
              <p className="mt-2 text-sm text-muted leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gold">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-14 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <h3 className="font-serif text-2xl text-white max-w-md">
            Share your medical reports and we'll respond with next steps
          </h3>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-white text-gold-dark px-6 py-3 text-sm font-medium hover:bg-ocean-deep hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white"
          >
            Contact our team
          </Link>
        </div>
      </section>
    </div>
  );
}
