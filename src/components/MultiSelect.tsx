import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface MultiSelectProps {
  options: { value: string; label: string; icon?: string }[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select options..."
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOption = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue];
    onChange(newValue);
  };

  const getDisplayText = () => {
    if (value.length === 0) return placeholder;
    if (value.length === 1) {
      const option = options.find(opt => opt.value === value[0]);
      return option ? `${option.icon || ''} ${option.label}`.trim() : value[0];
    }
    return `${value.length} selected`;
  };

  return (
    <div className="multi-select">
      <div
        className="multi-select-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{getDisplayText()}</span>
        <ChevronDown className={`chevron ${isOpen ? 'open' : ''}`} />
      </div>

      {isOpen && (
        <div className="multi-select-dropdown">
          {options.map(option => (
            <label key={option.value} className="multi-select-option">
              <input
                type="checkbox"
                checked={value.includes(option.value)}
                onChange={() => toggleOption(option.value)}
              />
              <span className="checkmark"></span>
              <span className="option-content">
                {option.icon && <span className="option-icon">{option.icon}</span>}
                {option.label}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};