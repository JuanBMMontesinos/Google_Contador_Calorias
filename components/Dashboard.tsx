
import React from 'react';
import { DailyLog, Food, Exercise, LoggedFood, LoggedExercise, MealType } from '../types';
import { AppleIcon, FireIcon, DumbbellIcon } from './Icons';
import { MEAL_TYPES_ORDERED } from '../constants';

interface DashboardProps {
  dailyLog: DailyLog | undefined;
  allFoods: Food[];
  allExercises: Exercise[];
}

const MacroCircle: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => {
    return (
        <div className="flex flex-col items-center">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-lg ${color}`}>
                {value.toFixed(0)}g
            </div>
            <span className="mt-2 text-sm text-gray-600">{label}</span>
        </div>
    );
};


const Dashboard: React.FC<DashboardProps> = ({ dailyLog, allFoods, allExercises }) => {
  const allFoodsMap = new Map(allFoods.map(f => [f.id, f]));
  const allExercisesMap = new Map(allExercises.map(e => [e.id, e]));

  const calculateTotals = () => {
    if (!dailyLog) {
      return { caloriesIn: 0, protein: 0, carbs: 0, fat: 0, caloriesOut: 0 };
    }

    let caloriesIn = 0, protein = 0, carbs = 0, fat = 0, caloriesOut = 0;

    MEAL_TYPES_ORDERED.forEach(mealType => {
        dailyLog.meals[mealType].forEach((loggedFood: LoggedFood) => {
            const food = allFoodsMap.get(loggedFood.foodId);
            if (food) {
                const multiplier = loggedFood.grams / 100;
                caloriesIn += food.calories * multiplier;
                protein += food.protein * multiplier;
                carbs += food.carbs * multiplier;
                fat += food.fat * multiplier;
            }
        });
    });

    dailyLog.exercises.forEach((loggedExercise: LoggedExercise) => {
        const exercise = allExercisesMap.get(loggedExercise.exerciseId);
        if (exercise) {
            caloriesOut += (exercise.caloriesBurned / 60) * loggedExercise.minutes;
        }
    });

    return { caloriesIn, protein, carbs, fat, caloriesOut };
  };

  const totals = calculateTotals();
  const netCalories = totals.caloriesIn - totals.caloriesOut;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-neutral mb-4">Resumo do Dia</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div className="bg-primary/10 p-4 rounded-lg flex flex-col items-center justify-center">
          <div className="flex items-center text-primary">
            <AppleIcon />
            <span className="ml-2 font-semibold">Ingeridas</span>
          </div>
          <p className="text-3xl font-bold text-neutral mt-2">{totals.caloriesIn.toFixed(0)}</p>
          <p className="text-sm text-gray-500">kcal</p>
        </div>
        <div className="bg-accent/10 p-4 rounded-lg flex flex-col items-center justify-center">
          <div className="flex items-center text-accent">
            <DumbbellIcon />
            <span className="ml-2 font-semibold">Gastas</span>
          </div>
          <p className="text-3xl font-bold text-neutral mt-2">{totals.caloriesOut.toFixed(0)}</p>
          <p className="text-sm text-gray-500">kcal</p>
        </div>
        <div className="bg-secondary/10 p-4 rounded-lg flex flex-col items-center justify-center">
          <div className="flex items-center text-secondary">
            <FireIcon />
            <span className="ml-2 font-semibold">Balanço</span>
          </div>
          <p className="text-3xl font-bold text-neutral mt-2">{netCalories.toFixed(0)}</p>
          <p className="text-sm text-gray-500">kcal</p>
        </div>
      </div>
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-neutral mb-4 text-center">Macronutrientes</h3>
        <div className="flex justify-around">
            <MacroCircle label="Proteínas" value={totals.protein} color="bg-red-500" />
            <MacroCircle label="Carboidratos" value={totals.carbs} color="bg-blue-500" />
            <MacroCircle label="Gorduras" value={totals.fat} color="bg-yellow-500" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
