import { useState } from 'react';
import { TIMETABLE_SLOTS, DAYS, TIMETABLE_START_HOUR, TIMETABLE_END_HOUR } from '../../data/timetable';
import { Clock, MapPin, User } from 'lucide-react';

// Format a 24h hour number to display (e.g. 9 → "9 AM", 14 → "2 PM")
function fmtHour(h) {
  if (h === 12) return '12 PM';
  return h < 12 ? `${h} AM` : `${h - 12} PM`;
}

// Hours to render as row labels
const HOURS = Array.from(
  { length: TIMETABLE_END_HOUR - TIMETABLE_START_HOUR },
  (_, i) => TIMETABLE_START_HOUR + i
);

// How many pixels per hour row
const HOUR_HEIGHT = 64;

/**
 * Student Timetable, weekly grid Mon–Sat, 8 AM–6 PM.
 * Each timetable slot is absolutely positioned inside its day column.
 */
export default function Timetable() {
  const [tooltip, setTooltip] = useState(null);

  return (
    <div>
      {/* Page header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-navy">My Timetable</h2>
        <p className="text-sm text-gray-500 mt-1">Semester 4 · Spring 2024 · Weekly Schedule</p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-4">
        {[
          { label: 'DBMS',                color: 'bg-blue-200 border-blue-400' },
          { label: 'Software Engg.',      color: 'bg-emerald-200 border-emerald-400' },
          { label: 'Artificial Intel.',   color: 'bg-purple-200 border-purple-400' },
          { label: 'Web Development',     color: 'bg-amber-200 border-amber-400' },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-1.5">
            <span className={`w-3 h-3 rounded-sm border ${l.color}`} />
            <span className="text-xs text-gray-600">{l.label}</span>
          </div>
        ))}
      </div>

      {/* Grid card */}
      <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-auto">
        {/* Header row: Time + Days */}
        <div className="grid sticky top-0 z-10 bg-white border-b border-gray-100"
          style={{ gridTemplateColumns: `64px repeat(6, 1fr)` }}>
          <div className="text-[10px] font-semibold text-gray-400 uppercase flex items-center justify-center py-3 border-r border-gray-100">
            Time
          </div>
          {DAYS.map(day => (
            <div key={day} className="text-xs font-semibold text-navy text-center py-3 border-r last:border-r-0 border-gray-100">
              {day.slice(0, 3)}
            </div>
          ))}
        </div>

        {/* Grid body */}
        <div className="grid" style={{ gridTemplateColumns: `64px repeat(6, 1fr)` }}>
          {/* Time labels column */}
          <div className="border-r border-gray-100">
            {HOURS.map(h => (
              <div
                key={h}
                style={{ height: HOUR_HEIGHT }}
                className="flex items-start justify-end pr-2 pt-1 border-b border-gray-50"
              >
                <span className="text-[10px] text-gray-400 font-medium">{fmtHour(h)}</span>
              </div>
            ))}
          </div>

          {/* Day columns */}
          {DAYS.map((day, dayIdx) => {
            const daySlots = TIMETABLE_SLOTS.filter(s => s.days.includes(dayIdx));
            return (
              <div
                key={day}
                className="relative border-r last:border-r-0 border-gray-100"
                style={{ height: HOURS.length * HOUR_HEIGHT }}
              >
                {/* Hour grid lines */}
                {HOURS.map(h => (
                  <div
                    key={h}
                    style={{ top: (h - TIMETABLE_START_HOUR) * HOUR_HEIGHT, height: HOUR_HEIGHT }}
                    className="absolute inset-x-0 border-b border-gray-50"
                  />
                ))}

                {/* Timetable slots */}
                {daySlots.map(slot => {
                  const top    = (slot.startHour - TIMETABLE_START_HOUR) * HOUR_HEIGHT;
                  const height = (slot.endHour - slot.startHour) * HOUR_HEIGHT - 4;
                  return (
                    <div
                      key={slot.id}
                      style={{ top: top + 2, height, left: 2, right: 2 }}
                      className={`absolute rounded-lg border-l-4 px-2 py-1.5 cursor-pointer overflow-hidden transition-smooth hover:shadow-md hover:scale-[1.01] ${slot.color}`}
                      onClick={() => setTooltip(tooltip?.id === slot.id ? null : slot)}
                    >
                      <p className="text-[10px] font-bold leading-none">{slot.courseCode}</p>
                      <p className="text-[9px] font-medium mt-0.5 leading-tight line-clamp-2 opacity-80">
                        {slot.courseName}
                      </p>
                      <p className="text-[9px] mt-1 opacity-70">{slot.type} · {slot.room}</p>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail panel when a slot is clicked */}
      {tooltip && (
        <div className="mt-4 p-4 bg-white rounded-2xl shadow-card border border-gray-100 animate-slide-up flex flex-wrap gap-6">
          <div>
            <p className="text-xs text-gray-400 font-medium">Course</p>
            <p className="text-sm font-bold text-navy mt-0.5">{tooltip.courseCode}, {tooltip.courseName}</p>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-gold" />
            <div>
              <p className="text-xs text-gray-400 font-medium">Time</p>
              <p className="text-sm font-semibold text-navy mt-0.5">{fmtHour(tooltip.startHour)} – {fmtHour(tooltip.endHour)}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-gold" />
            <div>
              <p className="text-xs text-gray-400 font-medium">Room</p>
              <p className="text-sm font-semibold text-navy mt-0.5">{tooltip.room}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-gold" />
            <div>
              <p className="text-xs text-gray-400 font-medium">Faculty</p>
              <p className="text-sm font-semibold text-navy mt-0.5">{tooltip.facultyName}</p>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Type</p>
            <span className="inline-block mt-0.5 text-xs font-semibold px-2 py-0.5 rounded-full bg-navy/10 text-navy">{tooltip.type}</span>
          </div>
        </div>
      )}
    </div>
  );
}
