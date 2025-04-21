import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import WarningTape from "@/components/WarningTape";

const TeaZone: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#7c0000] relative overflow-hidden">
      {/* Декоративные элементы */}
      <div className="absolute inset-0 bg-brick-wall opacity-70"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-30"></div>
      
      {/* Стол с едой (декоративные элементы) */}
      <div className="absolute bottom-1/4 right-1/3 w-64 h-24 bg-[#5e3a22] rounded-lg opacity-60"></div>
      <div className="absolute bottom-1/4 right-1/3 w-56 h-4 bg-[#f5d7a3] rounded-lg translate-x-4 -translate-y-4 opacity-60"></div>
      <div className="absolute bottom-1/4 right-1/3 w-8 h-8 bg-[#e36414] rounded-full translate-x-10 -translate-y-12 opacity-60"></div>
      <div className="absolute bottom-1/4 right-1/3 w-10 h-6 bg-[#99582a] rounded translate-x-24 -translate-y-10 opacity-60"></div>
      <div className="absolute bottom-1/4 right-1/3 w-6 h-12 bg-[#6c584c] rounded translate-x-40 -translate-y-12 opacity-60"></div>
      
      <div className="container mx-auto relative z-10 px-4 py-8">
        <WarningTape />
        
        <Link to="/" className="inline-block mb-8">
          <Button variant="outline" className="text-yellow-400 border-yellow-400 hover:bg-yellow-950 hover:text-yellow-300">
            На главную
          </Button>
        </Link>
        
        <div className="bg-black/80 p-8 rounded-lg border-2 border-yellow-400 text-orange-400 max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold mb-6 text-yellow-400">Чайная зона</h1>
          
          <div className="space-y-6 text-lg">
            <p>
              Чайная зона – эта уютная комната с большим столом и мягкими диванами в самом квесте. 
              После увлекательного приключения, полны эмоций и загадок, приглашаем вас в уютную чайную зону, 
              где можно отдохнуть и поделиться впечатлениями!
            </p>
            
            <p className="text-xl font-bold">
              Приходите и насладитесь временем в нашей чайной зоне — местом для отдыха после ярких приключений!
            </p>
            
            <div className="p-4 bg-yellow-900/30 rounded-lg border border-yellow-500">
              <p className="text-yellow-400 font-bold mb-2">Аренда чайной зоны на 1ч стоит 1000₽.</p>
            </div>
            
            <div className="p-4 bg-red-900/30 rounded-lg border border-red-500">
              <p className="text-red-400 font-bold mb-2">Ограничения:</p>
              <ul className="list-disc list-inside space-y-1 text-orange-300">
                <li>Строго запрещен вход с алкоголем</li>
                <li>Запрещается курить в помещении</li>
                <li>Запрещается использовать бенгальские огни и другие свечи, кроме обычных парафиновых свечей (они разрешены)</li>
              </ul>
            </div>
            
            <div className="p-4 bg-blue-900/30 rounded-lg border border-blue-500">
              <p className="text-blue-400 font-bold mb-2">Важно:</p>
              <p className="text-orange-300">Мы предоставляем только место для банкета! Посуда, еда, напитки – все с вас!</p>
            </div>
            
            <div className="p-4 bg-green-900/30 rounded-lg border border-green-500">
              <p className="text-green-400 font-bold mb-2">Мы предоставим:</p>
              <ul className="list-disc list-inside space-y-1 text-orange-300">
                <li>Микроволновку</li>
                <li>Куллер с водой</li>
                <li>Чайник, в котором можно вскипятить воду</li>
              </ul>
            </div>
            
            <p className="text-xl text-yellow-300 font-bold text-center mt-8">
              Если вас заинтересовала данная услуга, не забудьте сообщить о ней оператору!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeaZone;
