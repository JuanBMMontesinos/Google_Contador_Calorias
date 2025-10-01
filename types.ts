
export interface Food {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  isCustom?: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  caloriesBurned: number; // Per hour
  isCustom?: boolean;
}

export interface LoggedFood {
  foodId: string;
  grams: number;
}

export interface LoggedExercise {
  exerciseId: string;
  minutes: number;
}

export enum MealType {
  Breakfast = "Café da manhã",
  Lunch = "Almoço",
  Dinner = "Jantar",
  Snacks = "Lanches",
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  meals: Record<MealType, LoggedFood[]>;
  exercises: LoggedExercise[];
  water: number; // in ml
}

export enum Gender {
  Male = "Masculino",
  Female = "Feminino",
}

export enum ActivityLevel {
  Low = "Baixo",
  Moderate = "Moderado",
  High = "Alto",
  VeryHigh = "Muito alto",
  Hyperactive = "Hiperativo"
}

export enum Goal {
  LoseWeight = "Perder peso",
  LoseWeightSlowly = "Perder peso lentamente",
  Maintain = "Manter o peso",
  GainWeightSlowly = "Aumentar o peso lentamente",
  GainWeight = "Aumentar o peso",
}

export interface UserProfile {
  height: number; // cm
  weight: number; // kg
  gender: Gender;
  age: number;
  activityLevel: ActivityLevel;
  goal: Goal;
}
