import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { LockOpen } from "lucide-react";

interface BookingCalendarProps {
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  blockedDates?: Date[];
  onUnblockDate?: (date: Date) => void;
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({
  selectedDate,
  setSelectedDate,
  blockedDates = [],
  onUnblockDate
}) => {
  // Преобразование дат в строки для сравнения
  const blockedDatesStrings = blockedDates.map(date => date.toDateString());
  
  // Проверка, заблокирована ли дата
  const isDateBlocked = (date: Date) => {
    return blockedDatesStrings.includes(date.toDateString());
  };
  
  // Разблокировка даты
  const handleUnblockDate = () => {
    if (selectedDate && onUnblockDate && isDateBlocked(selectedDate)) {
      onUnblockDate(selectedDate);
    }
  };

  return (
    <div className="bg-black/80 p-4 rounded-lg border-2 border-yellow-400">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-yellow-400">Календарь</h2>
        
        {selectedDate && isDateBlocked(selectedDate) && onUnblockDate && (
          <Button
            variant="outline"
            size="sm"
            className="text-yellow-400 border-yellow-400 hover:bg-yellow-900 flex items-center"
            onClick={handleUnblockDate}
          >
            <LockOpen className="h-4 w-4 mr-1" />
            Разблокировать
          </Button>
        )}
      </div>
      
      <div className="text-center mb-4">
        {selectedDate && (
          <div className="text-orange-400 font-bold">
            {format(selectedDate, "d MMMM yyyy", { locale: ru })}
          </div>
        )}
      </div>
      
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        locale={ru}
        className="border-yellow-500"
        modifiers={{
          blocked: blockedDates
        }}
        modifiersStyles={{
          blocked: { 
            color: "#ef4444", 
            textDecoration: "line-through",
            backgroundColor: "rgba(127, 29, 29, 0.15)" 
          }
        }}
        styles={{
          caption: { color: "#f59e0b" },
          day_today: { fontWeight: "bold", borderColor: "#f59e0b", borderWidth: "1px" },
          day_selected: { 
            backgroundColor: "#f59e0b", 
            color: "#000",
            fontWeight: "bold"
          },
          day: {
            fontSize: "1rem",  // Увеличенный размер шрифта
            width: "2.75rem",  // Увеличенная ширина ячейки
            height: "2.75rem", // Увеличенная высота ячейки
            margin: "0.1rem", // Уменьшенный отступ для компактности
          },
          head_cell: {
            fontSize: "0.9rem", // Увеличенный размер шрифта для заголовков
            color: "#f59e0b",
            width: "2.75rem", // Соответствие ширине ячейки
          },
          monthSelect: {
            color: "#f59e0b"
          },
          yearSelect: {
            color: "#f59e0b"
          },
          nav_button: {
            color: "#f59e0b"
          },
          cell: {
            padding: "0.1rem" // Уменьшенный внутренний отступ
          },
          row: {
            margin: "0.25rem 0" // Уменьшенный вертикальный отступ
          }
        }}
        classNames={{
          caption: "font-medium text-yellow-400",
          day: cn(
            "h-12 w-12 text-lg font-medium aria-selected:opacity-100 hover:bg-yellow-900/40 rounded-md"
          ),
          day_disabled: "text-gray-500 opacity-50",
          day_range_middle: "aria-selected:bg-yellow-800",
          day_range_end: "aria-selected:bg-yellow-600",
          day_range_start: "aria-selected:bg-yellow-600",
          day_selected: "bg-yellow-500 text-black hover:bg-yellow-600 hover:text-black focus:bg-yellow-600 focus:text-black",
          day_today: "bg-yellow-800/20 text-yellow-300 border border-yellow-400",
          nav_button: "hover:bg-yellow-900 text-yellow-400",
          nav_button_previous: "absolute left-1",
          nav_button_next: "absolute right-1",
          table: "w-full border-collapse",
        }}
      />
    </div>
  );
};

export default BookingCalendar;
