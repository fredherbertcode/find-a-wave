import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface FullCalendarProps {
  startDate: string;
  endDate: string;
  onChange: (startDate: string, endDate: string) => void;
}

export const FullCalendar: React.FC<FullCalendarProps> = ({
  startDate,
  endDate,
  onChange
}) => {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const date = startDate ? new Date(startDate) : new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1);
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getCalendarDays = (month: Date) => {
    const year = month.getFullYear();
    const monthIndex = month.getMonth();

    const firstDay = new Date(year, monthIndex, 1);
    const lastDay = new Date(year, monthIndex + 1, 0);

    // Get the first day of the week (Sunday = 0)
    const startPadding = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const days = [];

    // Add padding days from previous month
    for (let i = startPadding - 1; i >= 0; i--) {
      const date = new Date(year, monthIndex, -i);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: false,
        isSelected: false,
        isInRange: false,
        isDisabled: true
      });
    }

    // Add days of current month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, monthIndex, day);
      const dateStr = date.toISOString().split('T')[0];
      const isToday = date.getTime() === today.getTime();
      const isSelected = dateStr === startDate || dateStr === endDate;
      const isInRange = startDate && endDate &&
        date >= new Date(startDate) && date <= new Date(endDate);
      const isDisabled = date < today;

      days.push({
        date,
        isCurrentMonth: true,
        isToday,
        isSelected,
        isInRange,
        isDisabled
      });
    }

    return days;
  };

  const handleDateClick = (date: Date) => {
    if (date < today) return;

    const dateStr = date.toISOString().split('T')[0];

    if (!startDate || (startDate && endDate)) {
      // Start new selection
      onChange(dateStr, '');
    } else if (startDate && !endDate) {
      // Complete the range
      if (date >= new Date(startDate)) {
        onChange(startDate, dateStr);
      } else {
        onChange(dateStr, startDate);
      }
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const monthName = currentMonth.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const calendarDays = getCalendarDays(currentMonth);

  const getDuration = () => {
    if (!startDate || !endDate) return '';
    const days = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return `${days} day${days !== 1 ? 's' : ''}`;
  };

  return (
    <div className="full-calendar">
      <div className="calendar-header">
        <button
          type="button"
          onClick={() => navigateMonth('prev')}
          className="calendar-nav-btn"
        >
          <ChevronLeft className="calendar-nav-icon" />
        </button>
        <h3 className="calendar-month-title">{monthName}</h3>
        <button
          type="button"
          onClick={() => navigateMonth('next')}
          className="calendar-nav-btn"
        >
          <ChevronRight className="calendar-nav-icon" />
        </button>
      </div>

      <div className="calendar-weekdays">
        {weekdays.map(day => (
          <div key={day} className="calendar-weekday">
            {day}
          </div>
        ))}
      </div>

      <div className="calendar-grid">
        {calendarDays.map((day, index) => (
          <button
            key={index}
            type="button"
            onClick={() => handleDateClick(day.date)}
            disabled={day.isDisabled}
            className={`calendar-day ${
              day.isCurrentMonth ? 'current-month' : 'other-month'
            } ${
              day.isToday ? 'today' : ''
            } ${
              day.isSelected ? 'selected' : ''
            } ${
              day.isInRange ? 'in-range' : ''
            } ${
              day.isDisabled ? 'disabled' : ''
            }`}
          >
            {day.date.getDate()}
          </button>
        ))}
      </div>

      {startDate && endDate && (
        <div className="calendar-summary">
          <div className="date-range-summary">
            {new Date(startDate).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            })} - {new Date(endDate).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            })}
          </div>
          <div className="trip-duration">
            {getDuration()} trip
          </div>
        </div>
      )}
    </div>
  );
};