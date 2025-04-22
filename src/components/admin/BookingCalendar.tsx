import React from "react";
import { Calendar } from "@/components/ui/calendar";

interface BookingCalendarProps {
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({ 
  selectedDate, 
  setSelectedDate 
}) => {
  return (
    <div className="bg-black/80 p-4 rounded-lg border-2 border-yellow-400">
      <h2 className="text-xl font-bold mb-4 text-yellow-400">Выберите дату</h2>
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        className="border-yellow-400 bg-black/90 rounded-md text-orange-400"
      />
    </div>
  );
};

export default BookingCalendar;
