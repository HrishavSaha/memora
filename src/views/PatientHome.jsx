import React, { useState } from 'react';
import { useStore } from '../Store';
import { CheckCircle2, Circle, ChevronLeft, ChevronRight, Clock, Brain } from 'lucide-react';
import PatternDrumGame from '../components/PatternDrumGame';

const GAMES = [
  { id: 'flashcards', name: 'Flashcards', color: 'bg-mascot-red', textColor: 'text-white', active: false },
  { id: 'grocery', name: 'Grocery List', color: 'bg-mascot-brown', textColor: 'text-white', active: false },
  { id: 'tile', name: 'Tile Recall', color: 'bg-navy', textColor: 'text-white', active: true },
  { id: 'sorting', name: 'Sorting', color: 'bg-mascot-maroon', textColor: 'text-white', active: false },
];

const toDateKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const buildSampleAppointments = () => {
  const today = new Date();
  const plus = (days) => {
    const d = new Date(today);
    d.setDate(d.getDate() + days);
    return toDateKey(d);
  };
  return {
    [plus(0)]: [{ time: '2:00 PM', title: 'Dr. Alvarez — Checkup' }],
    [plus(2)]: [{ time: '10:30 AM', title: 'Physical Therapy' }],
    [plus(5)]: [{ time: '9:00 AM', title: 'Eye Exam' }],
    [plus(9)]: [{ time: '11:00 AM', title: 'Family Visit' }],
  };
};

