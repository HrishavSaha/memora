import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Bell, ChevronDown, User, Activity } from "lucide-react";
import { useStore } from '../Store';

const COLORS = {
  bg: "#F3E8D6",         
  primary: "#5A3161",    
  primaryLight: "#F6E1CC", 
  accent: "#8A5A2E",     
  text: "#3D2817",       
  subtext: "#6B5B4E",
  white: "#FFFFFF",
  border: "#E3D2B8",
};

export default function CaretakerDashboard() {
  const [patient] = useState("Kamala Devi");
  const [reminders, setReminders] = useStore('patient_reminders', { medicine: false, hydration: false });
  const [gameStats] = useStore('gameStats', { score: 70, mistakes: 0 });

  const trendData = [
    { session: "Mon", score: 62 },
    { session: "Tue", score: 65 },
    { session: "Wed", score: 60 },
    { session: "Thu", score: 68 },
    { session: "Fri", score: 70 },
    { session: "Sat", score: 66 },
    { session: "Sun", score: gameStats.score },
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 px-6">
      <div style={{ background: COLORS.white, border: `1px solid ${COLORS.border}` }} className="rounded-2xl p-6 mb-6 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold font-serif text-text mb-1">Caregiver Overview</h2>
          <p className="text-sm text-text-light flex items-center gap-2">
            <User size={16} /> Patient: <strong>{patient}</strong>
          </p>
        </div>
        <div className="flex gap-4">
          <div className="bg-peach px-4 py-2 rounded-xl flex flex-col items-center">
            <span className="text-xs text-text-light font-bold uppercase">Game Score</span>
            <span className="text-xl font-bold text-navy">{gameStats.score}/100</span>
          </div>
          <div className="bg-peach px-4 py-2 rounded-xl flex flex-col items-center">
            <span className="text-xs text-text-light font-bold uppercase">Mistakes</span>
            <span className="text-xl font-bold text-mascot-red">{gameStats.mistakes}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Management Tools */}
        <div style={{ background: COLORS.white, border: `1px solid ${COLORS.border}` }} className="rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-text mb-4 text-lg">Manage Reminders</h3>
          <div className="flex flex-col gap-4">
            <label className="flex items-center justify-between p-3 border border-[#E3D2B8] rounded-xl cursor-pointer hover:bg-gray-50">
              <span className="font-semibold text-text">Morning Medicine</span>
              <input type="checkbox" checked={reminders.medicine} onChange={() => setReminders({...reminders, medicine: !reminders.medicine})} className="w-5 h-5 accent-teal-dark" />
            </label>
            <label className="flex items-center justify-between p-3 border border-[#E3D2B8] rounded-xl cursor-pointer hover:bg-gray-50">
              <span className="font-semibold text-text">Hydration (Drink Water)</span>
              <input type="checkbox" checked={reminders.hydration} onChange={() => setReminders({...reminders, hydration: !reminders.hydration})} className="w-5 h-5 accent-teal-dark" />
            </label>
          </div>
        </div>

        {/* Progress & Alerts */}
        <div style={{ background: COLORS.white, border: `1px solid ${COLORS.border}` }} className="rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-text mb-4 text-lg">Caregiver Alert System</h3>
            {gameStats.mistakes > 5 ? (
              <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-mascot-red flex gap-3">
                <Activity size={24} className="shrink-0" />
                <p className="text-sm font-semibold">Alert: High mistake rate detected in recent games. Patient might be experiencing fatigue or frustration.</p>
              </div>
            ) : (
              <div className="bg-teal-50 border border-teal-200 p-4 rounded-xl text-teal-dark flex gap-3">
                <Activity size={24} className="shrink-0" />
                <p className="text-sm font-semibold">Status Normal: Patient performance is stable today. No unusual mood drops detected.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Trend Chart (from Template) */}
      <div style={{ background: COLORS.white, border: `1px solid ${COLORS.border}` }} className="rounded-2xl p-6 shadow-sm">
        <h3 className="font-bold text-text mb-4 text-lg">Weekly Cognitive Engagement</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid stroke={COLORS.border} vertical={false} />
            <XAxis dataKey="session" tick={{ fontSize: 12, fill: COLORS.subtext }} axisLine={{ stroke: COLORS.border }} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: COLORS.subtext }} axisLine={false} tickLine={false} domain={[40, 90]} />
            <Tooltip contentStyle={{ borderRadius: 10, border: `1px solid ${COLORS.border}`, fontSize: 12 }} />
            <Line type="monotone" dataKey="score" stroke={COLORS.primary} strokeWidth={3} dot={{ r: 4, fill: COLORS.primary }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
