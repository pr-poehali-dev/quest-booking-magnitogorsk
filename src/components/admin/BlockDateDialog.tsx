import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { format, isSameDay } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Textarea } from '@/components/ui/textarea';

interface BlockDateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onBlock: (dates: Date[], reason: string) => void;
  blockedDates: Date[];
}

const BlockDateDialog: React.FC<BlockDateDialogProps> = ({
  isOpen,
  onClose,
  onBlock,
  blockedDates
}) => {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [reason, setReason] = useState('');

  const handleDateSelect = (date: Date) => {
    const alreadySelected = selectedDates.some(d => isSameDay(d, date));
    
    if (alreadySelected) {
      setSelectedDates(selectedDates.filter(d => !isSameDay(d, date)));
    } else {
      setSelectedDates([...selectedDates, date]);
    }
  };

  const handleClose = () => {
    setSelectedDates([]);
    setReason('');
    onClose();
  };

  const handleBlockDates = () => {
    onBlock(selectedDates, reason);
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-black border-2 border-yellow-400 text-yellow-400 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Блокировка дат</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <p className="text-orange-400 text-sm">
            Выберите даты, которые необходимо заблокировать для бронирования
          </p>

          <Calendar
            mode="multiple"
            selected={selectedDates}
            onSelect={(dates) => setSelectedDates(dates || [])}
            className="border-yellow-400 bg-black/90 rounded-md"
            classNames={{
              day_selected: "bg-red-600 text-black hover:bg-red-500 hover:text-black focus:bg-red-600 focus:text-black",
              day_today: "bg-orange-800/20 text-orange-bright border border-orange-bright",
              day: "text-orange-400 focus-visible:bg-yellow-600/50 hover:bg-yellow-600/50 aria-selected:opacity-100",
              day_disabled: "opacity-50 line-through",
              day_range_middle: "aria-selected:bg-red-600 aria-selected:text-black",
              day_hidden: "invisible",
              caption: "text-yellow-400",
              caption_label: "text-yellow-bright font-bold",
              nav_button: "text-yellow-400 hover:bg-yellow-600/20 hover:text-yellow-bright",
              table: "border-collapse space-y-1",
              head_cell: "text-orange-bright font-bold text-center",
              cell: "p-0 relative [&:has([aria-selected])]:bg-red-600/20",
              root: "max-w-full bg-black/70 border border-yellow-400 shadow-lg rounded-md p-3"
            }}
            disabled={(date) => {
              // Проверка, заблокирована ли уже дата
              return blockedDates.some(blockedDate => 
                format(blockedDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
              );
            }}
            locale={ru}
          />

          {selectedDates.length > 0 && (
            <div className="p-3 bg-red-900/20 border border-red-400 rounded-md">
              <p className="text-red-400 font-bold mb-2">Выбрано дат: {selectedDates.length}</p>
              <div className="max-h-[100px] overflow-y-auto text-sm text-orange-400">
                {selectedDates.map((date, index) => (
                  <div key={index} className="mb-1">
                    {format(date, 'dd MMMM yyyy', { locale: ru })}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="blockReason">Причина блокировки</Label>
            <Textarea 
              id="blockReason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[80px] bg-black/50 border-yellow-400 text-orange-400"
              placeholder="Укажите причину блокировки дат"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleBlockDates}
            disabled={selectedDates.length === 0}
            className="bg-red-600 hover:bg-red-700 text-white font-bold"
          >
            Заблокировать даты
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BlockDateDialog;
