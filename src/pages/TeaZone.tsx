import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import WarningTape from "@/components/WarningTape";
import { AlertTriangle, Clock, Coffee, Ban, Check } from "lucide-react";

const TeaZone = () => {
  return (
    <div className="brick-wall-bg min-h-screen day-night-cycle relative">
      {/* Декоративные элементы */}
      <div className="absolute inset-0 opacity-70 z-0 pointer-events-none">
        {/* Стол с едой (стилизованный элемент) */}
        <div className="absolute left-1/2 transform -translate-x-1/2 bottom-10 w-1/2 h-32 bg-orange-DEFAULT opacity-20 rounded-3xl blur-lg"></div>
        
        {/* Чашки и напитки (абстрактные элементы) */}
        <div className="absolute left-1/3 bottom-20 w-12 h-12 bg-orange-bright opacity-30 rounded-full blur-md"></div>
        <div className="absolute left-2/3 bottom-24 w-8 h-8 bg-yellow-bright opacity-30 rounded-full blur-md"></div>
        <div className="absolute left-2/5 bottom-16 w-10 h-10 bg-orange-bright opacity-30 rounded-full blur-md"></div>
      </div>
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        <WarningTape />
        
        <Link to="/" className="inline-block mb-8">
          <Button variant="outline" className="text-yellow-neon border-yellow-neon hover:bg-yellow-DEFAULT/20 hover:text-yellow-bright">
            ← Вернуться на главную
          </Button>
        </Link>
        
        <div className="max-w-4xl mx-auto caution-border p-8 bg-black bg-opacity-80 rounded-lg shadow-2xl">
          <h1 className="text-4xl sm:text-5xl font-bold text-center text-yellow-neon mb-8 text-outline animate-glow">
            Чайная зона
          </h1>
          
          <div className="mb-10 text-center">
            <div className="w-24 h-24 mx-auto mb-4 relative">
              <Coffee size={96} className="text-orange-bright" />
              <div className="absolute inset-0 text-yellow-DEFAULT opacity-50 blur-lg">
                <Coffee size={96} />
              </div>
            </div>
            
            <p className="text-xl text-orange-bright text-glow mb-6 leading-relaxed">
              Эта уютная комната с большим столом и мягкими диванами в самом квесте. 
              После увлекательного приключения, полного эмоций и загадок, приглашаем вас 
              в уютную чайную зону, где можно отдохнуть и поделиться впечатлениями!
            </p>
            
            <p className="text-xl text-orange-bright text-glow mb-8 leading-relaxed">
              Приходите и насладитесь временем в нашей чайной зоне — местом для отдыха после ярких приключений!
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div className="bg-black bg-opacity-70 p-6 border-2 border-yellow-DEFAULT rounded-lg shadow-lg animate-pulse">
              <div className="flex items-center mb-4">
                <Clock size={28} className="text-yellow-neon mr-2" />
                <h2 className="text-2xl font-bold text-yellow-neon text-outline">Аренда</h2>
              </div>
              
              <p className="text-xl text-orange-bright mb-2 text-glow">
                Аренда чайной зоны на 1 час стоит:
              </p>
              
              <p className="text-3xl font-bold text-yellow-neon mb-4 text-outline text-center">
                1000 ₽
              </p>
              
              <p className="text-lg text-orange-bright text-glow">
                Если вас заинтересовала данная услуга, не забудьте сообщить о ней оператору!
              </p>
            </div>
            
            <div className="bg-black bg-opacity-70 p-6 border-2 border-yellow-DEFAULT rounded-lg shadow-lg">
              <div className="flex items-center mb-4">
                <AlertTriangle size={28} className="text-yellow-neon mr-2" />
                <h2 className="text-2xl font-bold text-yellow-neon text-outline">Ограничения</h2>
              </div>
              
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Ban size={20} className="text-orange-bright mr-2 mt-1 flex-shrink-0" />
                  <p className="text-lg text-orange-bright text-glow">
                    Строго запрещен вход с алкоголем
                  </p>
                </li>
                <li className="flex items-start">
                  <Ban size={20} className="text-orange-bright mr-2 mt-1 flex-shrink-0" />
                  <p className="text-lg text-orange-bright text-glow">
                    Запрещается курить в помещении
                  </p>
                </li>
                <li className="flex items-start">
                  <Ban size={20} className="text-orange-bright mr-2 mt-1 flex-shrink-0" />
                  <p className="text-lg text-orange-bright text-glow">
                    Запрещается использовать бенгальские огни и другие свечи, кроме обычных парафиновых свечей (они разрешены)
                  </p>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="bg-black bg-opacity-70 p-6 border-2 border-yellow-DEFAULT rounded-lg shadow-lg mb-8">
            <div className="flex items-center mb-4">
              <Check size={28} className="text-yellow-neon mr-2" />
              <h2 className="text-2xl font-bold text-yellow-neon text-outline">Что мы предоставляем</h2>
            </div>
            
            <div className="text-center">
              <p className="text-xl text-yellow-bright font-bold mb-4 text-glow">
                ВАЖНО: мы предоставляем только место для банкета!
              </p>
              
              <p className="text-lg text-orange-bright mb-6 text-glow">
                Посуда, еда, напитки – все с вас!
              </p>
              
              <p className="text-lg text-orange-bright text-glow">
                Мы предоставим: микроволновку, куллер с водой и чайник, в котором можно вскипятить воду.
              </p>
            </div>
          </div>
          
          <div className="text-center">
            <Button 
              className="bg-yellow-DEFAULT hover:bg-yellow-bright text-black font-bold text-lg px-8 py-6"
              onClick={() => window.open("https://vk.com/kvest_chekcout", "_blank")}
            >
              Забронировать чайную зону
            </Button>
          </div>
        </div>
        
        <WarningTape />
      </div>
    </div>
  );
};

export default TeaZone;
