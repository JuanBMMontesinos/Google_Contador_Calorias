import React, { useState, useMemo } from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { DailyLog, Food, Exercise } from '../types';
import { MEAL_TYPES_ORDERED } from '../constants';

interface WeeklyChartsProps {
  logs: DailyLog[];
  allFoods: Food[];
  allExercises: Exercise[];
  theme: 'light' | 'dark';
}

const WeeklyCharts: React.FC<WeeklyChartsProps> = ({ logs, allFoods, allExercises, theme }) => {
  const [view, setView] = useState<'calories' | 'water'>('calories');
  const [range, setRange] = useState<'weekly' | 'monthly'>('weekly');

  const allFoodsMap = new Map(allFoods.map(f => [f.id, f]));
  const allExercisesMap = new Map(allExercises.map(e => [e.id, e]));

  const chartData = useMemo(() => {
    const days = range === 'weekly' ? 7 : 30;
    const data = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateString = d.toISOString().split('T')[0];
      const log = logs.find(l => l.date === dateString);

      let caloriesIn = 0;
      let caloriesOut = 0;

      if (log) {
        MEAL_TYPES_ORDERED.forEach(mealType => {
            log.meals[mealType].forEach(loggedFood => {
                const food = allFoodsMap.get(loggedFood.foodId);
                if (food) {
                    caloriesIn += food.calories * (loggedFood.grams / 100);
                }
            });
        });

        log.exercises.forEach(loggedExercise => {
            const exercise = allExercisesMap.get(loggedExercise.exerciseId);
            if (exercise) {
                caloriesOut += (exercise.caloriesBurned / 60) * loggedExercise.minutes;
            }
        });
      }

      const name = range === 'weekly'
        ? new Date(dateString).toLocaleDateString('pt-BR', { weekday: 'short' })
        : new Date(dateString).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });

      data.push({
        name,
        'Calorias Ingeridas': parseFloat(caloriesIn.toFixed(0)),
        'Calorias Gastas': parseFloat(caloriesOut.toFixed(0)),
        'Água (ml)': log?.water || 0
      });
    }
    return data;
  }, [range, logs, allFoodsMap, allExercisesMap]);

  const chartColors = {
    light: {
      text: '#1f2937',
      grid: '#e5e7eb',
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        border: '1px solid #ccc',
      }
    },
    dark: {
      text: '#f9fafb',
      grid: '#4b5563',
      tooltip: {
        backgroundColor: 'rgba(31, 41, 55, 0.9)',
        border: '1px solid #4b5563',
      }
    }
  };

  const currentChartColors = chartColors[theme];

  const ToggleButton: React.FC<{
    options: { value: string; label: string }[];
    selectedValue: string;
    onChange: (value: any) => void;
  }> = ({ options, selectedValue, onChange }) => (
    <div className="flex bg-base-200 dark:bg-gray-700 rounded-lg p-1">
      {options.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors duration-200 ease-in-out w-full
            ${selectedValue === value ? 'bg-white dark:bg-gray-500 text-primary dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:bg-base-300 dark:hover:bg-gray-600'}`}
        >
          {label}
        </button>
      ))}
    </div>
  );

  return (
    <div className="bg-white dark:bg-neutral p-6 rounded-2xl shadow-lg mt-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h3 className="text-xl font-bold text-neutral dark:text-base-content">Resumo do Período</h3>
          <div className="w-full sm:w-auto grid grid-cols-2 gap-4">
            <ToggleButton
              options={[
                { value: 'calories', label: 'Calorias' },
                { value: 'water', label: 'Água' },
              ]}
              selectedValue={view}
              onChange={setView}
            />
            <ToggleButton
              options={[
                { value: 'weekly', label: '7 Dias' },
                { value: 'monthly', label: '30 Dias' },
              ]}
              selectedValue={range}
              onChange={setRange}
            />
          </div>
      </div>

      {view === 'calories' && (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid stroke={currentChartColors.grid} strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: currentChartColors.text }} />
              <YAxis tick={{ fontSize: 12, fill: currentChartColors.text }} />
              <Tooltip
                contentStyle={currentChartColors.tooltip}
              />
              <Legend wrapperStyle={{fontSize: "14px", color: currentChartColors.text}} />
              <Bar dataKey="Calorias Ingeridas" fill="#4A7C85" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Calorias Gastas" fill="#6b7280" radius={[4, 4, 0, 0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {view === 'water' && (
         <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid stroke={currentChartColors.grid} strokeDasharray="3 3" vertical={false}/>
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: currentChartColors.text }}/>
              <YAxis tick={{ fontSize: 12, fill: currentChartColors.text }} unit="ml" />
              <Tooltip
                contentStyle={currentChartColors.tooltip}
              />
              <Legend wrapperStyle={{fontSize: "14px", color: currentChartColors.text}}/>
              <Line type="monotone" dataKey="Água (ml)" stroke="#0EA5E9" strokeWidth={3} dot={{ r: 4, fill: currentChartColors.text }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default WeeklyCharts;