import React, { useState } from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface BookingCalendarPickerProps {
  onDateSelect: (date: Date | undefined) => void;
  selectedDate: Date | undefined;
  blockedDates?: Date[];
  className?: string;
}

const BookingCalendarPicker: React.FC<BookingCalendarPickerProps> = ({ 
  onDateSelect, 
  selectedDate,
  blockedDates = [],
  className
}) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const isDateBlocked = (date: Date) => {
    return blockedDates.some(blockedDate => 
      format(blockedDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  const isPastDate = (date: Date) => {
    return date < today;
  };

  return (
    <div className={cn("caution-border p-6 bg-black/80 rounded-lg", className)}>
      <h3 className="text-xl font-bold text-yellow-neon mb-4 text-outline">
        Выберите дату
      </h3>
      
      <div className="relative">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onDateSelect}
          className="border-yellow-400 bg-black/90 rounded-md"
          classNames={{
            day_selected: "bg-yellow-600 text-black hover:bg-yellow-500 hover:text-black focus:bg-yellow-600 focus:text-black",
            day_today: "bg-orange-800/20 text-orange-bright border border-orange-bright",
            day: cn(
              "text-orange-400 focus-visible:bg-yellow-600/50 hover:bg-yellow-600/50",
              "aria-selected:opacity-100"
            ),
            day_disabled: "text-red-500 line-through opacity-50 cursor-not-allowed",
            day_range_middle: "aria-selected:bg-yellow-600 aria-selected:text-black",
            day_hidden: "invisible",
            caption: "text-yellow-400",
            caption_label: "text-yellow-bright font-bold",
            nav_button: "text-yellow-400 hover:bg-yellow-600/20 hover:text-yellow-bright",
            table: "border-collapse space-y-1",
            head_cell: "text-orange-bright font-bold text-center",
            cell: "p-0 relative [&:has([aria-selected])]:bg-yellow-600/20",
            root: "max-w-full bg-black/70 border border-yellow-400 shadow-lg rounded-md p-3"
          }}
          disabled={(date) => isPastDate(date) || isDateBlocked(date)}
          locale={ru}
        />
        
        {/* Индикатор занятых дат */}
        <div className="mt-4 flex items-center text-sm text-yellow-400">
          <div className="w-4 h-4 rounded-full bg-red-500 opacity-50 mr-2"></div>
          <span>Недоступная дата</span>
        </div>
      </div>
      
      {selectedDate && (
        <div className="mt-4 p-3 bg-yellow-600/20 border border-yellow-400 rounded-md">
          <p className="text-center text-yellow-bright font-bold">
            Выбрано: {format(selectedDate, 'dd MMMM yyyy', { locale: ru })}
          </p>
        </div>
      )}
    </div>
  );
};

export default BookingCalendarPicker;
