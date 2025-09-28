import React, { useState } from 'react';
import { BookingOption } from '../types';
import { ExternalLink, Bed, Plane, GraduationCap, Package, MapPin, Clock, DollarSign } from 'lucide-react';
import { analyticsService } from '../services/analyticsService';

interface BookingOptionsProps {
  options: BookingOption[];
  destinationId: string;
  destinationName: string;
  travelDates?: {
    startDate: string;
    endDate: string;
  };
  searchContext: any; // SurfPreferences
  className?: string;
}

const getBookingIcon = (type: BookingOption['type']) => {
  switch (type) {
    case 'accommodation':
      return <Bed className="w-4 h-4" />;
    case 'flights':
      return <Plane className="w-4 h-4" />;
    case 'surf-lessons':
      return <GraduationCap className="w-4 h-4" />;
    case 'equipment-rental':
      return <Package className="w-4 h-4" />;
    default:
      return <ExternalLink className="w-4 h-4" />;
  }
};

const getBookingTypeLabel = (type: BookingOption['type']) => {
  switch (type) {
    case 'accommodation':
      return 'Accommodation';
    case 'flights':
      return 'Flights';
    case 'surf-lessons':
      return 'Surf Lessons';
    case 'equipment-rental':
      return 'Equipment Rental';
    default:
      return 'Booking';
  }
};

const getBookingDescription = (type: BookingOption['type'], provider: string) => {
  switch (type) {
    case 'accommodation':
      return `Find hotels, hostels, and surf camps near ${provider}`;
    case 'flights':
      return `Compare flight prices and times`;
    case 'surf-lessons':
      return `Book lessons with certified instructors`;
    case 'equipment-rental':
      return `Rent boards, wetsuits, and gear locally`;
    default:
      return `Book through ${provider}`;
  }
};

const generateBookingUrl = (option: BookingOption, destinationName: string, dates?: { startDate: string; endDate: string }) => {
  let url = option.url;

  // For accommodation bookings, add location and dates if available
  if (option.type === 'accommodation' && dates) {
    const checkin = new Date(dates.startDate).toISOString().split('T')[0];
    const checkout = new Date(dates.endDate).toISOString().split('T')[0];

    if (option.provider === 'Booking.com') {
      url += `&checkin=${checkin}&checkout=${checkout}`;
    } else if (option.provider === 'Airbnb') {
      url += `&checkin=${checkin}&checkout=${checkout}`;
    }
  }

  // For flight bookings, could add departure date
  if (option.type === 'flights' && dates) {
    // This would integrate with flight APIs in production
  }

  return url;
};

export const BookingOptions: React.FC<BookingOptionsProps> = ({
  options,
  destinationId,
  destinationName,
  travelDates,
  searchContext,
  className = ""
}) => {
  const [loadingBooking, setLoadingBooking] = useState<string | null>(null);

  const handleBookingClick = async (option: BookingOption) => {
    setLoadingBooking(option.provider);

    // Track the booking click
    analyticsService.trackBookingClick(
      destinationId,
      option.type,
      option.provider,
      searchContext
    );

    // Generate the appropriate URL
    const bookingUrl = generateBookingUrl(option, destinationName, travelDates);

    // Small delay to show loading state
    setTimeout(() => {
      window.open(bookingUrl, '_blank', 'noopener,noreferrer');
      setLoadingBooking(null);
    }, 500);
  };

  const groupedOptions = options.reduce((groups, option) => {
    if (!groups[option.type]) {
      groups[option.type] = [];
    }
    groups[option.type].push(option);
    return groups;
  }, {} as Record<string, BookingOption[]>);

  return (
    <div className={`booking-options ${className}`}>
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="w-4 h-4 text-blue-600" />
          <h3 className="font-semibold text-gray-800">Book Your Trip</h3>
        </div>
        <p className="text-sm text-gray-600">
          Compare prices and book directly with trusted partners
        </p>
      </div>

      <div className="space-y-4">
        {Object.entries(groupedOptions).map(([type, typeOptions]) => (
          <div key={type} className="booking-type-group">
            <h4 className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              {getBookingIcon(type as BookingOption['type'])}
              {getBookingTypeLabel(type as BookingOption['type'])}
            </h4>

            <div className="grid gap-2">
              {typeOptions.map((option, index) => (
                <button
                  key={`${option.provider}-${index}`}
                  onClick={() => handleBookingClick(option)}
                  disabled={loadingBooking === option.provider}
                  className="booking-option-card flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 text-left disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-800">
                        {option.provider}
                      </span>
                      {option.estimatedPrice && (
                        <span className="flex items-center gap-1 text-sm text-green-600 font-medium">
                          <DollarSign className="w-3 h-3" />
                          from ${option.estimatedPrice}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {getBookingDescription(option.type, option.provider)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-blue-600">
                    {loadingBooking === option.provider ? (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 animate-spin" />
                        <span className="text-sm">Opening...</span>
                      </div>
                    ) : (
                      <>
                        <span className="text-sm font-medium">Compare</span>
                        <ExternalLink className="w-4 h-4" />
                      </>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Commission disclaimer */}
      <div className="mt-4 p-3 bg-gray-50 rounded-md">
        <p className="text-xs text-gray-500">
          <strong>Note:</strong> Find A Wave may receive a commission from bookings made through these partners.
          This helps us keep our recommendations free and independent. Prices shown are estimates and may vary.
        </p>
      </div>

      {/* Quick booking summary for multi-destination trips */}
      {travelDates && (
        <div className="mt-4 p-3 bg-blue-50 rounded-md">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Your Trip Dates</span>
          </div>
          <p className="text-sm text-blue-700">
            {new Date(travelDates.startDate).toLocaleDateString()} - {new Date(travelDates.endDate).toLocaleDateString()}
          </p>
          <p className="text-xs text-blue-600 mt-1">
            Booking links are pre-filled with your travel dates where possible
          </p>
        </div>
      )}
    </div>
  );
};