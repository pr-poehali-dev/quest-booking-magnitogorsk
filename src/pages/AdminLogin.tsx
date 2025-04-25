import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import WarningTape from "@/components/WarningTape";
import { ArrowLeft, UserCog } from "lucide-react";

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
        
        {/* Кнопка возврата на главную */}
        <div className="absolute top-4 left-4 z-20">
          <Link to="/">
            <Button 
              variant="outline" 
              className="bg-black bg-opacity-80 border-2 border-yellow-400 hover:bg-yellow-400 hover:text-black transition-all duration-300"
            >
              <ArrowLeft className="mr-2" />
              <span className="font-bold">Вернуться на главную</span>
            </Button>
          </Link>
        </div>
        
        {/* Логотип компании */}
        <div className="mt-16 mb-6 flex justify-center">
          <img 
            src="https://cdn.poehali.dev/files/b4cf6771-45d7-4b94-b475-2e1ac5f8f74b.jpg" 
            alt="CHECKOUT - логотип компании" 
            className="w-40 h-auto" 
          />
        </div>
        
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="bg-black/80 p-8 rounded-lg border-2 border-yellow-400 text-orange-500 w-full max-w-md">
            <div className="flex items-center justify-center mb-6">
              <UserCog size={32} className="text-yellow-400 mr-2" />
              <h1 className="text-3xl font-bold text-yellow-400 text-center">Вход для администраторов</h1>
            </div>
            
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
