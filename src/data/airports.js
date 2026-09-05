// A small illustrative set of airports for the trip planner's dropdowns.
// Extend this list with any additional cities you regularly book.
export const AIRPORTS = [
  { code: 'POM', city: 'Port Moresby', country: 'Papua New Guinea' },
  { code: 'LAE', city: 'Lae', country: 'Papua New Guinea' },
  { code: 'HGU', city: 'Mount Hagen', country: 'Papua New Guinea' },
  { code: 'RAB', city: 'Rabaul', country: 'Papua New Guinea' },
  { code: 'BNE', city: 'Brisbane', country: 'Australia' },
  { code: 'SYD', city: 'Sydney', country: 'Australia' },
  { code: 'SIN', city: 'Singapore', country: 'Singapore' },
  { code: 'MNL', city: 'Manila', country: 'Philippines' },
  { code: 'DEL', city: 'New Delhi', country: 'India' },
  { code: 'BOM', city: 'Mumbai', country: 'India' },
  { code: 'MAA', city: 'Chennai', country: 'India' },
  { code: 'CCU', city: 'Kolkata', country: 'India' },
];

export const findAirport = (code) => AIRPORTS.find((a) => a.code === code);

export default AIRPORTS;
