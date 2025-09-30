
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DailyLog, Food, Exercise } from '../types';
import { MEAL_TYPES_ORDERED } from '../constants';

interface WeeklyChartsProps {
  logs: DailyLog[];
  allFoods: Food[];
  allExercises: Exercise[];
}

const WeeklyCharts: React.FC<WeeklyChartsProps> = ({ logs, allFoods, allExercises }) => {
  const allFoodsMap = new Map(allFoods.map(f => [f.id, f]));
  const allExercisesMap = new Map(allExercises.map(e => [e.id, e]));

  const processDataForChart = () => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
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
      
      data.push({
        name: new Date(dateString).toLocaleDateString('pt-BR', { weekday: 'short' }),
        'Calorias Ingeridas': caloriesIn,
        'Calorias Gastas': caloriesOut,
        'Água (ml)': log?.water || 0
      });
    }
    return data;
  };
  
  const chartData = processDataForChart();

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg mt-6">
      <h3 className="text-xl font-bold text-neutral mb-6">Resumo Semanal</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Calorias Ingeridas" fill="#10B981" />
            <Bar dataKey="Calorias Gastas" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
       <div className="h-72 mt-8">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Água (ml)" fill="#0EA5E9" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeeklyCharts;
