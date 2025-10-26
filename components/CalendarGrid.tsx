import React, { useMemo } from 'react';
import { CalendarEvent } from '../types';
import { TrashIcon } from './Icons';

interface CalendarGridProps {
  currentDate: Date;
  events: CalendarEvent[];
  onSelectDate: (date: Date) => void;
  onDeleteEvent: (eventId: number) => void;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({ currentDate, events, onSelectDate, onDeleteEvent }) => {
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const calendarDays = useMemo(() => {
    const days = [];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const startDate = new Date(firstDayOfMonth);
    startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay());

    const endDate = new Date(lastDayOfMonth);
    endDate.setDate(endDate.getDate() + (6 - lastDayOfMonth.getDay()));

    let day = startDate;
    while (day <= endDate) {
      days.push(new Date(day));
      day.setDate(day.getDate() + 1);
    }
    return days;
  }, [currentDate]);

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const handleEventDelete = (e: React.MouseEvent, eventId: number) => {
    e.stopPropagation();
    onDeleteEvent(eventId);
  };
  
  return (
    <div>
      <div className="grid grid-cols-7 gap-1 text-center font-semibold text-slate-500 mb-2">
        {daysOfWeek.map(day => <div key={day}>{day}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => {
          const dayEvents = events.filter(e => e.date.toDateString() === day.toDateString());
          return (
            <div 
              key={index}
              className={`relative flex flex-col h-24 md:h-36 border border-slate-200 rounded-lg p-2 cursor-pointer transition-colors duration-200 hover:bg-sky-50 ${
                isCurrentMonth(day) ? 'bg-white' : 'bg-slate-50 text-slate-400'
              }`}
              onClick={() => onSelectDate(day)}
            >
              <span className={`font-medium ${isToday(day) ? 'bg-sky-500 text-white rounded-full flex items-center justify-center w-7 h-7' : ''}`}>
                {day.getDate()}
              </span>
              <div className="flex-grow overflow-y-auto mt-1 space-y-1 pr-1">
                {dayEvents.map(event => (
                  <div key={event.id} className="group relative bg-sky-100 text-sky-800 rounded px-2 py-1 text-xs truncate">
                    <span className="font-semibold">{event.time}</span> {event.title}
                    <button 
                      onClick={(e) => handleEventDelete(e, event.id)}
                      className="absolute right-1 top-1/2 -translate-y-1/2 p-0.5 bg-red-400 text-white rounded-full opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                      aria-label={`Delete event: ${event.title} at ${event.time}`}
                    >
                      <TrashIcon />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarGrid;