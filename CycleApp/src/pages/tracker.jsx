import React, { useState } from 'react';

const Tracker = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);

  const symptomsList = ['Cramps', 'Bloating', 'Headache', 'Mood Swings', 'Fatigue'];

  const toggleSymptom = (symptom) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    );
  };

  return (
    <div className="min-h-screen bg-pink-50 py-10 px-4">
      <h1 className="text-3xl font-bold text-center text-pink-600 mb-6">🌸 Menstrual Tracker</h1>

      {/* Calendar (Simple Grid) */}
      <div className="grid grid-cols-7 gap-2 max-w-md mx-auto mb-8">
        {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDate(day)}
            className={`rounded-full w-10 h-10 flex items-center justify-center text-sm ${
              selectedDate === day
                ? 'bg-pink-500 text-white'
                : 'bg-white text-pink-600 border border-pink-300'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Symptom Buttons */}
      <div className="max-w-md mx-auto">
        <h2 className="text-lg font-semibold text-purple-500 mb-2">How are you feeling?</h2>
        <div className="flex flex-wrap gap-2">
          {symptomsList.map((symptom) => (
            <button
              key={symptom}
              onClick={() => toggleSymptom(symptom)}
              className={`px-4 py-2 rounded-full text-sm ${
                selectedSymptoms.includes(symptom)
                  ? 'bg-purple-400 text-white'
                  : 'bg-purple-100 text-purple-700'
              }`}
            >
              {symptom}
            </button>
          ))}
        </div>
      </div>

      {/* Daily Log Display */}
      <div className="max-w-md mx-auto mt-6 bg-white shadow-md rounded-lg p-4">
        <h3 className="text-md font-medium text-orange-500 mb-2">Daily Log</h3>
        <p className="text-gray-600">
          {selectedDate
            ? `You selected day ${selectedDate} with symptoms: ${selectedSymptoms.join(', ') || 'None'}`
            : 'Select a day to log your symptoms.'}
        </p>
      </div>
    </div>
  );
};

export default Tracker;

