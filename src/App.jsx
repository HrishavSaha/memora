import React from 'react';
import { useStore } from './Store';
import Navbar from './components/Navbar';
import PatientHome from './views/PatientHome';
import CaretakerDashboard from './views/CaretakerDashboard';
import DoctorDashboard from './views/DoctorDashboard';

function App() {
  const [role, setRole] = useStore('currentRole', 'patient');

  return (
    <div className="relative min-h-screen bg-cream font-body overflow-hidden">
      {/* Bamboo accents — fixed, low-opacity, corner-anchored so the low-res art is never stretched */}
      <img
        src="/bamboo_bg.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none fixed -left-60 -bottom-16 w-200 h-200 opacity-35 -scale-x-100"
      />
      <img
        src="/bamboo_bg.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none fixed -right-60 -bottom-16 w-200 h-200 opacity-35"
      />

      <div className="relative z-10">
        <Navbar role={role} setRole={setRole} />

        <main>
          {role === 'patient' && <PatientHome />}
          {role === 'caretaker' && <CaretakerDashboard />}
          {role === 'doctor' && <DoctorDashboard />}
        </main>
      </div>
    </div>
  );
}

export default App;
