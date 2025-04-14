
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Onboarding = () => {
  const navigate = useNavigate();
  

  const [formData, setFormData] = useState({
    periodStartDate: '',
    cycleLength: '',
    symptomsTracking: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log('Form submitted with data:', formData);

alert("Thanks! Your info has been saved.");
navigate("/home");

  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <h2 className="text-2xl font-semibold text-center mb-4">Onboarding</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* First day of last period */}
        <div>
          <label htmlFor="periodStartDate" className="block text-sm font-medium">First Day of Last Period</label>
          <input
            type="date"
            id="periodStartDate"
            name="periodStartDate"
            value={formData.periodStartDate}
            onChange={handleChange}
            required
            className="w-full mt-2 p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Average cycle length */}
        <div>
          <label htmlFor="cycleLength" className="block text-sm font-medium">Average Cycle Length (days)</label>
          <input
            type="number"
            id="cycleLength"
            name="cycleLength"
            value={formData.cycleLength}
            onChange={handleChange}
            min="20"
            max="45"
            required
            className="w-full mt-2 p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Symptoms tracking */}
        <div>
          <label htmlFor="symptomsTracking" className="block text-sm font-medium">Track Symptoms?</label>
          <input
            type="checkbox"
            id="symptomsTracking"
            name="symptomsTracking"
            checked={formData.symptomsTracking}
            onChange={handleChange}
            className="mt-2"
          />
          <span className="text-sm ml-2">Yes, track symptoms</span>
        </div>

        {/* Submit button */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Onboarding;
