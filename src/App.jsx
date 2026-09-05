import React from 'react';
import { useStore } from './Store';
import Navbar from './components/Navbar';
import PatientHome from './views/PatientHome';
import CaretakerDashboard from './views/CaretakerDashboard';
import DoctorDashboard from './views/DoctorDashboard';

function App() {
  const [role, setRole] = useStore('currentRole', 'patient');

  return (
    <div className="min-h-screen bg-cream font-body">
      <Navbar role={role} setRole={setRole} />
      
      <main>
        {role === 'patient' && <PatientHome />}
        {role === 'caretaker' && <CaretakerDashboard />}
        {role === 'doctor' && <DoctorDashboard />}
      </main>
    </div>
  );
}

export default App;
