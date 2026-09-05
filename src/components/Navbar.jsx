import React from 'react';
import { User, Activity, LayoutDashboard, Settings } from 'lucide-react';

export default function Navbar({ role, setRole }) {
  const toggleRole = (r) => {
    setRole(r);
  };

  return (
    <div className="sticky top-0 z-50 bg-cream/90 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-baseline gap-2">
          <span className="font-serif font-bold text-2xl text-text-dark">Memora</span>
          <span className="text-sm text-gray-500">SIH 26003</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-gray-100 rounded-full p-1 flex">
            <button
              onClick={() => toggleRole('patient')}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors flex items-center gap-2 ${
                role === 'patient' ? 'bg-accent-navy text-white shadow' : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              <User size={16} /> Patient
            </button>
            <button
              onClick={() => toggleRole('caretaker')}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors flex items-center gap-2 ${
                role === 'caretaker' ? 'bg-accent-teal text-white shadow' : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              <LayoutDashboard size={16} /> Caretaker
            </button>
            <button
              onClick={() => toggleRole('doctor')}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors flex items-center gap-2 ${
                role === 'doctor' ? 'bg-accent-navy text-white shadow' : 'text-gray-600 hover:bg-gray-200'
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
