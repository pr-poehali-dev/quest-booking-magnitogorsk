import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import bookingService from "@/lib/bookingService";

interface AdminSettingsProps {
  onPhoneUpdated?: () => void;
}

const AdminSettings: React.FC<AdminSettingsProps> = ({ onPhoneUpdated }) => {
  const [supportPhone, setSupportPhone] = useState(bookingService.getSupportPhone());
  const [showSavedMessage, setShowSavedMessage] = useState(false);

  // Слушаем событие обновления настроек
  useEffect(() => {
    const handleSettingsUpdated = () => {
      setSupportPhone(bookingService.getSupportPhone());
      if (onPhoneUpdated) onPhoneUpdated();
    };

    window.addEventListener('settings-updated', handleSettingsUpdated);
    return () => {
      window.removeEventListener('settings-updated', handleSettingsUpdated);
    };
  }, [onPhoneUpdated]);

  const handleSavePhone = () => {
    bookingService.setSupportPhone(supportPhone);
    setShowSavedMessage(true);
    setTimeout(() => setShowSavedMessage(false), 3000);
  };

  return (
    <Card className="bg-black/30 border-yellow-900/50">
      <CardHeader>
        <CardTitle className="text-yellow-400">Настройки администратора</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="supportPhone" className="text-orange-400">
            Телефон поддержки
          </Label>
          <div className="flex gap-2">
            <Input
              id="supportPhone"
              value={supportPhone}
              onChange={(e) => setSupportPhone(e.target.value)}
              placeholder="+7 (999) 123-45-67"
              className="bg-black/40 border-yellow-900/30 text-orange-500"
            />
            <Button 
              onClick={handleSavePhone}
              className="bg-yellow-600 hover:bg-yellow-700 text-black"
            >
              Сохранить
            </Button>
          </div>
          {showSavedMessage && (
            <p className="text-green-500 text-sm mt-1">Телефон сохранен!</p>
          )}
          <p className="text-sm text-orange-300 mt-2">
            Номер телефона будет отображаться для пользователей в разделах квестов
            и при оформлении бронирования.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminSettings;