const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export default function PatientHome() {
  const [reminders, setReminders] = useStore('patient_reminders', { medicine: false, hydration: false });
  const [activeGame, setActiveGame] = useState(null);
  const [appointments] = useStore('patient_appointments', buildSampleAppointments());
  const [viewDate, setViewDate] = useState(() => new Date());

  const toggleReminder = (key) => {
    setReminders({ ...reminders, [key]: !reminders[key] });
  };

  const today = new Date();
  const todayKey = toDateKey(today);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const startWeekday = firstOfMonth.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthLabel = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const calendarCells = [];
  for (let i = 0; i < startWeekday; i++) calendarCells.push(null);
  for (let day = 1; day <= daysInMonth; day++) calendarCells.push(day);

  const changeMonth = (delta) => {
    setViewDate(new Date(year, month + delta, 1));
  };

  const upcoming = Object.entries(appointments)
    .filter(([dateKey]) => dateKey >= todayKey)
    .sort(([a], [b]) => a.localeCompare(b))
    .flatMap(([dateKey, items]) => items.map(item => ({ ...item, dateKey })))
    .slice(0, 5);

  const formatUpcomingDate = (dateKey) => {
    const [y, m, d] = dateKey.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    if (dateKey === todayKey) return 'Today';
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  if (activeGame === 'tile') {
    return (
      <div className="py-8">
        <button onClick={() => setActiveGame(null)} className="mb-4 text-navy font-semibold underline px-6">
          Back to Home
        </button>
        <PatternDrumGame />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-6">
      {/* Header */}
      <div className="bg-cream-dark border-[3px] border-[#E3D2B8] rounded-[32px] p-6 shadow-md mb-8 flex flex-col md:flex-row items-center gap-6">
        <div className="w-24 h-24 bg-cream rounded-full border-2 border-mascot-red flex items-center justify-center overflow-hidden shadow-inner">
          <img src="/mascot.png" alt="Remi the Red Panda" className="w-full h-full object-contain p-1" />
        </div>
        <div>
          <h1 className="font-serif text-3xl font-bold text-text mb-2">Good morning, Kamala</h1>
          <p className="text-text-light mb-1">Remi is here to help you today!</p>
          <p className="font-head text-mascot-red font-semibold text-lg tracking-wide">play. remember. smile.</p>
        </div>
      </div>

      {/* Reminders */}
      <div className="mb-10">
        <h2 className="text-sm font-bold tracking-wider uppercase text-text-light mb-4">Daily Reminders</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            onClick={() => toggleReminder('medicine')}
            className={`p-4 rounded-2xl flex items-center gap-4 cursor-pointer transition-colors ${reminders.medicine ? 'bg-navy text-white' : 'bg-cream-dark text-text hover:bg-peach'}`}
          >
            {reminders.medicine ? <CheckCircle2 size={24} /> : <Circle size={24} />}
            <span className="font-semibold text-lg">Morning Medicine</span>
          </div>
          <div 
            onClick={() => toggleReminder('hydration')}
            className={`p-4 rounded-2xl flex items-center gap-4 cursor-pointer transition-colors ${reminders.hydration ? 'bg-teal-dark text-white' : 'bg-cream-dark text-text hover:bg-peach'}`}
          >
            {reminders.hydration ? <CheckCircle2 size={24} /> : <Circle size={24} />}
            <span className="font-semibold text-lg">Drink Water</span>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="mb-10">
        <h2 className="text-sm font-bold tracking-wider uppercase text-text-light mb-4">Upcoming Schedule</h2>
        <div className="bg-cream-dark border-[3px] border-[#E3D2B8] rounded-3xl p-6 shadow-md flex flex-col md:flex-row gap-6">
          {/* Month grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => changeMonth(-1)}
                className="p-2 rounded-full hover:bg-peach transition-colors"
                aria-label="Previous month"
              >
                <ChevronLeft size={20} className="text-text" />
              </button>
              <span className="font-bold text-text">{monthLabel}</span>
              <button
                onClick={() => changeMonth(1)}
                className="p-2 rounded-full hover:bg-peach transition-colors"
                aria-label="Next month"
              >
                <ChevronRight size={20} className="text-text" />
              </button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center">
              {WEEKDAY_LABELS.map((label, i) => (
                <div key={i} className="text-xs font-semibold text-text-light py-1">{label}</div>
              ))}
              {calendarCells.map((day, i) => {
                if (day === null) return <div key={i} />;
                const dateKey = toDateKey(new Date(year, month, day));
                const isToday = dateKey === todayKey;
                const hasAppointment = !!appointments[dateKey];
                return (
                  <div
                    key={i}
                    className={`relative aspect-square flex items-center justify-center rounded-full text-sm ${isToday ? 'bg-navy text-white font-bold' : 'text-text'}`}
                  >
                    {day}
                    {hasAppointment && (
                      <span className={`absolute bottom-0.5 w-1.5 h-1.5 rounded-full ${isToday ? 'bg-white' : 'bg-mascot-red'}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming list */}
          <div className="flex-1 md:border-l md:border-[#E3D2B8] md:pl-6">
            <h3 className="text-xs font-bold tracking-wider uppercase text-text-light mb-3">Next Appointments</h3>
            {upcoming.length === 0 ? (
              <p className="text-text-light text-sm">No upcoming appointments.</p>
            ) : (
              <ul className="space-y-3">
                {upcoming.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cream flex items-center justify-center shrink-0 border border-[#E3D2B8]">
                      <Clock size={18} className="text-mascot-red" />
                    </div>
                    <div>
                      <p className="font-semibold text-text">{item.title}</p>
                      <p className="text-sm text-text-light">{formatUpcomingDate(item.dateKey)} · {item.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Games */}
      <div>
        <h2 className="text-sm font-bold tracking-wider uppercase text-text-light mb-4">Today's Games</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {GAMES.map(game => (
            <div 
              key={game.id} 
              onClick={() => game.active ? setActiveGame(game.id) : null}
              className={`p-6 rounded-2xl flex flex-col items-center justify-center text-center transition-transform ${game.active ? 'cursor-pointer hover:scale-105 shadow-md bg-cream-dark border border-[#E3D2B8]' : 'opacity-60 cursor-not-allowed bg-gray-100'}`}
            >
              <div className={`w-12 h-12 rounded-xl mb-3 flex items-center justify-center text-xl shadow-sm ${game.color} ${game.textColor}`}>
                {game.id === 'flashcards' && '🎴'}
                {game.id === 'grocery' && '🛒'}
                {game.id === 'tile' && '🔲'}
                {game.id === 'sorting' && '🎨'}
              </div>
              <span className="font-bold text-text">{game.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* MoCA check-in prompt */}
      <div className="mt-8 bg-navy text-white rounded-3xl p-6 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
            <Brain size={28} />
          </div>
          <div>
            <p className="font-bold text-lg">Appointment coming up</p>
            <p className="text-white/80 text-sm">
              Your next check-in is around the corner — a quick round of Tile Recall keeps your mind sharp and warmed up for it.
            </p>
          </div>
        </div>
        <button
          onClick={() => setActiveGame('tile')}
          className="bg-white text-navy font-bold px-6 py-3 rounded-xl hover:bg-cream transition-colors shrink-0"
        >
          New Game
        </button>
      </div>
    </div>
  );
}
