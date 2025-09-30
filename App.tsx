
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Food, Exercise, MealType, DailyLog, LoggedFood, LoggedExercise } from './types';
import { PRE_CADASTRADO_FOODS, PRE_CADASTRADO_EXERCISES, MEAL_TYPES_ORDERED } from './constants';
import Dashboard from './components/Dashboard';
import WaterTracker from './components/WaterTracker';
import WeeklyCharts from './components/WeeklyCharts';
import Modal from './components/Modal';
import { PlusIcon, TrashIcon, PencilIcon, ChevronLeftIcon, ChevronRightIcon, DumbbellIcon, AppleIcon } from './components/Icons';

// Helper to get today's date string
const getFormattedDate = (date: Date): string => date.toISOString().split('T')[0];

const createNewDailyLog = (date: string): DailyLog => ({
    date,
    meals: {
        [MealType.Breakfast]: [],
        [MealType.Lunch]: [],
        [MealType.Dinner]: [],
        [MealType.Snacks]: [],
    },
    exercises: [],
    water: 0,
});

const App: React.FC = () => {
    const [customFoods, setCustomFoods] = useState<Food[]>([]);
    const [customExercises, setCustomExercises] = useState<Exercise[]>([]);
    const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    
    const [isFoodModalOpen, setFoodModalOpen] = useState(false);
    const [isExerciseModalOpen, setExerciseModalOpen] = useState(false);
    const [modalTargetMeal, setModalTargetMeal] = useState<MealType | null>(null);

    const [isManageFoodModalOpen, setManageFoodModalOpen] = useState(false);
    const [isManageExerciseModalOpen, setManageExerciseModalOpen] = useState(false);
    
    const selectedDateString = getFormattedDate(selectedDate);
    const currentDailyLog = useMemo(() => {
        let log = dailyLogs.find(log => log.date === selectedDateString);
        if (!log) {
            log = createNewDailyLog(selectedDateString);
            // We don't add it to state here to avoid side-effects in useMemo
            // It will be added when an action is performed
        }
        return log;
    }, [dailyLogs, selectedDateString]);
    
    const allFoods = useMemo(() => [...PRE_CADASTRADO_FOODS, ...customFoods], [customFoods]);
    const allExercises = useMemo(() => [...PRE_CADASTRADO_EXERCISES, ...customExercises], [customExercises]);
    
    const updateDailyLog = useCallback((log: DailyLog) => {
        setDailyLogs(prevLogs => {
            const index = prevLogs.findIndex(l => l.date === log.date);
            if (index > -1) {
                const newLogs = [...prevLogs];
                newLogs[index] = log;
                return newLogs;
            }
            return [...prevLogs, log];
        });
    }, []);

    const handleAddFoodToMeal = (foodId: string, grams: number, mealType: MealType) => {
        if (grams <= 0) return;
        const newLog = JSON.parse(JSON.stringify(currentDailyLog)); // Deep copy
        newLog.meals[mealType].push({ foodId, grams });
        updateDailyLog(newLog);
        setFoodModalOpen(false);
    };

    const handleRemoveFoodFromMeal = (index: number, mealType: MealType) => {
        const newLog = JSON.parse(JSON.stringify(currentDailyLog));
        newLog.meals[mealType].splice(index, 1);
        updateDailyLog(newLog);
    };

    const handleAddExercise = (exerciseId: string, minutes: number) => {
        if (minutes <= 0) return;
        const newLog = JSON.parse(JSON.stringify(currentDailyLog));
        newLog.exercises.push({ exerciseId, minutes });
        updateDailyLog(newLog);
        setExerciseModalOpen(false);
    };

    const handleRemoveExercise = (index: number) => {
        const newLog = JSON.parse(JSON.stringify(currentDailyLog));
        newLog.exercises.splice(index, 1);
        updateDailyLog(newLog);
    };

    const handleWaterChange = (newAmount: number) => {
        const newLog = { ...currentDailyLog, water: newAmount };
        updateDailyLog(newLog);
    };
    
    const handleDateChange = (offset: number) => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() + offset);
        setSelectedDate(newDate);
    };
    
    const saveCustomFood = (food: Food) => {
        setCustomFoods(prev => {
            const index = prev.findIndex(f => f.id === food.id);
            if (index > -1) {
                const newFoods = [...prev];
                newFoods[index] = food;
                return newFoods;
            }
            return [...prev, { ...food, id: `c-f-${Date.now()}`, isCustom: true }];
        });
    };

    const deleteCustomFood = (foodId: string) => {
        setCustomFoods(prev => prev.filter(f => f.id !== foodId));
    };

    const saveCustomExercise = (exercise: Exercise) => {
        setCustomExercises(prev => {
            const index = prev.findIndex(e => e.id === exercise.id);
            if (index > -1) {
                const newExercises = [...prev];
                newExercises[index] = exercise;
                return newExercises;
            }
            return [...prev, { ...exercise, id: `c-e-${Date.now()}`, isCustom: true }];
        });
    };

    const deleteCustomExercise = (exerciseId: string) => {
        setCustomExercises(prev => prev.filter(e => e.id !== exerciseId));
    };


    return (
        <div className="min-h-screen bg-base-200 text-neutral">
            <header className="bg-primary text-primary-content shadow-md p-4 flex justify-center items-center">
                <AppleIcon/>
                <h1 className="text-3xl font-bold ml-2">Meu Contador de Calorias</h1>
            </header>
            
            <main className="p-4 md:p-8 max-w-7xl mx-auto">
                <div className="bg-white p-4 rounded-xl shadow-md mb-6 flex justify-between items-center">
                    <button onClick={() => handleDateChange(-1)} className="p-2 rounded-full hover:bg-base-200"><ChevronLeftIcon/></button>
                    <h2 className="text-xl font-semibold">{new Intl.DateTimeFormat('pt-BR', { dateStyle: 'full' }).format(selectedDate)}</h2>
                    <button onClick={() => handleDateChange(1)} className="p-2 rounded-full hover:bg-base-200"><ChevronRightIcon/></button>
                </div>

                <Dashboard dailyLog={currentDailyLog} allFoods={allFoods} allExercises={allExercises} />
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {MEAL_TYPES_ORDERED.map(mealType => (
                            <MealCard 
                                key={mealType}
                                mealType={mealType}
                                loggedFoods={currentDailyLog.meals[mealType]}
                                allFoods={allFoods}
                                onAddClick={() => { setModalTargetMeal(mealType); setFoodModalOpen(true); }}
                                onRemoveClick={(index) => handleRemoveFoodFromMeal(index, mealType)}
                            />
                        ))}
                    </div>
                    
                    <div className="space-y-6">
                        <ExerciseLog
                            loggedExercises={currentDailyLog.exercises}
                            allExercises={allExercises}
                            onAddClick={() => setExerciseModalOpen(true)}
                            onRemoveClick={handleRemoveExercise}
                        />
                        <WaterTracker waterIntake={currentDailyLog.water} onWaterChange={handleWaterChange} />
                    </div>
                </div>

                <div className="mt-6 flex flex-col md:flex-row gap-4">
                    <button onClick={() => setManageFoodModalOpen(true)} className="flex-1 btn-primary-outline">Gerenciar Meus Alimentos</button>
                    <button onClick={() => setManageExerciseModalOpen(true)} className="flex-1 btn-primary-outline">Gerenciar Meus Exercícios</button>
                </div>
                
                <WeeklyCharts logs={dailyLogs} allFoods={allFoods} allExercises={allExercises} />

            </main>

            {isFoodModalOpen && modalTargetMeal && (
                <AddItemsModal
                    isOpen={isFoodModalOpen}
                    onClose={() => setFoodModalOpen(false)}
                    title={`Adicionar em ${modalTargetMeal}`}
                    items={allFoods}
                    onAdd={(itemId, amount) => handleAddFoodToMeal(itemId, amount, modalTargetMeal)}
                    itemLabel="Alimento"
                    amountLabel="Gramas (g)"
                    itemDisplayFn={(item: Food) => `${item.name} (${item.calories} kcal)`}
                />
            )}

            {isExerciseModalOpen && (
                <AddItemsModal
                    isOpen={isExerciseModalOpen}
                    onClose={() => setExerciseModalOpen(false)}
                    title="Adicionar Exercício"
                    items={allExercises}
                    onAdd={handleAddExercise}
                    itemLabel="Exercício"
                    amountLabel="Minutos"
                    itemDisplayFn={(item: Exercise) => `${item.name} (~${item.caloriesBurned} kcal/h)`}
                />
            )}
            
            {isManageFoodModalOpen && (
                <ManageFoodModal
                    isOpen={isManageFoodModalOpen}
                    onClose={() => setManageFoodModalOpen(false)}
                    customFoods={customFoods}
                    onSave={saveCustomFood}
                    onDelete={deleteCustomFood}
                />
            )}

            {isManageExerciseModalOpen && (
                <ManageExerciseModal
                    isOpen={isManageExerciseModalOpen}
                    onClose={() => setManageExerciseModalOpen(false)}
                    customExercises={customExercises}
                    onSave={saveCustomExercise}
                    onDelete={deleteCustomExercise}
                />
            )}

            <style>{`
                .btn-primary { @apply bg-primary text-primary-content font-bold py-2 px-4 rounded-lg hover:bg-primary-focus transition-colors; }
                .btn-primary-outline { @apply bg-transparent border border-primary text-primary font-bold py-2 px-4 rounded-lg hover:bg-primary hover:text-primary-content transition-colors; }
                .input-field { @apply mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm; }
            `}</style>
        </div>
    );
};


