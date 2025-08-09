import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from "firebase/auth";

const Onboarding = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    height: '',
    periodStartDate: '',
    cycleLength: '28', // Default value
    symptomsTracking: true, // Default checked
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Check if user exists and maybe load existing data
  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      navigate('/login');
    } else {
      // Optionally load existing onboarding data
      const loadData = async () => {
        try {
          const token = await user.getIdToken();
          const response = await fetch('http://localhost:5000/api/onboarding', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            setFormData({
              age: data.age || '',
              weight: data.weight || '',
              height: data.height || '',
              periodStartDate: data.period_start_date || '',
              cycleLength: data.cycle_length || '28',
              symptomsTracking: data.symptoms_tracking || true
            });
          }
        } catch (err) {
          console.log('No existing onboarding data found');
        }
       
      };
      
      loadData();
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    const auth = getAuth();
    const user = auth.currentUser;

    try {
      const token = await user.getIdToken();
      const response = await fetch('http://localhost:5000/api/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Access-Control-Allow-Origin':'http://localhost:5000',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

    } catch (err) {
      console.error('onboarding error:', err);
      setError(err.message || 'Failed to save onboarding data');
    } finally {

      setIsSubmitting(false);
       navigate('/tracker');
    }

  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Onboarding</h2>
      
      {/* {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )} */}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Age */}
        <div>
          <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
            Age
          </label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            min="13"
            max="100"
            required
          />
        </div>

        {/* Weight */}
        <div>
          <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
            Weight (kg)
          </label>
          <input
            type="number"
            id="weight"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            min="30"
            max="200"
            step="0.1"
            required
          />
        </div>

        {/* Height */}
        <div>
          <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
            Height (cm)
          </label>
          <input
            type="number"
            id="height"
            name="height"
            value={formData.height}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            min="100"
            max="250"
            required
          />
        </div>

        {/* Period Start Date */}
        <div>
          <label htmlFor="periodStartDate" className="block text-sm font-medium text-gray-700 mb-1">
            First Day of Last Period
          </label>
          <input
            type="date"
            id="periodStartDate"
            name="periodStartDate"
            value={formData.periodStartDate}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            max={new Date().toISOString().split('T')[0]}
            required
          />
        </div>

        {/* Cycle Length */}
        <div>
          <label htmlFor="cycleLength" className="block text-sm font-medium text-gray-700 mb-1">
            Average Cycle Length (days)
          </label>
          <input
            type="number"
            id="cycleLength"
            name="cycleLength"
            value={formData.cycleLength}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            min="20"
            max="45"
            required
          />
        </div>

        {/* Symptoms Tracking */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="symptomsTracking"
            name="symptomsTracking"
            checked={formData.symptomsTracking}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="symptomsTracking" className="ml-2 block text-sm text-gray-700">
            Track Symptoms
          </label>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Saving...' : 'Save Information'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Onboarding;
