import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import WarningTape from "@/components/WarningTape";

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const validCredentials = [
    { username: "NiKiTa Kvest", password: "admin1408" },
    { username: "ArInA Kvest", password: "admin1606" }
  ];

  const handleLogin = () => {
    const isValid = validCredentials.some(
      cred => cred.username === username && cred.password === password
    );

    if (isValid) {
      // Сохраняем статус аутентификации в localStorage
      localStorage.setItem('adminAuthenticated', 'true');
      
      toast({
        title: "Успешный вход",
        description: "Добро пожаловать в панель администратора",
      });
      
      // Перенаправление на админ-панель
      navigate("/admin-panel");
    } else {
      toast({
        title: "Ошибка входа",
        description: "Неверный логин или пароль",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#7c0000] relative overflow-hidden">
      {/* Декоративные элементы */}
      <div className="absolute inset-0 bg-brick-wall opacity-70"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-30"></div>
      
      <div className="container mx-auto relative z-10 px-4 py-8">
        <WarningTape />
        
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="bg-black/80 p-8 rounded-lg border-2 border-yellow-400 text-orange-500 w-full max-w-md">
            <h1 className="text-3xl font-bold mb-6 text-yellow-400 text-center">Вход для администраторов</h1>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-yellow-400">Логин</Label>
                <Input 
                  id="username" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  className="bg-black/50 border-yellow-400 text-orange-500"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-yellow-400">Пароль</Label>
                <Input 
                  id="password" 
                  type="password"
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="bg-black/50 border-yellow-400 text-orange-500"
                />
              </div>
              
              <Button 
                onClick={handleLogin} 
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-black font-bold mt-4"
              >
                Войти
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
