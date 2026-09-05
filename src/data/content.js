import { HeartPulse, Bone, Smile, Baby, Microscope, ShieldCheck } from 'lucide-react';

export const COMPANY = {
  name: 'One World Tours and Travel Limited',
  shortName: 'One World Tours & Travel',
  phones: ['+675 8302 5555', '+675 8211 0003'],
  email: 'oneworldttl@gmail.com',
  address: [
    'Sec 427 Lot 3, Tisa Ruma Level 3 Unit 35',
    'Islander Drive, Port Moresby, NCD',
    'Papua New Guinea',
  ],
};

export const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Flights', to: '/flights' },
  { label: 'Medical Tourism', to: '/medical-tourism' },
  { label: 'Contact', to: '/contact' },
];

export const POPULAR_ROUTES = [
  { from: 'Port Moresby', to: 'Brisbane' },
  { from: 'Port Moresby', to: 'Sydney' },
  { from: 'Port Moresby', to: 'Singapore' },
  { from: 'Port Moresby', to: 'Manila' },
  { from: 'Port Moresby', to: 'Delhi / Chennai / Mumbai' },
  { from: 'Port Moresby', to: 'Lae, Mt Hagen & other domestic ports' },
];

export const SPECIALTIES = [
  { icon: HeartPulse, label: 'Cardiac care', desc: 'Bypass surgery, angioplasty and ongoing heart treatment.' },
  { icon: Bone, label: 'Orthopedics', desc: 'Joint replacement, spine surgery and sports injury repair.' },
  { icon: Microscope, label: 'Oncology', desc: 'Cancer diagnosis, surgery, chemotherapy and radiation.' },
  { icon: Baby, label: 'Fertility & IVF', desc: 'Fertility assessment and assisted reproduction programs.' },
  { icon: Smile, label: 'Dental & cosmetic', desc: 'Reconstructive, cosmetic and general dental procedures.' },
  { icon: ShieldCheck, label: 'General surgery', desc: 'Transplant, gastro and other specialist surgical care.' },
];

export const PROCESS = [
  { step: '01', title: 'Tell us what you need', desc: 'Share your medical reports or travel dates with our Port Moresby team, in English or Tok Pisin.' },
  { step: '02', title: 'We match you with a hospital', desc: 'We connect you with a suitable hospital in India and send back a treatment plan and cost estimate.' },
  { step: '03', title: 'We handle the logistics', desc: 'Flights, visa support, airport pickup and accommodation for you and an accompanying family member.' },
  { step: '04', title: 'Treatment, recovery & return', desc: 'We stay in contact through treatment and arrange your flight home once you are cleared to travel.' },
];

export const WHY_US = [
  { title: 'A local team you can call', desc: 'Based in Port Moresby, reachable by phone in English or Tok Pisin — not a call centre overseas.' },
  { title: 'One booking, start to finish', desc: 'Flights, hospital coordination, visas and accommodation arranged together, not by three different agencies.' },
  { title: 'Costs explained upfront', desc: 'You receive a written estimate before you travel, so there are no surprises at the hospital counter.' },
  { title: 'Support that travels with you', desc: 'We stay reachable while you are in India, from arrival at the airport to discharge from hospital.' },
];

export const FAQS = [
  {
    q: 'How far in advance should I book a flight?',
    a: 'For domestic PNG routes, a few days is usually fine. For international flights and any medical trip to India, we recommend contacting us at least 3–4 weeks ahead so we can secure fares and, where needed, hospital appointments.',
  },
  {
    q: 'Can a family member travel with a patient?',
    a: 'Yes. Most patients travel with one accompanying family member, and we arrange flights and accommodation for both of you.',
  },
  {
    q: 'Do you help with visas?',
    a: 'Yes, we guide you through the Indian medical visa process and let you know exactly which documents are required before you travel.',
  },
  {
    q: 'Is the flight search on this site a real booking?',
    a: 'No — the search tool on our Flights page is a planning tool to help you compare dates and times. To confirm and pay for a ticket, contact our team directly by phone or email.',
  },
];
