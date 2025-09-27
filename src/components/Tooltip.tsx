import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle } from 'lucide-react';

interface TooltipProps {
  content: string;
  children?: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && triggerRef.current) {
      // Small delay to ensure tooltip is rendered
      const timer = setTimeout(() => {
        if (triggerRef.current && tooltipRef.current) {
          const containerRect = triggerRef.current.getBoundingClientRect();
          const tooltipRect = tooltipRef.current.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          const viewportWidth = window.innerWidth;

          // Calculate available space above and below
          const spaceAbove = containerRect.top;
          const spaceBelow = viewportHeight - containerRect.bottom;
          const tooltipMaxHeight = 200; // Match CSS max-height

          // Position above the trigger, centered horizontally
          let top = -Math.min(tooltipRect.height, tooltipMaxHeight) - 10;
          let left = (containerRect.width / 2) - (tooltipRect.width / 2);

          // If not enough space above, show below instead
          if (spaceAbove < tooltipMaxHeight + 20) {
            top = containerRect.height + 10;
          }

          // Adjust horizontal position if tooltip goes off-screen
          const triggerLeft = containerRect.left;

          if (triggerLeft + left < 10) {
            left = 10 - triggerLeft;
          } else if (triggerLeft + left + tooltipRect.width > viewportWidth - 10) {
            left = viewportWidth - 10 - triggerLeft - tooltipRect.width;
          }

          setPosition({ top, left });
        }
      }, 10);

      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  const handleMouseEnter = () => {
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  return (
    <div className="tooltip-container">
      <div
        ref={triggerRef}
        className="tooltip-trigger"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children || <HelpCircle className="help-icon" />}
      </div>
      {isVisible && (
        <div
          ref={tooltipRef}
          className="tooltip-content"
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
            visibility: position.top === 0 && position.left === 0 ? 'hidden' : 'visible'
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
};