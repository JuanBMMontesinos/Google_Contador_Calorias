import React from 'react';
import { WaterDropIcon } from './Icons';
import { WATER_INCREMENT, MAX_WATER } from '../constants';

interface WaterTrackerProps {
  waterIntake: number;
  onWaterChange: (newAmount: number) => void;
}

const WaterTracker: React.FC<WaterTrackerProps> = ({ waterIntake, onWaterChange }) => {
  const glasses = Math.floor(waterIntake / WATER_INCREMENT);
  const totalGlasses = MAX_WATER / WATER_INCREMENT;

  const handleAddWater = () => {
    onWaterChange(Math.min(MAX_WATER, waterIntake + WATER_INCREMENT));
  };
  
  const handleRemoveWater = () => {
    onWaterChange(Math.max(0, waterIntake - WATER_INCREMENT));
  };

  return (
    <div className="bg-white dark:bg-neutral p-6 rounded-2xl shadow-lg">
      <h3 className="text-xl font-bold text-neutral dark:text-base-content mb-4 flex items-center">
        <WaterDropIcon />
        <span className="ml-2">Água</span>
      </h3>
      <div className="text-center mb-4">
        <p className="text-3xl font-bold text-accent">{waterIntake} <span className="text-lg">ml</span></p>
      </div>
      <div className="flex justify-center items-center space-x-2 mb-4">
        {Array.from({ length: totalGlasses }).map((_, index) => (
          <div key={index} className={`w-8 h-12 rounded-t-lg ${index < glasses ? 'bg-blue-400' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
        ))}
      </div>
      <div className="flex justify-center space-x-4">
        <button onClick={handleRemoveWater} disabled={waterIntake <= 0} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 dark:text-gray-300 rounded-lg disabled:opacity-50">- 250ml</button>
        <button onClick={handleAddWater} disabled={waterIntake >= MAX_WATER} className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50">+ 250ml</button>
      </div>
    </div>
  );
};

export default WaterTracker;