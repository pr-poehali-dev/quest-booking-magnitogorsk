import React from "react";
import { Booking } from "@/types/booking";
import TimeSlotButton from "./TimeSlotButton";

interface QuestTabContentProps {
  questType: string;
  times: string[];
  bookings: Booking[];
  selectedDate: Date | undefined;
  onOpenEditDialog: (booking: Booking) => void;
}

const QuestTabContent: React.FC<QuestTabContentProps> = ({
  questType,
  times,
  bookings,
  selectedDate,
  onOpenEditDialog
}) => {
  // Фильтрация бронирований для выбранного квеста
  const questBookings = bookings.filter(booking => booking.questType === questType);
  
  // Отображение времени для выбранной даты
  return (
    <div>
      <h3 className="text-lg font-bold mb-4 text-yellow-400">
        {questType === 'danger' ? 'Опасная зона' : 'В поисках артефакта'}
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {times.map((time) => (
          <TimeSlotButton
            key={time}
            time={time}
            selectedDate={selectedDate}
            bookings={questBookings}
            questType={questType}
            onOpenEditDialog={onOpenEditDialog}
          />
        ))}
      </div>
      
      {/* Статистика бронирований */}
      {selectedDate && (
        <div className="mt-4 text-sm text-orange-400">
          <p>
            Занято: {questBookings.filter(b => 
              b.date.toDateString() === selectedDate?.toDateString()
            ).length} из {times.length} слотов
          </p>
        </div>
      )}
    </div>
  );
};

export default QuestTabContent;
