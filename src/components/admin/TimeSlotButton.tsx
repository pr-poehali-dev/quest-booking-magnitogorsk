import React from "react";
import { Button } from "@/components/ui/button";
import { Booking } from "@/types/booking";
import bookingService from "@/lib/bookingService";

interface TimeSlotButtonProps {
  time: string;
  selectedDate: Date | undefined;
  bookings: Booking[];
  questType: string;
  onOpenEditDialog: (booking: Booking) => void;
}

const TimeSlotButton: React.FC<TimeSlotButtonProps> = ({
  time,
  selectedDate,
  bookings,
  questType,
  onOpenEditDialog,
}) => {
  if (!selectedDate) return null;

  // Проверка, заблокирована ли дата полностью
  const blockedDates = bookingService.getBlockedDates();
  const isDateBlocked = blockedDates.some(
    (date) => date.toDateString() === selectedDate.toDateString()
  );

  // Проверка, прошло ли уже время или менее часа до начала
  const isTimePassed = !bookingService.isTimeAvailable(selectedDate, time);

  // Найти бронирование для данного времени и даты
  const booking = bookings.find(
    (b) =>
      b.date.toDateString() === selectedDate.toDateString() &&
      b.time === time &&
      b.questType === questType
  );

  // Проверить, занято ли время на других квестах
  const isTimeBookedOnOtherQuest = bookings.some(
    (b) =>
      b.date.toDateString() === selectedDate.toDateString() &&
      b.time === time &&
      b.questType !== questType
  );

  // Определение состояния кнопки
  let buttonVariant: "default" | "outline" | "destructive" | "ghost" | "link" | "secondary" | null | undefined;
  let buttonText: string;
  let buttonDisabled: boolean = false;

  if (isDateBlocked) {
    buttonVariant = "ghost";
    buttonText = "Заблокировано";
    buttonDisabled = true;
  } else if (isTimePassed) {
    buttonVariant = "ghost";
    buttonText = "Недоступно";
    buttonDisabled = true;
  } else if (booking) {
    if (booking.status === "confirmed") {
      buttonVariant = "destructive"; // Красная кнопка для подтвержденных броней
      buttonText = `${booking.name} ✓`;
    } else {
      buttonVariant = "secondary"; // Желтая кнопка для ожидающих броней
      buttonText = `${booking.name} ⌛`;
    }
  } else if (isTimeBookedOnOtherQuest) {
    buttonVariant = "ghost";
    buttonText = "Занято на другом квесте";
    buttonDisabled = true;
  } else {
    buttonVariant = "outline";
    buttonText = "Свободно";
  }

  return (
    <Button
      variant={buttonVariant}
      className={`w-full h-12 text-sm ${
        booking
          ? booking.status === "confirmed"
            ? "bg-green-700 hover:bg-green-800 text-white"
            : "bg-yellow-600 hover:bg-yellow-700 text-black"
          : isTimeBookedOnOtherQuest
            ? "bg-gray-700 hover:bg-gray-800 text-gray-300"
            : "text-gray-100 hover:bg-yellow-900/20"
      }`}
      disabled={buttonDisabled}
      onClick={() => {
        if (booking) {
          onOpenEditDialog(booking);
        }
      }}
    >
      {time} - {buttonText}
    </Button>
  );
};

export default TimeSlotButton;
