import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DualCalendarProps {
  startDate: string;
  endDate: string;
  onChange: (startDate: string, endDate: string) => void;
}

export const DualCalendar: React.FC<DualCalendarProps> = ({
  startDate,
  endDate,
  onChange
}) => {
  const [leftMonth, setLeftMonth] = useState(() => {
    const date = startDate ? new Date(startDate) : new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1);
  });

  const [rightMonth, setRightMonth] = useState(() => {
    const date = startDate ? new Date(startDate) : new Date();
    const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
    return nextMonth;
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getCalendarDays = (month: Date) => {
    const year = month.getFullYear();
    const monthIndex = month.getMonth();

    const firstDay = new Date(year, monthIndex, 1);
    const lastDay = new Date(year, monthIndex + 1, 0);

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

  const handleDateClick = (date: Date, calendarSide: 'left' | 'right') => {
    if (date < today) return;

    const dateStr = date.toISOString().split('T')[0];

    if (calendarSide === 'left') {
      // Left calendar is for departure date
      if (endDate && date >= new Date(endDate)) {
        // If departure is after return, clear return date
        onChange(dateStr, '');
      } else {
        onChange(dateStr, endDate);
      }
    } else {
      // Right calendar is for return date
      if (startDate && date >= new Date(startDate)) {
        onChange(startDate, dateStr);
      } else if (!startDate) {
        // If no start date set, set this as start date
        onChange(dateStr, '');
      }
    }
  };

  const navigateMonth = (direction: 'prev' | 'next', calendar: 'left' | 'right') => {
    if (calendar === 'left') {
      setLeftMonth(prev => {
        const newMonth = new Date(prev);
        if (direction === 'prev') {
          newMonth.setMonth(prev.getMonth() - 1);
        } else {
          newMonth.setMonth(prev.getMonth() + 1);
        }
        return newMonth;
      });
    } else {
      setRightMonth(prev => {
        const newMonth = new Date(prev);
        if (direction === 'prev') {
          newMonth.setMonth(prev.getMonth() - 1);
        } else {
          newMonth.setMonth(prev.getMonth() + 1);
        }
        return newMonth;
      });
    }
  };

  const getMonthName = (month: Date) => {
    return month.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

  const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const leftCalendarDays = getCalendarDays(leftMonth);
  const rightCalendarDays = getCalendarDays(rightMonth);

  const getDuration = () => {
    if (!startDate || !endDate) return '';
    const days = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return `${days} day${days !== 1 ? 's' : ''}`;
  };

  return (
    <div className="dual-calendar">
      <div className="dual-calendar-container">
        {/* Left Calendar - Departure */}
        <div className="mini-calendar">
          <div className="mini-calendar-header">
            <button
              type="button"
              onClick={() => navigateMonth('prev', 'left')}
              className="mini-calendar-nav-btn"
            >
              <ChevronLeft className="mini-calendar-nav-icon" />
            </button>
            <h4 className="mini-calendar-title">Departure</h4>
            <button
              type="button"
              onClick={() => navigateMonth('next', 'left')}
              className="mini-calendar-nav-btn"
            >
              <ChevronRight className="mini-calendar-nav-icon" />
            </button>
          </div>
          <div className="mini-calendar-month">{getMonthName(leftMonth)}</div>

          <div className="mini-calendar-weekdays">
            {weekdays.map(day => (
              <div key={day} className="mini-calendar-weekday">
                {day}
              </div>
            ))}
          </div>

          <div className="mini-calendar-grid">
            {leftCalendarDays.map((day, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleDateClick(day.date, 'left')}
                disabled={day.isDisabled}
                className={`mini-calendar-day ${
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
        </div>

        {/* Right Calendar - Return */}
        <div className="mini-calendar">
          <div className="mini-calendar-header">
            <button
              type="button"
              onClick={() => navigateMonth('prev', 'right')}
              className="mini-calendar-nav-btn"
            >
              <ChevronLeft className="mini-calendar-nav-icon" />
            </button>
            <h4 className="mini-calendar-title">Return</h4>
            <button
              type="button"
              onClick={() => navigateMonth('next', 'right')}
              className="mini-calendar-nav-btn"
            >
              <ChevronRight className="mini-calendar-nav-icon" />
            </button>
          </div>
          <div className="mini-calendar-month">{getMonthName(rightMonth)}</div>

          <div className="mini-calendar-weekdays">
            {weekdays.map(day => (
              <div key={day} className="mini-calendar-weekday">
                {day}
              </div>
            ))}
          </div>

          <div className="mini-calendar-grid">
            {rightCalendarDays.map((day, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleDateClick(day.date, 'right')}
                disabled={day.isDisabled}
                className={`mini-calendar-day ${
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
        </div>
      </div>

      {startDate && endDate && (
        <div className="dual-calendar-summary">
          <div className="dual-date-range-summary">
            {new Date(startDate).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            })} → {new Date(endDate).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            })}
          </div>
          <div className="dual-trip-duration">
            {getDuration()} trip
          </div>
        </div>
      )}
    </div>
  );
};