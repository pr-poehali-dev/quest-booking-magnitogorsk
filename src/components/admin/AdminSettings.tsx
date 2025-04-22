import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';

interface AdminUser {
  id: string;
  username: string;
  password: string;
  name: string;
  role: 'admin' | 'superadmin';
}

interface AdminSettingsProps {
  currentUser: AdminUser;
  onSaveSettings: (user: AdminUser) => void;
}

const AdminSettings: React.FC<AdminSettingsProps> = ({ currentUser, onSaveSettings }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editedUser, setEditedUser] = useState<AdminUser>({ ...currentUser });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleOpenSettings = () => {
    setEditedUser({ ...currentUser });
    setConfirmPassword('');
    setPasswordError('');
    setIsOpen(true);
  };

  const handleSaveSettings = () => {
    // Проверка пароля
    if (editedUser.password && editedUser.password !== confirmPassword) {
      setPasswordError('Пароли не совпадают');
      return;
    }

    // Сохранение изменений
    onSaveSettings(editedUser);
    setIsOpen(false);
    
    toast({
      title: 'Настройки сохранены',
      description: 'Ваши настройки успешно обновлены',
      variant: 'default',
    });
  };

  return (
    <>
      <Button 
        onClick={handleOpenSettings}
        variant="outline" 
        className="text-yellow-400 border-yellow-400 hover:bg-yellow-950 hover:text-yellow-300"
      >
        Настройки
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-black border-2 border-yellow-400 text-yellow-400">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Настройки администратора</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Имя</Label>
              <Input 
                id="name"
                value={editedUser.name}
                onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                className="bg-black/50 border-yellow-400 text-orange-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Логин</Label>
              <Input 
                id="username"
                value={editedUser.username}
                onChange={(e) => setEditedUser({ ...editedUser, username: e.target.value })}
                className="bg-black/50 border-yellow-400 text-orange-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Новый пароль</Label>
              <Input 
                id="password"
                type="password"
                value={editedUser.password}
                onChange={(e) => setEditedUser({ ...editedUser, password: e.target.value })}
                className="bg-black/50 border-yellow-400 text-orange-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Подтверждение пароля</Label>
              <Input 
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-black/50 border-yellow-400 text-orange-400"
              />
              {passwordError && (
                <p className="text-red-500 text-sm">{passwordError}</p>
              )}
            </div>

            <div className="pt-4">
              <p className="text-sm text-orange-400">
                Роль: {editedUser.role === 'superadmin' ? 'Супер администратор' : 'Администратор'}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={handleSaveSettings}
              className="bg-yellow-600 hover:bg-yellow-700 text-black font-bold"
            >
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminSettings;
