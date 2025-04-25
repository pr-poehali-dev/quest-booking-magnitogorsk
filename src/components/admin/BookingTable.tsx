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

  // Функция для форматирования телефона
  const formatPhone = (phone: string) => {
    // Если телефон уже отформатирован, возвращаем как есть
    if (phone.includes("(") || phone.includes("-")) return phone;
    
    // Удаляем все нецифровые символы
    const cleaned = phone.replace(/\D/g, "");
    
    // Проверяем длину и форматируем
    if (cleaned.length === 11) {
      return `+${cleaned[0]} (${cleaned.substring(1, 4)}) ${cleaned.substring(4, 7)}-${cleaned.substring(7, 9)}-${cleaned.substring(9, 11)}`;
    }
    
    // Возвращаем исходный номер, если не удалось отформатировать
    return phone;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-orange-400">
        <thead className="text-yellow-400 border-b border-yellow-400">
          <tr>
            <th className="py-2 px-3">Квест</th>
            <th className="py-2 px-3">Время</th>
            <th className="py-2 px-3">Имя</th>
            <th className="py-2 px-3">Телефон</th>
            <th className="py-2 px-3">Человек</th>
            <th className="py-2 px-3">Возраст</th>
            <th className="py-2 px-3">Оплата</th>
            <th className="py-2 px-3">Чай</th>
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
              <td className="py-2 px-3">
                <a href={`tel:${booking.phone}`} className="underline hover:text-yellow-400">
                  {formatPhone(booking.phone)}
                </a>
              </td>
              <td className="py-2 px-3">{booking.peopleCount || '—'}</td>
              <td className="py-2 px-3">{booking.age || '—'}</td>
              <td className="py-2 px-3">
                {booking.payment ? (
                  <span>
                    {booking.prepayment && `${booking.prepayment}₽ + `}
                    {booking.payment}₽
                  </span>
                ) : '—'}
              </td>
              <td className="py-2 px-3">
                {booking.teaZone ? '✓' : '—'}
              </td>
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

      {/* Подробная информация о примечаниях */}
      <div className="mt-4 space-y-2">
        {dateBookings.filter(b => b.notes).map((booking) => (
          <div key={`notes-${booking.id}`} className="bg-black/40 p-3 rounded-md">
            <div className="font-bold text-yellow-400">
              Примечания для {booking.name} ({booking.time}):
            </div>
            <div className="text-orange-300 mt-1">{booking.notes}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingTable;
