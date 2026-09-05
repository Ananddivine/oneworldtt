import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Plane, Stethoscope, Quote } from 'lucide-react';
import RouteHero from '../components/RouteHero';
import { POPULAR_ROUTES, SPECIALTIES, WHY_US, COMPANY } from '../data/content';

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 sm:px-8 pt-16 pb-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="font-serif text-[2.5rem] sm:text-[3.3rem] leading-[1.08] text-ocean">
            Book your next flight<br />from Port Moresby.
          </h1>
          <p className="mt-6 text-lg text-muted max-w-md leading-relaxed">
            {COMPANY.shortName} books domestic and international flights out of Port Moresby. We also
            arrange medical tourism trips to India, coordinating the hospital, visa and travel together.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/flights"
              className="inline-flex items-center gap-2 bg-ocean text-white px-6 py-3 text-sm font-medium hover:bg-ocean-deep transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ocean"
            >
              Search a flight
            </Link>
            <Link
              to="/medical-tourism"
              className="inline-flex items-center gap-2 border border-ocean text-ocean px-6 py-3 text-sm font-medium hover:bg-ocean hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ocean"
            >
              Medical tourism to India
            </Link>
          </div>
        </div>
        <RouteHero />
      </section>

      {/* About strip */}
      <section className="bg-mist">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-14 grid sm:grid-cols-3 gap-10">
          <p className="text-sm text-muted leading-relaxed sm:col-span-2 max-w-2xl">
            We are a Port Moresby-based travel agency. Some clients call us for a straightforward flight;
            others call us the week they receive a diagnosis and need a hospital, a visa and a plane ticket
            arranged at the same time. Either way, you speak to the same local team from the first call to
            the day you land back home.
          </p>
          <div className="text-sm text-muted leading-relaxed border-l border-line pl-6">
            <p className="font-medium text-ocean">Registered office</p>
            {COMPANY.address.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Flight booking — primary service */}
      <section className="bg-ocean-deep text-white">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-16">
          <div className="flex items-start gap-4 mb-8">
            <Plane className="text-gold-light shrink-0 mt-1" size={26} />
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl">Flight bookings</h2>
              <p className="mt-3 text-sm text-[#BFD6DC] max-w-xl leading-relaxed">
                Domestic PNG routes and international connections, compared and booked by people who fly them.
              </p>
            </div>
          </div>

          <div className="flex items-end justify-between flex-wrap gap-4 mb-4">
            <p className="text-sm text-faint">Where we fly people from Port Moresby</p>
            <Link to="/flights" className="text-gold-light text-sm font-medium hover:text-white transition-colors">
              Plan a trip →
            </Link>
          </div>
          <div className="border border-white/15">
            {POPULAR_ROUTES.map((r) => (
              <div key={r.to} className="px-5 py-4 border-b border-white/10 last:border-none flex items-center justify-between text-sm">
                <span className="text-[#E7EEF0]">{r.from}</span>
                <span className="text-faint">— {r.to}</span>
              </div>
            ))}
          </div>

          <Link
            to="/flights"
            className="mt-8 inline-flex items-center gap-2 bg-gold text-white px-6 py-3 text-sm font-medium hover:bg-gold-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gold"
          >
            Search flights <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>

      {/* Why us */}
      <section className="max-w-6xl mx-auto px-6 sm:px-8 py-20">
        <h2 className="font-serif text-2xl sm:text-3xl text-ocean max-w-lg">
          Why families in Port Moresby call us first
        </h2>
        <div className="mt-12 divide-y divide-line">
          {WHY_US.map((w) => (
            <div key={w.title} className="py-6 grid sm:grid-cols-[240px_1fr] gap-4 sm:gap-10">
              <h4 className="font-medium text-ocean">{w.title}</h4>
              <p className="text-muted leading-relaxed max-w-xl">{w.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Medical tourism — secondary service, condensed */}
      <section className="bg-mist">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <Stethoscope className="text-gold" size={26} />
              <h2 className="mt-5 font-serif text-2xl sm:text-3xl text-ocean">Medical tourism to India</h2>
              <p className="mt-3 text-sm text-muted leading-relaxed max-w-md">
                Hospital coordination, visas, accommodation and travel for treatment across major
                specialties — arranged alongside your flights, not as a separate booking.
              </p>
              <Link
                to="/medical-tourism"
                className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-ocean hover:underline"
              >
                See specialties &amp; how it works <ArrowUpRight size={16} />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              {SPECIALTIES.slice(0, 4).map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3">
                  <Icon size={20} className="text-gold shrink-0" />
                  <p className="text-sm font-medium text-ink">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial placeholder */}
      <section className="bg-ocean text-white">
        <div className="max-w-3xl mx-auto px-6 sm:px-8 py-16 text-center">
          <Quote className="mx-auto text-gold-light" size={28} />
          <p className="mt-6 font-serif text-xl sm:text-2xl leading-relaxed italic text-white/90">
            Add a client testimonial here once you have one you'd like to feature.
          </p>
          <p className="mt-4 text-sm text-faint">— Client name, treatment or route</p>
        </div>
      </section>

      {/* CTA */}
      <section>
        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <h3 className="font-serif text-2xl text-ocean max-w-md">
            Ready to plan a flight or a treatment trip?
          </h3>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-gold text-white px-6 py-3 text-sm font-medium hover:bg-gold-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gold"
          >
            Talk to our team
          </Link>
        </div>
      </section>
    </div>
  );
}
