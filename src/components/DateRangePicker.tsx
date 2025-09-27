import React from 'react';

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onChange: (startDate: string, endDate: string) => void;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onChange
}) => {
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = e.target.value;
    // If end date is before new start date, clear it
    if (endDate && new Date(endDate) < new Date(newStartDate)) {
      onChange(newStartDate, '');
    } else {
      onChange(newStartDate, endDate);
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(startDate, e.target.value);
  };

  const getMinEndDate = () => {
    if (!startDate) return '';
    const start = new Date(startDate);
    start.setDate(start.getDate() + 1); // Minimum 2 day trip
    return start.toISOString().split('T')[0];
  };

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 2); // Allow booking up to 2 years ahead
    return maxDate.toISOString().split('T')[0];
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getDuration = () => {
    if (!startDate || !endDate) return '';
    const days = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return `${days} day${days !== 1 ? 's' : ''}`;
  };

  return (
    <div className="date-range-picker">
      <div className="date-range-inputs">
        <div className="date-input-group">
          <label htmlFor="start-date">Start Date</label>
          <input
            id="start-date"
            type="date"
            value={startDate}
            onChange={handleStartDateChange}
            min={getTodayDate()}
            max={getMaxDate()}
            className="date-input"
          />
          {startDate && (
            <span className="date-display">{formatDate(startDate)}</span>
          )}
        </div>
        <div className="date-input-group">
          <label htmlFor="end-date">End Date</label>
          <input
            id="end-date"
            type="date"
            value={endDate}
            onChange={handleEndDateChange}
            min={getMinEndDate()}
            max={getMaxDate()}
            disabled={!startDate}
            className="date-input"
          />
          {endDate && (
            <span className="date-display">{formatDate(endDate)}</span>
          )}
        </div>
      </div>
      {startDate && endDate && (
        <div className="date-duration">
          {getDuration()} trip
        </div>
      )}
    </div>
  );
};