import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarHeart } from 'lucide-react'; // Icon

const Home = () => {
  const navigate = useNavigate();

  const goToTracker = () => {
    navigate('/tracker');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-pink-100 via-pink-50 to-orange-100">
      <h1 className="text-4xl font-bold text-pink-600 mb-6">Welcome to Your Cycle Tracker</h1>

      <button
        onClick={goToTracker}
        className="flex items-center gap-2 px-6 py-3 bg-pink-400 text-white rounded-full hover:bg-pink-500 transition transform hover:scale-105 hover:-translate-y-1 shadow-md"
      >
        <CalendarHeart className="w-5 h-5" />
        Go to Tracker
      </button>
    </div>
  );
};

export default Home;
