import React, { useState, useEffect } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  differenceInDays
} from 'date-fns';

const Tracker = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [lastPeriodStart, setLastPeriodStart] = useState(new Date());
  const [cycleLength, setCycleLength] = useState(28);
  const [currentPhase, setCurrentPhase] = useState('');
  const [nutritionTip, setNutritionTip] = useState('');
  const [nextPeriodStart, setNextPeriodStart] = useState(null);

  useEffect(() => {
    calculatePhaseAndTip();
  }, [lastPeriodStart, cycleLength]);

  const getPhase = (date) => {
    const daysSinceStart = differenceInDays(date, lastPeriodStart);
    const phaseDay = ((daysSinceStart % cycleLength) + cycleLength) % cycleLength;

    if (phaseDay <= 5) return 'Menstrual';
    if (phaseDay <= 13) return 'Follicular';
    if (phaseDay === 14) return 'Ovulation';
    return 'Luteal';
  };

  const calculatePhaseAndTip = () => {
    const today = new Date();
    const daysSinceLastPeriod = differenceInDays(today, lastPeriodStart);
    const phaseDay = ((daysSinceLastPeriod % cycleLength) + cycleLength) % cycleLength;

    let phase = '';
    let tip = '';
    let next = new Date(lastPeriodStart);
    next.setDate(next.getDate() + cycleLength);
    setNextPeriodStart(next);

    if (phaseDay <= 5) {
      phase = 'Menstrual';
      tip = '🥬 Eat iron-rich foods like spinach and lentils.';
    } else if (phaseDay <= 13) {
      phase = 'Follicular';
      tip = '🥚 Include high-protein foods like eggs and seeds.';
    } else if (phaseDay === 14) {
      phase = 'Ovulation';
      tip = '🌾 Boost energy with whole grains and fruits.';
    } else {
      phase = 'Luteal';
      tip = '🍌 Eat magnesium-rich foods like bananas and nuts.';
    }

    setCurrentPhase(phase);
    setNutritionTip(tip);
  };

  const renderHeader = () => (
    <div className="flex justify-between items-center mb-4">
      <button
        onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
        className="px-4 py-2 bg-[#ff7498] text-white rounded-lg hover:bg-[#e65a7d]"
      >
        ← Prev
      </button>
      <h2 className="text-2xl font-bold text-purple">
        {format(currentMonth, 'MMMM yyyy')}
      </h2>
      <button
        onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
        className="px-4 py-2 bg-[#ff7498] text-white rounded-lg hover:bg-[#e65a7d]"
      >
        Next →
      </button>
    </div>
  );

  const renderDays = () => {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <div className="grid grid-cols-7 mb-2">
        {dayNames.map((day, i) => (
          <div key={i} className="text-center font-semibold text-purple-700">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const today = new Date();
    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const formatted = format(day, 'd');
        const cloneDay = day;
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isToday = isSameDay(day, today);
        const isSelected = selectedDate && isSameDay(day, selectedDate);
        const isPredictedPeriod = nextPeriodStart && isSameDay(day, nextPeriodStart);

        days.push(
          <div
            key={day}
            className={`text-center py-2 cursor-pointer rounded-full transition-all relative
              ${isCurrentMonth ? 'text-[#ff7498] font-medium' : 'text-gray-400'}
              ${isToday ? 'ring-2 ring-[#ff7498] text-white font-bold scale-110 shadow-lg' : ''}
              ${isSelected ? 'ring-2 ring-[#ff7498]' : ''}
              ${isPredictedPeriod ? 'bg-purple-200 border-2 border-purple-500' : ''}`}
            onClick={() => setSelectedDate(cloneDay)}
          >
            {formatted}
            {isToday && (
              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-white"></span>
            )}
            {/* {isPredictedPeriod && (
              // <span className="absolute -bottom-1 left-0 right-0 text-xs text-purple-700">Predicted</span>
            )} */}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7 gap-1 mb-1" key={day}>
          {days}
        </div>
      );
      days = [];
    }
    return <div>{rows}</div>;
  };

  const renderPredictionSection = () => (
    <div className="mt-6">
      <h3 className="text-lg font-semibold text-purple-700 mb-2">Cycle Predictor</h3>
      <label className="block text-[#ff7498] text-sm mb-1">Last Period Start:</label>
      <input
        type="date"
        value={format(lastPeriodStart, 'yyyy-MM-dd')}
        onChange={(e) => setLastPeriodStart(new Date(e.target.value))}
        className="w-full p-2 mb-3 rounded-lg border border-[#ff7498]"
      />
      <label className="block text-[#ff7498] text-sm mb-1">Average Cycle Length:</label>
      <input
        type="number"
        value={cycleLength}
        onChange={(e) => setCycleLength(Number(e.target.value))}
        min={20}
        max={40}
        className="w-full p-2 mb-3 rounded-lg border border-[#ff7498]"
      />
      <div className="space-y-2 text-[#ff7498]">
        <p>Next predicted period: <strong>{nextPeriodStart ? format(nextPeriodStart, 'PPP') : 'Calculating...'}</strong></p>
        <p>Current phase: <strong>{currentPhase}</strong></p>
        <p>Nutrition tip: <em>{nutritionTip}</em></p>
      </div>
    </div>
  );

  return (
    <div className="p-4 bg-pink-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-purple-700 mb-6">
        🌸 Menstrual Tracker 🌸
      </h1>
      <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-lg">
        {renderHeader()}
        {renderDays()}
        {renderCells()}
        {renderPredictionSection()}
      </div>
    </div>
  );
};

export default Tracker;
