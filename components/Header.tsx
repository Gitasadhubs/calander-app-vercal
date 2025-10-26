import React, { useState, useEffect } from 'react';
import { fetchMonthlyTheme } from '../services/geminiService';
import { ChevronLeftIcon, ChevronRightIcon } from './Icons';

interface HeaderProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentDate, onPrevMonth, onNextMonth }) => {
  const [monthlyTheme, setMonthlyTheme] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const monthYear = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  useEffect(() => {
    const getTheme = async () => {
      setIsLoading(true);
      try {
        const theme = await fetchMonthlyTheme(currentDate.toLocaleString('default', { month: 'long' }), currentDate.getFullYear());
        setMonthlyTheme(theme);
      } catch (error) {
        console.error("Failed to fetch monthly theme:", error);
        setMonthlyTheme("A fantastic month for making plans!");
      } finally {
        setIsLoading(false);
      }
    };

    getTheme();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monthYear]);

  return (
    <header className="bg-white rounded-2xl shadow-md p-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-slate-900">{monthYear}</h1>
          <div className="h-6 mt-2">
            {isLoading ? (
              <div className="animate-pulse bg-slate-200 h-4 w-3/4 rounded-md"></div>
            ) : (
              <p className="text-slate-500 italic">"{monthlyTheme}"</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onPrevMonth} className="p-2 rounded-full hover:bg-slate-100 transition-colors duration-200" aria-label="Previous month">
            <ChevronLeftIcon />
          </button>
          <button onClick={onNextMonth} className="p-2 rounded-full hover:bg-slate-100 transition-colors duration-200" aria-label="Next month">
            <ChevronRightIcon />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;