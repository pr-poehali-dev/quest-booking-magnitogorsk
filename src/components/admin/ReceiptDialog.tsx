import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Booking } from "@/types/booking";

interface ReceiptDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  booking: Booking | null;
  editedBooking: Partial<Booking>;
  onSave: () => void;
}

const ReceiptDialog: React.FC<ReceiptDialogProps> = ({
  open,
  setOpen,
  booking,
  editedBooking,
  onSave
}) => {
  if (!booking) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-white border-2 border-black text-black max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">ЧЕК</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4 border-t border-b border-dashed border-black my-2">
          <div className="text-center text-lg font-bold">
            Check_Out — Квесты в МГН
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-bold">Квест:</span> 
              <span>{booking.questType === 'danger' ? 'Опасная зона' : 'В поисках артефакта'}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="font-bold">Дата:</span> 
              <span>{booking.date.toLocaleDateString()}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="font-bold">Время:</span> 
              <span>{booking.time}</span>
            </div>
            
            {editedBooking.age && (
              <div className="flex justify-between">
                <span className="font-bold">Возраст:</span> 
                <span>{editedBooking.age}</span>
              </div>
            )}
            
            {editedBooking.peopleCount && (
              <div className="flex justify-between">
                <span className="font-bold">Количество игроков:</span> 
                <span>{editedBooking.peopleCount}</span>
              </div>
            )}
            
            {editedBooking.payment && (
              <div className="flex justify-between">
                <span className="font-bold">Общая сумма:</span> 
                <span>{editedBooking.payment} ₽</span>
              </div>
            )}
            
            {editedBooking.prepayment && (
              <div className="flex justify-between">
                <span className="font-bold">Предоплата:</span> 
                <span>{editedBooking.prepayment} ₽</span>
              </div>
            )}
            
            {editedBooking.teaZone && (
              <div className="flex justify-between">
                <span className="font-bold">Аренда чайной зоны (1ч):</span> 
                <span>1000 ₽</span>
              </div>
            )}
          </div>
          
          <div className="text-center border-t border-dashed border-black pt-2">
            <p>Спасибо за бронирование!</p>
            <p>Ждем вас по адресу: [Адрес квеста]</p>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            onClick={onSave} 
            className="bg-black hover:bg-gray-800 text-white font-bold"
          >
            Сохранить в галерею
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReceiptDialog;
