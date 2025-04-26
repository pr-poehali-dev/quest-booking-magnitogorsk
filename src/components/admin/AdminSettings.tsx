import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import bookingService from "@/lib/bookingService";

interface AdminUser {
  id: string;
  username: string;
  password: string;
  name: string;
  role: 'admin' | 'superadmin';
  supportPhone: string;
}

interface AdminSettingsProps {
  currentUser: AdminUser;
  onSaveSettings: (user: AdminUser) => void;
}

const AdminSettings: React.FC<AdminSettingsProps> = ({ currentUser, onSaveSettings }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState(currentUser.username);
  const [password, setPassword] = useState(currentUser.password);
  const [name, setName] = useState(currentUser.name);
  const [supportPhone, setSupportPhone] = useState(currentUser.supportPhone || bookingService.getSupportPhone());

  const handleSave = () => {
    const updatedUser = {
      ...currentUser,
      username,
      password,
      name,
      supportPhone
    };
    
    onSaveSettings(updatedUser);
    bookingService.setSupportPhone(supportPhone);
    setIsOpen(false);
  };

  return (
    <>
      <Button 
        variant="outline" 
        className="text-yellow-400 border-yellow-400 hover:bg-yellow-950 hover:text-yellow-300"
        onClick={() => setIsOpen(true)}
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
              <Label htmlFor="name" className="text-yellow-400">Имя</Label>
              <Input 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="bg-black/50 border-yellow-400 text-orange-400"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="username" className="text-yellow-400">Логин</Label>
              <Input 
                id="username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                className="bg-black/50 border-yellow-400 text-orange-400"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-yellow-400">Пароль</Label>
              <Input 
                id="password" 
                type="password"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="bg-black/50 border-yellow-400 text-orange-400"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="supportPhone" className="text-yellow-400">Телефон поддержки</Label>
              <Input 
                id="supportPhone" 
                value={supportPhone} 
                onChange={(e) => setSupportPhone(e.target.value)} 
                className="bg-black/50 border-yellow-400 text-orange-400"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              onClick={handleSave} 
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
