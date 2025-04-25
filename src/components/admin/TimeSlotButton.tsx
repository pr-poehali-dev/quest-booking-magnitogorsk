import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import bookingService from '@/lib/bookingService';

interface TimeSlotButtonProps {
  time: string;
  date: string;
  questId: string;
  onSelect: (time: string) => void;
  selectedTime: string | null;
}

const TimeSlotButton: React.FC<TimeSlotButtonProps> = ({
  time,
  date,
  questId,
  onSelect,
  selectedTime,
}) => {
  // Проверяем, доступен ли этот временной слот для данного квеста
  const isAvailable = bookingService.isTimeSlotAvailable(date, time, questId);
  
  // Проверяем, забронирован ли этот слот на другом квесте
  const isBookedOnOtherQuest = !isAvailable && 
    bookingService.isTimeBookedOnAnyQuest(date, time) && 
    !bookingService.getBookingsByDate(date).some(b => b.time === time && b.questId === questId);

  // Проверяем, выбран ли этот временной слот
  const isSelected = selectedTime === time;

  const getButtonVariant = () => {
    if (isSelected) return 'default'; // Выбранное время
    if (!isAvailable) {
      if (isBookedOnOtherQuest) return 'outline'; // Занято на другом квесте
      return 'destructive'; // Занято на этом квесте
    }
    return 'secondary'; // Доступно
  };

  const getButtonClass = () => {
    let classes = 'w-full text-sm transition-all';
    
    if (isSelected) {
      classes += ' bg-green-600 hover:bg-green-700 text-white border-2 border-white';
    } else if (!isAvailable) {
      if (isBookedOnOtherQuest) {
        classes += ' bg-yellow-600/40 text-yellow-300 border border-yellow-300 cursor-not-allowed';
      } else {
        classes += ' bg-red-800/70 text-red-300 border border-red-500 cursor-not-allowed';
      }
    } else {
      classes += ' bg-gray-800 text-white hover:bg-gray-700 hover:text-yellow-300';
    }
    
    return classes;
  };

  const getButtonLabel = () => {
    if (isBookedOnOtherQuest) {
      return `${time} (занято на другом квесте)`;
    }
    return time;
  };

  const handleClick = () => {
    if (isAvailable) {
      onSelect(time);
    }
  };

  return (
    <Button
      variant={getButtonVariant() as any}
      className={cn(getButtonClass())}
      onClick={handleClick}
      disabled={!isAvailable}
    >
      {getButtonLabel()}
    </Button>
  );
};

export default TimeSlotButton;
