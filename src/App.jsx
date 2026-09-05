import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TopBar from './components/TopBar';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Flights from './pages/Flights';
import MedicalTourism from './pages/MedicalTourism';
import Contact from './pages/Contact';

export default function App() {
  return (
    <div className="min-h-screen bg-white text-ink font-sans flex flex-col">
      <TopBar />
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/flights" element={<Flights />} />
          <Route path="/medical-tourism" element={<MedicalTourism />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
