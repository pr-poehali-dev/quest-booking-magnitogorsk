import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Booking } from "@/types/booking";

interface EditBookingDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedBooking: Booking | null;
  editedBooking: Partial<Booking>;
  setEditedBooking: (booking: Partial<Booking>) => void;
  onSave: () => void;
  onConfirm: (withReceipt: boolean) => void;
  onCancel: () => void;
}

const EditBookingDialog: React.FC<EditBookingDialogProps> = ({
  open,
  setOpen,
  selectedBooking,
  editedBooking,
  setEditedBooking,
  onSave,
  onConfirm,
  onCancel
}) => {
  if (!selectedBooking) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-black border-2 border-yellow-400 text-yellow-400 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {selectedBooking.status === 'confirmed' ? 'Редактирование подтвержденной брони' : 'Подтверждение брони'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-yellow-400">Имя клиента</Label>
              <Input 
                id="name" 
                value={editedBooking.name || ''} 
                onChange={(e) => setEditedBooking({...editedBooking, name: e.target.value})} 
                className="bg-black/50 border-yellow-400 text-orange-400"
                readOnly
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-yellow-400">Телефон</Label>
              <Input 
                id="phone" 
                value={editedBooking.phone || ''} 
                onChange={(e) => setEditedBooking({...editedBooking, phone: e.target.value})} 
                className="bg-black/50 border-yellow-400 text-orange-400"
                readOnly
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="age" className="text-yellow-400">Возраст</Label>
              <Input 
                id="age" 
                value={editedBooking.age || ''} 
                onChange={(e) => setEditedBooking({...editedBooking, age: e.target.value})} 
                className="bg-black/50 border-yellow-400 text-orange-400"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="peopleCount" className="text-yellow-400">Количество человек</Label>
              <Input 
                id="peopleCount" 
                type="number" 
                value={editedBooking.peopleCount || ''} 
                onChange={(e) => setEditedBooking({
                  ...editedBooking, 
                  peopleCount: parseInt(e.target.value) || undefined
                })} 
                className="bg-black/50 border-yellow-400 text-orange-400"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="prepayment" className="text-yellow-400">Предоплата (руб.)</Label>
              <Input 
                id="prepayment" 
                type="number" 
                value={editedBooking.prepayment || ''} 
                onChange={(e) => setEditedBooking({
                  ...editedBooking, 
                  prepayment: parseInt(e.target.value) || undefined
                })} 
                className="bg-black/50 border-yellow-400 text-orange-400"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="payment" className="text-yellow-400">Полная оплата (руб.)</Label>
              <Input 
                id="payment" 
                type="number" 
                value={editedBooking.payment || ''} 
                onChange={(e) => setEditedBooking({
                  ...editedBooking, 
                  payment: parseInt(e.target.value) || undefined
                })} 
                className="bg-black/50 border-yellow-400 text-orange-400"
              />
            </div>
            
            <div className="flex items-center space-x-2 mt-6">
              <Checkbox 
                id="teaZone" 
                checked={editedBooking.teaZone || false} 
                onCheckedChange={(checked) => 
                  setEditedBooking({...editedBooking, teaZone: checked as boolean})
                } 
                className="border-yellow-400 data-[state=checked]:bg-yellow-600"
              />
              <Label htmlFor="teaZone" className="text-yellow-400">Аренда чайной зоны</Label>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-yellow-400">Заметки</Label>
            <Input 
              id="notes" 
              value={editedBooking.notes || ''} 
              onChange={(e) => setEditedBooking({...editedBooking, notes: e.target.value})} 
              className="bg-black/50 border-yellow-400 text-orange-400"
            />
          </div>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          {selectedBooking.status !== 'confirmed' && (
            <>
              <Button 
                onClick={() => onConfirm(true)} 
                className="bg-green-600 hover:bg-green-700 text-black font-bold"
              >
                Подтвердить с чеком
              </Button>
              <Button 
                onClick={() => onConfirm(false)} 
                className="bg-blue-600 hover:bg-blue-700 text-black font-bold"
              >
                Подтвердить без чека
              </Button>
            </>
          )}
          <Button 
            onClick={onSave} 
            className="bg-yellow-600 hover:bg-yellow-700 text-black font-bold"
          >
            Сохранить
          </Button>
          <Button 
            onClick={onCancel} 
            variant="destructive"
          >
            Отменить бронь
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditBookingDialog;
