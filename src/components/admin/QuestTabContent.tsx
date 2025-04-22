import React from "react";
import TimeSlotButton from "./TimeSlotButton";
import { Booking } from "@/types/booking";

interface QuestTabContentProps {
  questType: 'danger' | 'artifact';
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
  return (
    <div className="mt-0">
      <h3 className="text-xl font-bold mb-4 text-yellow-400">
        {questType === 'danger' ? 'Опасная зона' : 'В поисках артефакта'}
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {times.map((time) => (
          <TimeSlotButton
            key={`${questType}-${time}`}
            time={time}
            questType={questType}
            bookings={bookings}
            selectedDate={selectedDate}
            onOpenEditDialog={onOpenEditDialog}
          />
        ))}
      </div>
    </div>
  );
};

export default QuestTabContent;
