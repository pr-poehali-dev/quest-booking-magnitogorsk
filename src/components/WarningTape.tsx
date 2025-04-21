const WarningTape = () => {
  return (
    <div className="w-full py-6 relative">
      <div className="warning-tape"></div>
      <div className="warning-tape mt-1"></div>
      
      {/* Добавляем эффект свечения вокруг ленты */}
      <div className="absolute inset-0 opacity-50 blur-md warning-tape pointer-events-none"></div>
    </div>
  );
};

export default WarningTape;
