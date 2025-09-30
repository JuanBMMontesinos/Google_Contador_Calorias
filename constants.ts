
import { Food, Exercise, MealType } from './types';

export const PRE_CADASTRADO_FOODS: Food[] = [
  { id: 'f1', name: 'Arroz branco (100g)', calories: 130, protein: 2.7, carbs: 28, fat: 0.3 },
  { id: 'f2', name: 'Frango grelhado (100g)', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  { id: 'f3', name: 'Maçã (unidade)', calories: 95, protein: 0.5, carbs: 25, fat: 0.3 },
  { id: 'f4', name: 'Ovo cozido (unidade)', calories: 78, protein: 6, carbs: 0.6, fat: 5 },
  { id: 'f5', name: 'Pão integral (fatia)', calories: 80, protein: 4, carbs: 14, fat: 1 },
  { id: 'f6', name: 'Banana (unidade)', calories: 105, protein: 1.3, carbs: 27, fat: 0.4 },
  { id: 'f7', name: 'Batata doce (100g)', calories: 86, protein: 1.6, carbs: 20, fat: 0.1 },
  { id: 'f8', name: 'Salmão (100g)', calories: 208, protein: 20, carbs: 0, fat: 13 },
  { id: 'f9', name: 'Brócolis (100g)', calories: 34, protein: 2.8, carbs: 7, fat: 0.4 },
  { id: 'f10', name: 'Azeite de oliva (colher)', calories: 119, protein: 0, carbs: 0, fat: 14 },
];

export const PRE_CADASTRADO_EXERCISES: Exercise[] = [
  { id: 'e1', name: 'Corrida (leve)', caloriesBurned: 600 },
  { id: 'e2', name: 'Caminhada', caloriesBurned: 300 },
  { id: 'e3', name: 'Musculação (moderada)', caloriesBurned: 400 },
  { id: 'e4', name: 'Natação', caloriesBurned: 700 },
  { id: 'e5', name: 'Ciclismo (moderado)', caloriesBurned: 550 },
];

export const MEAL_TYPES_ORDERED = [
    MealType.Breakfast,
    MealType.Lunch,
    MealType.Dinner,
    MealType.Snacks
];

export const WATER_INCREMENT = 250;
export const MAX_WATER = 2250;