// Sub-components that were too large to keep inside App.tsx
const MealCard: React.FC<{
    mealType: MealType,
    loggedFoods: LoggedFood[],
    allFoods: Food[],
    onAddClick: () => void,
    onRemoveClick: (index: number) => void
}> = ({ mealType, loggedFoods, allFoods, onAddClick, onRemoveClick }) => {
    const allFoodsMap = useMemo(() => new Map(allFoods.map(f => [f.id, f])), [allFoods]);
    const mealTotals = useMemo(() => {
        let calories = 0, protein = 0, carbs = 0, fat = 0;
        loggedFoods.forEach(lf => {
            const food = allFoodsMap.get(lf.foodId);
            if (food) {
                const multiplier = lf.grams / 100;
                calories += food.calories * multiplier;
                protein += food.protein * multiplier;
                carbs += food.carbs * multiplier;
                fat += food.fat * multiplier;
            }
        });
        return { calories, protein, carbs, fat };
    }, [loggedFoods, allFoodsMap]);

    return (
        <div className="bg-white p-4 rounded-2xl shadow-lg">
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-xl font-bold text-neutral">{mealType}</h3>
                <p className="font-semibold text-primary">{mealTotals.calories.toFixed(0)} kcal</p>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                {loggedFoods.map((lf, index) => {
                    const food = allFoodsMap.get(lf.foodId);
                    return (
                        <div key={index} className="flex justify-between items-center bg-base-100 p-2 rounded-lg">
                            <div>
                                <p className="font-semibold">{food?.name}</p>
                                <p className="text-sm text-gray-500">{lf.grams}g &bull; {(food ? food.calories * (lf.grams / 100) : 0).toFixed(0)} kcal</p>
                            </div>
                            <button onClick={() => onRemoveClick(index)} className="text-red-500 hover:text-red-700 p-1"><TrashIcon/></button>
                        </div>
                    );
                })}
            </div>
            <button onClick={onAddClick} className="w-full mt-3 btn-primary-outline flex items-center justify-center">
                <PlusIcon /> <span className="ml-1">Adicionar Alimento</span>
            </button>
        </div>
    );
};

