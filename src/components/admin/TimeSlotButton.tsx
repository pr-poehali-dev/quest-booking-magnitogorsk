import React from "react";
import { Button } from "@/components/ui/button";
import { Booking } from "@/types/booking";

interface TimeSlotButtonProps {
  time: string;
  questType: 'danger' | 'artifact';
  bookings: Booking[];
  selectedDate: Date | undefined;
  onOpenEditDialog: (booking: Booking) => void;
}

const TimeSlotButton: React.FC<TimeSlotButtonProps> = ({
  time,
  questType,
  bookings,
  selectedDate,
  onOpenEditDialog
}) => {
  const getBookingsForTime = () => {
    if (!selectedDate) return [];
    return bookings.filter(booking => 
      booking.date.toDateString() === selectedDate.toDateString() && 
      booking.time === time &&
      booking.questType === questType
    );
  };

  const timeBookings = getBookingsForTime();
  const hasBooking = timeBookings.length > 0;
  const booking = timeBookings[0];

  return (
    <div className="text-center">
      <Button
        onClick={() => hasBooking && onOpenEditDialog(booking)}
        variant="outline"
        className={`w-full h-16 text-lg font-bold mb-2 border-2 ${
          hasBooking 
            ? booking.status === 'confirmed'
              ? 'bg-green-900/30 text-green-400 border-green-500'
              : 'bg-yellow-900/30 text-yellow-400 border-yellow-500'
            : 'text-gray-500 border-gray-500'
        }`}
      >
        {time}
        {hasBooking && booking.teaZone && <span className="ml-2 text-blue-400">С</span>}
        {hasBooking && booking.status === 'confirmed' && 
          <span className="ml-2 text-green-400">✓</span>
        }
      </Button>
    </div>
  );
};

export default TimeSlotButton;
