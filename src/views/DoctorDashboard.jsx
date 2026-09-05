import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { useStore } from '../Store';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function DoctorDashboard() {
  const [patient] = useState("Kamala Devi");
  const [gameStats] = useStore('gameStats', { score: 70, mistakes: 0 });

  // 1. Current vs Last Appointment Data (Bar Chart)
  const currentVsLastData = {
    labels: ['Memory', 'Attention', 'Visuospatial', 'Orientation'],
    datasets: [
      {
        label: 'Last Appointment (Aug 22)',
        data: [58, 70, 55, 74],
        backgroundColor: '#E8B98D',
      },
      {
        label: 'Current Appointment (Sep 5)',
        data: [64, 68, 61, 77],
        backgroundColor: '#70C3BB',
      }
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Current vs Last Appointment' },
    },
  };

  // 2. Previous Appointments Data (Historical context)
  const prevAppointmentsData = {
    labels: ['May 1', 'Jun 15', 'Jul 28', 'Aug 22'],
    datasets: [
      {
        label: 'Overall MoCA Est.',
        data: [18, 19, 18, 20],
        borderColor: '#5A3161',
        backgroundColor: '#5A3161',
        tension: 0.3,
      },
      {
        label: 'Medication Adherence (%)',
        data: [85, 90, 88, 95],
        borderColor: '#125D7A',
        backgroundColor: '#125D7A',
        borderDash: [5, 5],
        tension: 0.3,
      }
    ],
  };

  const lineOptions1 = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Historical Context (Previous Appointments)' },
    },
    scales: { y: { min: 0, max: 100 } }
  };

  // 3. Overall Trajectory (Line Chart)
  const overallTrajectoryData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Current'],
    datasets: [
      {
        label: 'Daily Cognitive Score (from games)',
        data: [60, 62, 61, 65, 64, 68, 70, gameStats.score],
        borderColor: '#4A5A8C',
        backgroundColor: '#4A5A8C',
        fill: true,
        tension: 0.4,
      }
    ],
  };

  const lineOptions2 = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Overall Daily Trajectory' },
    },
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-6">
      <div className="bg-white border border-[#E3D2B8] rounded-2xl p-6 mb-6 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold font-serif text-text mb-1">Doctor Portal (Clinical View)</h2>
          <p className="text-sm text-text-light">Patient: <strong>{patient}</strong> | Age: 74 | Diagnosis: Mild NCD</p>
        </div>
        <div className="bg-cream-dark px-4 py-2 rounded-xl border border-[#E3D2B8] text-sm font-semibold text-text-light">
          Private Clinical Data
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white border border-[#E3D2B8] rounded-2xl p-6 shadow-sm h-80">
          <Bar options={barOptions} data={currentVsLastData} />
        </div>
        <div className="bg-white border border-[#E3D2B8] rounded-2xl p-6 shadow-sm h-80">
          <Line options={lineOptions1} data={prevAppointmentsData} />
        </div>
      </div>

      <div className="bg-white border border-[#E3D2B8] rounded-2xl p-6 shadow-sm h-96">
        <Line options={lineOptions2} data={overallTrajectoryData} />
      </div>
    </div>
  );
}