const ExerciseLog: React.FC<{
    loggedExercises: LoggedExercise[],
    allExercises: Exercise[],
    onAddClick: () => void,
    onRemoveClick: (index: number) => void
}> = ({ loggedExercises, allExercises, onAddClick, onRemoveClick }) => {
    const allExercisesMap = useMemo(() => new Map(allExercises.map(e => [e.id, e])), [allExercises]);
    const totalCaloriesBurned = useMemo(() => {
        return loggedExercises.reduce((total, le) => {
            const exercise = allExercisesMap.get(le.exerciseId);
            return total + (exercise ? (exercise.caloriesBurned / 60) * le.minutes : 0);
        }, 0);
    }, [loggedExercises, allExercisesMap]);

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-xl font-bold text-neutral flex items-center"><DumbbellIcon /><span className="ml-2">Exercícios</span></h3>
                <p className="font-semibold text-accent">{totalCaloriesBurned.toFixed(0)} kcal</p>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                {loggedExercises.map((le, index) => {
                    const exercise = allExercisesMap.get(le.exerciseId);
                    return (
                        <div key={index} className="flex justify-between items-center bg-base-100 p-2 rounded-lg">
                            <div>
                                <p className="font-semibold">{exercise?.name}</p>
                                <p className="text-sm text-gray-500">{le.minutes} min &bull; {(exercise ? (exercise.caloriesBurned / 60) * le.minutes : 0).toFixed(0)} kcal</p>
                            </div>
                            <button onClick={() => onRemoveClick(index)} className="text-red-500 hover:text-red-700 p-1"><TrashIcon/></button>
                        </div>
                    );
                })}
            </div>
            <button onClick={onAddClick} className="w-full mt-3 btn-primary-outline flex items-center justify-center">
                <PlusIcon /> <span className="ml-1">Adicionar Exercício</span>
            </button>
        </div>
    );
};


