
import React, { useState, useCallback, useMemo } from 'react';
import { CalendarEvent } from './types';
import CalendarGrid from './components/CalendarGrid';
import EventModal from './components/EventModal';
import Header from './components/Header';

const App: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([
    { id: 1, date: new Date(), title: 'Team Meeting', time: '10:00' },
    { id: 2, date: new Date(new Date().setDate(new Date().getDate() + 5)), title: 'Project Deadline', time: '17:00' },
    { id: 3, date: new Date(new Date().setDate(new Date().getDate() - 10)), title: 'Dentist Appointment', time: '14:30' },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handlePrevMonth = useCallback(() => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  }, []);

  const handleNextMonth = useCallback(() => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  }, []);

  const handleSelectDate = useCallback((date: Date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedDate(null);
  }, []);

  const handleSaveEvent = useCallback((title: string, time: string) => {
    if (selectedDate) {
      const newEvent: CalendarEvent = {
        id: Date.now(),
        date: selectedDate,
        title,
        time,
      };
      setEvents(prev => [...prev, newEvent]);
      handleCloseModal();
    }
  }, [selectedDate, handleCloseModal]);
  
  const handleDeleteEvent = useCallback((eventId: number) => {
      setEvents(prev => prev.filter(event => event.id !== eventId));
  }, []);

  const eventsForMonth = useMemo(() => {
    return events.filter(event => 
      event.date.getMonth() === currentDate.getMonth() &&
      event.date.getFullYear() === currentDate.getFullYear()
    );
  }, [events, currentDate]);

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 antialiased">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <Header 
          currentDate={currentDate}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
        />
        <main className="mt-8 bg-white rounded-2xl shadow-lg p-4 md:p-6">
          <CalendarGrid 
            currentDate={currentDate}
            events={eventsForMonth}
            onSelectDate={handleSelectDate}
            onDeleteEvent={handleDeleteEvent}
          />
        </main>
      </div>
      {isModalOpen && selectedDate && (
        <EventModal 
          date={selectedDate}
          onClose={handleCloseModal}
          onSave={handleSaveEvent}
        />
      )}
    </div>
  );
};

export default App;
