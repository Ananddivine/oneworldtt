import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MapPin, Phone, Mail, CheckCircle2 } from 'lucide-react';
import { COMPANY } from '../data/content';

export default function Contact() {
  const location = useLocation();
  const prefill = location.state?.prefillMessage || '';

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    service: prefill ? 'Flight booking' : 'Flight booking',
    message: prefill,
  });
  const [sent, setSent] = useState(false);

  const updateField = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section className="max-w-6xl mx-auto px-6 sm:px-8 py-16">
      <h1 className="font-serif text-3xl sm:text-4xl text-ocean mb-4">Get in touch</h1>
      <p className="text-muted max-w-xl mb-12">
        Call, email or send an enquiry below and our Port Moresby team will get back to you.
      </p>

      <div className="grid md:grid-cols-[1fr_1.3fr] border border-line relative">
        <div
          className="hidden md:block absolute top-0 bottom-0 left-[38%] w-px border-l-2 border-dashed border-line"
          aria-hidden="true"
        />

        {/* Info stub */}
        <div className="bg-ocean text-white p-8 flex flex-col gap-6">
          <div>
            <p className="text-xs text-faint mb-1">Passenger</p>
            <p className="font-serif text-xl">{COMPANY.name}</p>
          </div>

          <div className="flex gap-3">
            <MapPin size={18} className="text-gold-light shrink-0 mt-0.5" />
            <p className="text-sm text-[#BFD6DC] leading-relaxed">
              {COMPANY.address.map((line) => (
                <span key={line}>
                  {line}
                  <br />
                </span>
              ))}
            </p>
          </div>

          <div className="flex gap-3">
            <Phone size={18} className="text-gold-light shrink-0 mt-0.5" />
            <div className="text-sm text-[#BFD6DC] leading-relaxed">
              {COMPANY.phones.map((phone) => (
                <a key={phone} href={`tel:${phone.replace(/\s+/g, '')}`} className="block hover:text-white transition-colors">
                  {phone}
                </a>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Mail size={18} className="text-gold-light shrink-0 mt-0.5" />
            <a href={`mailto:${COMPANY.email}`} className="text-sm text-[#BFD6DC] hover:text-white transition-colors">
              {COMPANY.email}
            </a>
          </div>
        </div>

        {/* Form stub */}
        <div className="p-8">
          {sent ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-3 py-16">
              <CheckCircle2 size={32} className="text-ocean" />
              <p className="font-serif text-xl text-ocean">Message sent</p>
              <p className="text-sm text-faint max-w-xs">Thank you — our team will call or email you back shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid gap-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <label className="text-sm text-[#33454C]">
                  Full name
                  <input
                    required
                    value={form.name}
                    onChange={updateField('name')}
                    className="mt-1.5 w-full border border-line px-3 py-2.5 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ocean"
                  />
                </label>
                <label className="text-sm text-[#33454C]">
                  Phone number
                  <input
                    required
                    value={form.phone}
                    onChange={updateField('phone')}
                    className="mt-1.5 w-full border border-line px-3 py-2.5 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ocean"
                  />
                </label>
              </div>

              <label className="text-sm text-[#33454C]">
                Email
                <input
                  type="email"
                  value={form.email}
                  onChange={updateField('email')}
                  className="mt-1.5 w-full border border-line px-3 py-2.5 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ocean"
                />
              </label>

              <label className="text-sm text-[#33454C]">
                I'm enquiring about
                <select
                  value={form.service}
                  onChange={updateField('service')}
                  className="mt-1.5 w-full border border-line px-3 py-2.5 text-sm bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-ocean"
                >
                  <option>Flight booking</option>
                  <option>Medical tourism to India</option>
                  <option>Both</option>
                </select>
              </label>

              <label className="text-sm text-[#33454C]">
                Message
                <textarea
                  rows={6}
                  value={form.message}
                  onChange={updateField('message')}
                  className="mt-1.5 w-full border border-line px-3 py-2.5 text-sm font-mono focus:outline-none focus-visible:ring-2 focus-visible:ring-ocean"
                />
              </label>

              <button
                type="submit"
                className="justify-self-start inline-flex items-center gap-2 bg-gold text-white px-6 py-3 text-sm font-medium hover:bg-gold-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gold"
              >
                Send enquiry
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