interface AddItemsModalProps<T extends { id: string }> {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    items: T[];
    onAdd: (itemId: string, amount: number) => void;
    itemLabel: string;
    amountLabel: string;
    itemDisplayFn: (item: T) => string;
}

const AddItemsModal = <T extends { id: string },>({ isOpen, onClose, title, items, onAdd, itemLabel, amountLabel, itemDisplayFn }: AddItemsModalProps<T>) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedItem, setSelectedItem] = useState<string>('');
    const [amount, setAmount] = useState('');

    const filteredItems = useMemo(() =>
        items.filter(item => itemDisplayFn(item).toLowerCase().includes(searchTerm.toLowerCase())),
        [items, searchTerm, itemDisplayFn]
    );

    useEffect(() => {
        if(filteredItems.length > 0 && !selectedItem) {
            setSelectedItem(filteredItems[0].id);
        } else if (filteredItems.length === 0) {
            setSelectedItem('');
        }
    }, [filteredItems, selectedItem]);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedItem && amount) {
            onAdd(selectedItem, Number(amount));
            setSearchTerm('');
            setAmount('');
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder={`Buscar ${itemLabel}...`}
                    className="input-field w-full mb-4"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                    className="input-field w-full mb-4"
                    value={selectedItem}
                    onChange={(e) => setSelectedItem(e.target.value)}
                    size={5}
                >
                    {filteredItems.map(item => (
                        <option key={item.id} value={item.id}>
                            {itemDisplayFn(item)}
                        </option>
                    ))}
                </select>
                <div className="flex items-end gap-4">
                    <div className="flex-grow">
                        <label className="block text-sm font-medium text-gray-700">{amountLabel}</label>
                        <input
                            type="number"
                            className="input-field w-full"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            min="1"
                        />
                    </div>
                    <button type="submit" className="btn-primary h-10">Adicionar</button>
                </div>
            </form>
        </Modal>
    );
};

const ManageFoodModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    customFoods: Food[];
    onSave: (food: Food) => void;
    onDelete: (foodId: string) => void;
}> = ({ isOpen, onClose, customFoods, onSave, onDelete }) => {
    const emptyFood: Food = { id: '', name: '', calories: 0, protein: 0, carbs: 0, fat: 0, isCustom: true };
    const [editingFood, setEditingFood] = useState<Food | null>(null);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingFood) {
            onSave(editingFood);
            setEditingFood(null);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Gerenciar Alimentos">
            {editingFood ? (
                <form onSubmit={handleSave}>
                    <h4 className="font-semibold mb-2">{editingFood.id ? 'Editar' : 'Novo'} Alimento</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <input className="input-field col-span-2" placeholder="Nome" value={editingFood.name} onChange={e => setEditingFood({...editingFood, name: e.target.value})} required/>
                        <input className="input-field" type="number" placeholder="Calorias" value={editingFood.calories || ''} onChange={e => setEditingFood({...editingFood, calories: Number(e.target.value)})} required/>
                        <input className="input-field" type="number" placeholder="Proteínas (g)" value={editingFood.protein || ''} onChange={e => setEditingFood({...editingFood, protein: Number(e.target.value)})} required/>
                        <input className="input-field" type="number" placeholder="Carboidratos (g)" value={editingFood.carbs || ''} onChange={e => setEditingFood({...editingFood, carbs: Number(e.target.value)})} required/>
                        <input className="input-field" type="number" placeholder="Gorduras (g)" value={editingFood.fat || ''} onChange={e => setEditingFood({...editingFood, fat: Number(e.target.value)})} required/>
                    </div>
                    <div className="mt-4 flex gap-4">
                        <button type="submit" className="btn-primary flex-1">Salvar</button>
                        <button type="button" onClick={() => setEditingFood(null)} className="btn-primary-outline flex-1">Cancelar</button>
                    </div>
                </form>
            ) : (
                <>
                    <ul className="space-y-2 mb-4">
                        {customFoods.map(food => (
                            <li key={food.id} className="flex justify-between items-center p-2 bg-base-100 rounded">
                                <span>{food.name}</span>
                                <div className="space-x-2">
                                    <button onClick={() => setEditingFood(food)} className="p-1 text-blue-600"><PencilIcon/></button>
                                    <button onClick={() => onDelete(food.id)} className="p-1 text-red-600"><TrashIcon/></button>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <button onClick={() => setEditingFood(emptyFood)} className="btn-primary w-full">Adicionar Novo Alimento</button>
                </>
            )}
        </Modal>
    );
}

const ManageExerciseModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    customExercises: Exercise[];
    onSave: (exercise: Exercise) => void;
    onDelete: (exerciseId: string) => void;
}> = ({ isOpen, onClose, customExercises, onSave, onDelete }) => {
    const emptyExercise: Exercise = { id: '', name: '', caloriesBurned: 0, isCustom: true };
    const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingExercise) {
            onSave(editingExercise);
            setEditingExercise(null);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Gerenciar Exercícios">
            {editingExercise ? (
                <form onSubmit={handleSave}>
                    <h4 className="font-semibold mb-2">{editingExercise.id ? 'Editar' : 'Novo'} Exercício</h4>
                    <input className="input-field w-full mb-2" placeholder="Nome" value={editingExercise.name} onChange={e => setEditingExercise({...editingExercise, name: e.target.value})} required/>
                    <input className="input-field w-full" type="number" placeholder="Calorias Gastas por Hora" value={editingExercise.caloriesBurned || ''} onChange={e => setEditingExercise({...editingExercise, caloriesBurned: Number(e.target.value)})} required/>
                    <div className="mt-4 flex gap-4">
                        <button type="submit" className="btn-primary flex-1">Salvar</button>
                        <button type="button" onClick={() => setEditingExercise(null)} className="btn-primary-outline flex-1">Cancelar</button>
                    </div>
                </form>
            ) : (
                <>
                    <ul className="space-y-2 mb-4">
                        {customExercises.map(exercise => (
                            <li key={exercise.id} className="flex justify-between items-center p-2 bg-base-100 rounded">
                                <span>{exercise.name}</span>
                                <div className="space-x-2">
                                    <button onClick={() => setEditingExercise(exercise)} className="p-1 text-blue-600"><PencilIcon/></button>
                                    <button onClick={() => onDelete(exercise.id)} className="p-1 text-red-600"><TrashIcon/></button>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <button onClick={() => setEditingExercise(emptyExercise)} className="btn-primary w-full">Adicionar Novo Exercício</button>
                </>
            )}
        </Modal>
    );
};


export default App;
