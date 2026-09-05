import React from 'react';
import { User, Activity, LayoutDashboard, Settings } from 'lucide-react';

export default function Navbar({ role, setRole }) {
  const toggleRole = (r) => {
    setRole(r);
  };

  return (
    <div className="sticky top-0 z-50 bg-cream/90 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-baseline gap-2">
          <span className="font-serif font-bold text-2xl text-text">Memora</span>
          <span className="text-sm text-text-light">SIH 26003</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-cream-dark rounded-full p-1 flex">
            <button
              onClick={() => toggleRole('patient')}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors flex items-center gap-2 ${
                role === 'patient' ? 'bg-navy text-white shadow' : 'text-text-light hover:bg-peach'
              }`}
            >
              <User size={16} /> Patient
            </button>
            <button
              onClick={() => toggleRole('caretaker')}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors flex items-center gap-2 ${
                role === 'caretaker' ? 'bg-teal-dark text-white shadow' : 'text-text-light hover:bg-peach'
              }`}
            >
              <LayoutDashboard size={16} /> Caretaker
            </button>
            <button
              onClick={() => toggleRole('doctor')}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors flex items-center gap-2 ${
                role === 'doctor' ? 'bg-navy text-white shadow' : 'text-text-light hover:bg-peach'
              }`}
            >
              <Activity size={16} /> Doctor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
