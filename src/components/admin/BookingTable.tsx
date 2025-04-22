import React from "react";
import { Button } from "@/components/ui/button";
import { Booking } from "@/types/booking";

interface BookingTableProps {
  bookings: Booking[];
  selectedDate: Date | undefined;
  onOpenEditDialog: (booking: Booking) => void;
}

const BookingTable: React.FC<BookingTableProps> = ({
  bookings,
  selectedDate,
  onOpenEditDialog
}) => {
  const getBookingsForDate = () => {
    if (!selectedDate) return [];
    return bookings.filter(booking => 
      booking.date.toDateString() === selectedDate.toDateString()
    );
  };

  const dateBookings = getBookingsForDate();

  if (dateBookings.length === 0) {
    return <p className="text-orange-400">Нет броней на выбранную дату</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-orange-400">
        <thead className="text-yellow-400 border-b border-yellow-400">
          <tr>
            <th className="py-2 px-3">Квест</th>
            <th className="py-2 px-3">Время</th>
            <th className="py-2 px-3">Имя</th>
            <th className="py-2 px-3">Телефон</th>
            <th className="py-2 px-3">Статус</th>
            <th className="py-2 px-3">Действия</th>
          </tr>
        </thead>
        <tbody>
          {dateBookings.map((booking) => (
            <tr key={booking.id} className="border-b border-yellow-900/30">
              <td className="py-2 px-3">
                {booking.questType === 'danger' ? 'Опасная зона' : 'Артефакт'}
              </td>
              <td className="py-2 px-3">{booking.time}</td>
              <td className="py-2 px-3">{booking.name}</td>
              <td className="py-2 px-3">{booking.phone}</td>
              <td className="py-2 px-3">
                <span className={`px-2 py-1 rounded text-sm ${
                  booking.status === 'confirmed' 
                    ? 'bg-green-900/30 text-green-400' 
                    : 'bg-yellow-900/30 text-yellow-400'
                }`}>
                  {booking.status === 'confirmed' ? 'Подтверждено' : 'В ожидании'}
                </span>
              </td>
              <td className="py-2 px-3">
                <Button 
                  size="sm" 
                  onClick={() => onOpenEditDialog(booking)}
                  className="bg-yellow-600 hover:bg-yellow-700 text-black"
                >
                  Редактировать
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingTable;
