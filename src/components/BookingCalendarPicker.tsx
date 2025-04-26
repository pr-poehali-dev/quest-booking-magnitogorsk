import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { ru } from 'date-fns/locale';

interface BookingCalendarPickerProps {
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  blockedDates?: Date[];
}

const BookingCalendarPicker: React.FC<BookingCalendarPickerProps> = ({
  selectedDate,
  onDateSelect,
  blockedDates = []
}) => {
  // Проверка, заблокирована ли дата
  const isDateBlocked = (date: Date): boolean => {
    return blockedDates.some(blockedDate => 
      blockedDate.toDateString() === date.toDateString()
    );
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-yellow-400">Выберите дату</h2>
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={onDateSelect}
        className="border-yellow-400 bg-black/90 rounded-md"
        classNames={{
          day_selected: "bg-yellow-600 text-black hover:bg-yellow-500 hover:text-black focus:bg-yellow-600 focus:text-black",
          day_today: "bg-orange-800/20 text-orange-400 border border-orange-400",
          day: "text-orange-400 focus-visible:bg-yellow-600/50 hover:bg-yellow-600/50 aria-selected:opacity-100",
          day_disabled: "text-red-500 line-through opacity-50 cursor-not-allowed",
          day_range_middle: "aria-selected:bg-yellow-600 aria-selected:text-black",
          day_hidden: "invisible",
          caption: "text-yellow-400",
          caption_label: "text-yellow-400 font-bold",
          nav_button: "text-yellow-400 hover:bg-yellow-600/20 hover:text-yellow-400",
          table: "border-collapse space-y-1",
          head_cell: "text-orange-400 font-bold text-center",
          cell: "p-0 relative [&:has([aria-selected])]:bg-yellow-600/20",
          root: "max-w-full bg-black/70 border border-yellow-400 shadow-lg rounded-md p-3"
        }}
        disabled={(date) => {
          // Блокируем прошедшие даты и заблокированные даты
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return date < today || isDateBlocked(date);
        }}
        locale={ru}
      />
    </div>
  );
};

export default BookingCalendarPicker;
