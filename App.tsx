import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Food, Exercise, MealType, DailyLog, LoggedFood, LoggedExercise } from './types';
import { PRE_CADASTRADO_FOODS, PRE_CADASTRADO_EXERCISES, MEAL_TYPES_ORDERED } from './constants';
import Dashboard from './components/Dashboard';
import WaterTracker from './components/WaterTracker';
import WeeklyCharts from './components/WeeklyCharts';
import Modal from './components/Modal';
import { PlusIcon, TrashIcon, PencilIcon, ChevronLeftIcon, ChevronRightIcon, DumbbellIcon, SettingsIcon, SunIcon, MoonIcon, Big2FitLogo } from './components/Icons';

// --- Type Definitions ---
interface User {
    email: string;
    name: string;
}

type View = 'login' | 'forgotPassword' | 'resetPassword' | 'app';
type Theme = 'light' | 'dark';


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

// --- Authentication Views ---
const Login: React.FC<{ 
    onLogin: (email: string, password:string, name?: string) => void;
    onForgotPasswordClick: () => void;
}> = ({ onLogin, onForgotPasswordClick }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [isLoginView, setIsLoginView] = useState(true);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email && password) {
            onLogin(email, password, isLoginView ? undefined : name);
        }
    };

    return (
        <div className="min-h-screen bg-base-100 dark:bg-gray-900 flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-sm">
                <div className="text-center mb-8">
                    <Big2FitLogo className="h-16 w-auto mx-auto mb-4" />
                    <p className="text-neutral/80 dark:text-base-300">{isLoginView ? 'Acesse sua conta para continuar' : 'Crie uma conta para começar'}</p>
                </div>
                <form onSubmit={handleSubmit} className="bg-white dark:bg-neutral shadow-2xl rounded-2xl px-8 pt-6 pb-8 mb-4">
                    {!isLoginView && (
                        <div className="mb-4">
                            <label className="block text-gray-700 dark:text-base-200 text-sm font-bold mb-2" htmlFor="name">
                                Nome
                            </label>
                            <input
                                id="name"
                                type="text"
                                placeholder="Seu nome"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="input-field w-full"
                                required
                            />
                        </div>
                    )}
                    <div className="mb-4">
                        <label className="block text-gray-700 dark:text-base-200 text-sm font-bold mb-2" htmlFor="email">
                            E-mail
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="seu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input-field w-full"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 dark:text-base-200 text-sm font-bold mb-2" htmlFor="password">
                            Senha
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-field w-full"
                            required
                        />
                         {isLoginView && (
                            <div className="text-right mt-1">
                                <button type="button" onClick={onForgotPasswordClick} className="text-xs text-primary hover:underline">
                                    Esqueceu a senha?
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center justify-between">
                        <button className="btn-primary w-full" type="submit">
                            {isLoginView ? 'Entrar' : 'Cadastrar'}
                        </button>
                    </div>
                </form>
                 <p className="text-center text-gray-500 dark:text-gray-400 text-xs">
                   {isLoginView ? 'Não tem uma conta?' : 'Já tem uma conta?'}
                   <button 
                       onClick={() => setIsLoginView(!isLoginView)} 
                       className="font-bold text-primary hover:underline ml-1"
                   >
                       {isLoginView ? 'Cadastre-se' : 'Entrar'}
                   </button>
                </p>
            </div>
             <style>{`
                .btn-primary { @apply bg-primary text-black dark:text-primary-content font-bold py-2 px-4 rounded-lg hover:bg-primary-focus transition-colors; }
                .input-field { @apply mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-base-300 dark:border-gray-600 text-neutral dark:text-base-content rounded-md shadow-sm placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm; }
            `}</style>
        </div>
    );
};

const ForgotPasswordView: React.FC<{ 
    onRequestReset: (email: string) => void,
    onBackToLogin: () => void 
}> = ({ onRequestReset, onBackToLogin }) => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        onRequestReset(email);
        setMessage('Se o e-mail estiver cadastrado, um link para redefinição de senha foi enviado. Verifique o console do navegador para o link de teste.');
    };

    return (
        <div className="min-h-screen bg-base-100 dark:bg-gray-900 flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-sm">
                 <div className="text-center mb-8">
                    <Big2FitLogo className="h-12 w-auto mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-neutral dark:text-base-content">Redefinir Senha</h1>
                </div>
                <form onSubmit={handleSubmit} className="bg-white dark:bg-neutral shadow-2xl rounded-2xl px-8 pt-6 pb-8 mb-4">
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                        Digite seu e-mail e enviaremos um link para você voltar a acessar sua conta.
                    </p>
                    {message ? (
                        <p className="bg-green-100 text-green-800 p-3 rounded-md text-sm mb-4">{message}</p>
                    ) : (
                        <>
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-base-200 text-sm font-bold mb-2" htmlFor="email-reset">
                                    E-mail
                                </label>
                                <input
                                    id="email-reset"
                                    type="email"
                                    placeholder="seu@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input-field w-full"
                                    required
                                />
                            </div>
                            <button className="btn-primary w-full" type="submit">
                                Enviar Link de Redefinição
                            </button>
                        </>
                    )}
                </form>
                <p className="text-center text-gray-500 dark:text-gray-400 text-xs">
                   Lembrou da senha?
                   <button onClick={onBackToLogin} className="font-bold text-primary hover:underline ml-1">
                       Voltar para o Login
                   </button>
                </p>
            </div>
        </div>
    );
};

const ResetPasswordView: React.FC<{
    onReset: (password: string) => void;
}> = ({ onReset }) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('As senhas não conferem.');
            return;
        }
        if (password.length < 6) {
             setError('A senha deve ter pelo menos 6 caracteres.');
            return;
        }
        setError('');
        onReset(password);
    };

    return (
        <div className="min-h-screen bg-base-100 dark:bg-gray-900 flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-sm">
                <div className="text-center mb-8">
                     <Big2FitLogo className="h-12 w-auto mx-auto mb-4" />
                     <h1 className="text-3xl font-bold text-neutral dark:text-base-content">Crie uma Nova Senha</h1>
                </div>
                <form onSubmit={handleSubmit} className="bg-white dark:bg-neutral shadow-2xl rounded-2xl px-8 pt-6 pb-8 mb-4">
                    <div className="mb-4">
                        <label className="block text-gray-700 dark:text-base-200 text-sm font-bold mb-2" htmlFor="new-password">
                           Nova Senha
                        </label>
                        <input
                            id="new-password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-field w-full"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 dark:text-base-200 text-sm font-bold mb-2" htmlFor="confirm-password">
                           Confirmar Nova Senha
                        </label>
                        <input
                            id="confirm-password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="input-field w-full"
                            required
                        />
                    </div>
                    {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
                    <button className="btn-primary w-full" type="submit">
                        Redefinir Senha
                    </button>
                </form>
            </div>
        </div>
    );
};


const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [view, setView] = useState<View>('login');
    const [resetToken, setResetToken] = useState<string | null>(null);
    const [theme, setTheme] = useState<Theme>('light');

    const [customFoods, setCustomFoods] = useState<Food[]>([]);
    const [customExercises, setCustomExercises] = useState<Exercise[]>([]);
    const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    
    const [isFoodModalOpen, setFoodModalOpen] = useState(false);
    const [isExerciseModalOpen, setExerciseModalOpen] = useState(false);
    const [modalTargetMeal, setModalTargetMeal] = useState<MealType | null>(null);

    const [isManageFoodModalOpen, setManageFoodModalOpen] = useState(false);
    const [isManageExerciseModalOpen, setManageExerciseModalOpen] = useState(false);
    
    const [editingFoodLog, setEditingFoodLog] = useState<{ mealType: MealType; index: number } | null>(null);
    const [editingExerciseLog, setEditingExerciseLog] = useState<{ index: number } | null>(null);

    const [isSettingsMenuOpen, setSettingsMenuOpen] = useState(false);
    const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);


    // --- Theme Logic ---
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as Theme;
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (savedTheme) {
            setTheme(savedTheme);
        } else if (prefersDark) {
            setTheme('dark');
        }
    }, []);

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);


    // --- Authentication and Data Loading Logic ---
    useEffect(() => {
        // Check for password reset token in URL
        const params = new URLSearchParams(window.location.search);
        const token = params.get('resetToken');
        if (token) {
            const tokensDbStr = localStorage.getItem('calorie-tracker-reset-tokens') || '{}';
            const tokensDb = JSON.parse(tokensDbStr);
            const tokenData = tokensDb[token];
            if (tokenData && tokenData.expires > Date.now()) {
                setView('resetPassword');
                setResetToken(token);
            } else {
                alert('Token de redefinição de senha inválido ou expirado.');
                if (tokensDb[token]) {
                    delete tokensDb[token];
                    localStorage.setItem('calorie-tracker-reset-tokens', JSON.stringify(tokensDb));
                }
                window.history.pushState({}, '', window.location.pathname);
            }
        } else {
            // Regular user login check
            const loggedInUserJSON = localStorage.getItem('calorie-tracker-user');
            if (loggedInUserJSON) {
                try {
                    setCurrentUser(JSON.parse(loggedInUserJSON));
                    setView('app');
                } catch (e) {
                    console.error("Failed to parse user from localStorage", e);
                    localStorage.removeItem('calorie-tracker-user');
                }
            }
        }
    }, []);

    useEffect(() => {
        if (currentUser) {
            const savedLogs = localStorage.getItem(`calorie-tracker-logs-${currentUser.email}`);
            const savedFoods = localStorage.getItem(`calorie-tracker-foods-${currentUser.email}`);
            const savedExercises = localStorage.getItem(`calorie-tracker-exercises-${currentUser.email}`);
            
            if (savedLogs) setDailyLogs(JSON.parse(savedLogs));
            if (savedFoods) setCustomFoods(JSON.parse(savedFoods));
            if (savedExercises) setCustomExercises(JSON.parse(savedExercises));
        } else {
            // Clear data if user logs out
            setDailyLogs([]);
            setCustomFoods([]);
            setCustomExercises([]);
        }
    }, [currentUser]);

    // --- Data Saving Logic ---
    useEffect(() => {
        if(currentUser) localStorage.setItem(`calorie-tracker-logs-${currentUser.email}`, JSON.stringify(dailyLogs));
    }, [dailyLogs, currentUser]);
    useEffect(() => {
        if(currentUser) localStorage.setItem(`calorie-tracker-foods-${currentUser.email}`, JSON.stringify(customFoods));
    }, [customFoods, currentUser]);
    useEffect(() => {
        if(currentUser) localStorage.setItem(`calorie-tracker-exercises-${currentUser.email}`, JSON.stringify(customExercises));
    }, [customExercises, currentUser]);
    
    const handleLogin = (email: string, password: string, name?: string) => {
        const usersDbStr = localStorage.getItem('calorie-tracker-users') || '{}';
        const usersDb = JSON.parse(usersDbStr);
        let userToLogin: User;

        if (name) { // Sign Up
            if (usersDb[email]) {
                alert('Este e-mail já está cadastrado.');
                return;
            }
            userToLogin = { email, name };
            usersDb[email] = { name, password }; // Storing password, in real-app hash it
            localStorage.setItem('calorie-tracker-users', JSON.stringify(usersDb));
        } else { // Sign In
            const existingUser = usersDb[email];
            if (!existingUser || existingUser.password !== password) {
                alert('E-mail ou senha incorretos.');
                return;
            }
            const retrievedName = existingUser.name || email.split('@')[0];
            userToLogin = { email, name: retrievedName };
        }
        
        setCurrentUser(userToLogin);
        localStorage.setItem('calorie-tracker-user', JSON.stringify(userToLogin));
        setView('app');
    };

    const handleLogout = () => {
        setCurrentUser(null);
        localStorage.removeItem('calorie-tracker-user');
        setView('login');
    };

    const handlePasswordResetRequest = (email: string) => {
        const usersDbStr = localStorage.getItem('calorie-tracker-users') || '{}';
        const usersDb = JSON.parse(usersDbStr);
        if (usersDb[email]) {
            const tokensDbStr = localStorage.getItem('calorie-tracker-reset-tokens') || '{}';
            const tokensDb = JSON.parse(tokensDbStr);
            const token = `reset-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            const expires = Date.now() + 15 * 60 * 1000; // 15 minutes
            tokensDb[token] = { email, expires };
            localStorage.setItem('calorie-tracker-reset-tokens', JSON.stringify(tokensDb));
            
            const resetLink = `${window.location.origin}${window.location.pathname}?resetToken=${token}`;
            console.log("SIMULATED EMAIL: Password reset link:", resetLink);
        }
    };

    const handlePasswordUpdate = (newPassword: string) => {
        if (!resetToken) return;

        const tokensDbStr = localStorage.getItem('calorie-tracker-reset-tokens') || '{}';
        const tokensDb = JSON.parse(tokensDbStr);
        const tokenData = tokensDb[resetToken];

        if (tokenData && tokenData.expires > Date.now()) {
            const usersDbStr = localStorage.getItem('calorie-tracker-users') || '{}';
            const usersDb = JSON.parse(usersDbStr);
            const userEmail = tokenData.email;

            if (usersDb[userEmail]) {
                usersDb[userEmail].password = newPassword;
                localStorage.setItem('calorie-tracker-users', JSON.stringify(usersDb));
                
                delete tokensDb[resetToken];
                localStorage.setItem('calorie-tracker-reset-tokens', JSON.stringify(tokensDb));

                alert('Senha atualizada com sucesso! Você já pode fazer o login.');
                setResetToken(null);
                setView('login');
                window.history.pushState({}, '', window.location.pathname);
            }
        } else {
             alert('Token de redefinição de senha inválido ou expirado.');
        }
    };

    const handleUpdateUserData = (newName: string, newPassword?: string) => {
        if (!currentUser) return;
    
        const usersDbStr = localStorage.getItem('calorie-tracker-users') || '{}';
        const usersDb = JSON.parse(usersDbStr);
    
        if (usersDb[currentUser.email]) {
            usersDb[currentUser.email].name = newName;
            if (newPassword) {
                usersDb[currentUser.email].password = newPassword; 
            }
        }
    
        localStorage.setItem('calorie-tracker-users', JSON.stringify(usersDb));
    
        const updatedUser = { ...currentUser, name: newName };
        setCurrentUser(updatedUser);
        localStorage.setItem('calorie-tracker-user', JSON.stringify(updatedUser));
    
        setSettingsModalOpen(false);
    };
    
    const selectedDateString = getFormattedDate(selectedDate);
    const currentDailyLog = useMemo(() => {
        let log = dailyLogs.find(log => log.date === selectedDateString);
        if (!log) {
            log = createNewDailyLog(selectedDateString);
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
        const newLog = JSON.parse(JSON.stringify(currentDailyLog));
        newLog.meals[mealType].push({ foodId, grams });
        updateDailyLog(newLog);
        setFoodModalOpen(false);
    };

    const handleUpdateFoodInMeal = (mealType: MealType, index: number, foodId: string, grams: number) => {
        if (grams <= 0) return;
        const newLog = JSON.parse(JSON.stringify(currentDailyLog));
        newLog.meals[mealType][index] = { foodId, grams };
        updateDailyLog(newLog);
        setEditingFoodLog(null);
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

    const handleUpdateExerciseInLog = (index: number, exerciseId: string, minutes: number) => {
        if (minutes <= 0) return;
        const newLog = JSON.parse(JSON.stringify(currentDailyLog));
        newLog.exercises[index] = { exerciseId, minutes };
        updateDailyLog(newLog);
        setEditingExerciseLog(null);
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

    if (view === 'login') {
        return <Login onLogin={handleLogin} onForgotPasswordClick={() => setView('forgotPassword')} />;
    }
    
    if (view === 'forgotPassword') {
        return <ForgotPasswordView onRequestReset={handlePasswordResetRequest} onBackToLogin={() => setView('login')} />;
    }

    if (view === 'resetPassword') {
        return <ResetPasswordView onReset={handlePasswordUpdate} />;
    }

    if (!currentUser) {
        // Fallback for initial loading state before useEffect kicks in
        return <div className="min-h-screen bg-base-100 dark:bg-gray-900 flex justify-center items-center"><p>Carregando...</p></div>;
    }

    return (
        <div className="min-h-screen bg-base-100 dark:bg-gray-900 text-base-content dark:text-gray-200">
            <header className="bg-neutral text-primary-content shadow-md p-4 flex justify-between items-center">
                <div className="flex items-center">
                    <Big2FitLogo className="h-10 w-auto"/>
                </div>
                <div className="flex items-center relative">
                    <span className="text-sm font-semibold mr-4 hidden sm:block">{currentUser.name}</span>
                    <button onClick={() => setSettingsMenuOpen(!isSettingsMenuOpen)} className="p-2 rounded-full hover:bg-white/10 transition-colors">
                        <SettingsIcon />
                    </button>
                    {isSettingsMenuOpen && (
                        <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-neutral rounded-lg shadow-xl py-1 z-10">
                            <button 
                                onClick={() => { setSettingsModalOpen(true); setSettingsMenuOpen(false); }}
                                className="w-full text-left px-4 py-2 text-sm text-neutral dark:text-base-content hover:bg-base-100 dark:hover:bg-gray-700"
                            >
                                Meus Dados
                            </button>
                            <button 
                                onClick={handleLogout} 
                                className="w-full text-left px-4 py-2 text-sm text-neutral dark:text-base-content hover:bg-base-100 dark:hover:bg-gray-700"
                            >
                                Sair
                            </button>
                            <div className="border-t border-base-300 dark:border-gray-600 my-1"></div>
                            <ThemeToggle theme={theme} setTheme={setTheme} />
                        </div>
                    )}
                </div>
            </header>
            
            <main className="p-4 md:p-8 max-w-7xl mx-auto">
                <div className="bg-white dark:bg-neutral p-4 rounded-xl shadow-md mb-6 flex justify-between items-center">
                    <button onClick={() => handleDateChange(-1)} className="p-2 rounded-full hover:bg-base-200 dark:hover:bg-gray-700"><ChevronLeftIcon/></button>
                    <h2 className="text-xl font-semibold">{new Intl.DateTimeFormat('pt-BR', { dateStyle: 'full' }).format(selectedDate)}</h2>
                    <button onClick={() => handleDateChange(1)} className="p-2 rounded-full hover:bg-base-200 dark:hover:bg-gray-700"><ChevronRightIcon/></button>
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
                                onEditClick={(index) => setEditingFoodLog({ mealType, index })}
                            />
                        ))}
                    </div>
                    
                    <div className="space-y-6">
                        <ExerciseLog
                            loggedExercises={currentDailyLog.exercises}
                            allExercises={allExercises}
                            onAddClick={() => setExerciseModalOpen(true)}
                            onRemoveClick={handleRemoveExercise}
                            onEditClick={(index) => setEditingExerciseLog({ index })}
                        />
                        <WaterTracker waterIntake={currentDailyLog.water} onWaterChange={handleWaterChange} />
                    </div>
                </div>

                <div className="mt-6 flex flex-col md:flex-row gap-4">
                    <button onClick={() => setManageFoodModalOpen(true)} className="flex-1 btn-primary-outline">Gerenciar Meus Alimentos</button>
                    <button onClick={() => setManageExerciseModalOpen(true)} className="flex-1 btn-primary-outline">Gerenciar Meus Exercícios</button>
                </div>
                
                <WeeklyCharts logs={dailyLogs} allFoods={allFoods} allExercises={allExercises} theme={theme} />

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
            
            {editingFoodLog && (
                <EditFoodLogModal
                    isOpen={!!editingFoodLog}
                    onClose={() => setEditingFoodLog(null)}
                    allFoods={allFoods}
                    logToEdit={currentDailyLog.meals[editingFoodLog.mealType][editingFoodLog.index]}
                    onSave={(foodId, grams) => handleUpdateFoodInMeal(editingFoodLog.mealType, editingFoodLog.index, foodId, grams)}
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

            {editingExerciseLog && (
                <EditExerciseLogModal
                    isOpen={!!editingExerciseLog}
                    onClose={() => setEditingExerciseLog(null)}
                    allExercises={allExercises}
                    logToEdit={currentDailyLog.exercises[editingExerciseLog.index]}
                    onSave={(exerciseId, minutes) => handleUpdateExerciseInLog(editingExerciseLog.index, exerciseId, minutes)}
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

            {isSettingsModalOpen && currentUser && (
                <SettingsModal
                    isOpen={isSettingsModalOpen}
                    onClose={() => setSettingsModalOpen(false)}
                    user={currentUser}
                    onSave={handleUpdateUserData}
                />
            )}

            <style>{`
                .btn-primary { @apply bg-primary text-primary-content font-bold py-2 px-4 rounded-lg hover:bg-primary-focus transition-colors; }
                .btn-primary-outline { @apply bg-transparent border border-primary text-primary font-bold py-2 px-4 rounded-lg hover:bg-primary hover:text-primary-content transition-colors dark:text-primary dark:hover:text-primary-content; }
                .input-field { @apply mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-base-300 dark:border-gray-600 text-neutral dark:text-base-content rounded-md shadow-sm placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm; }
            `}</style>
        </div>
    );
};


// Sub-components that were too large to keep inside App.tsx
const ThemeToggle: React.FC<{ theme: Theme; setTheme: (theme: Theme) => void; }> = ({ theme, setTheme }) => {
    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    return (
        <div className="px-4 py-2 flex justify-between items-center text-sm text-neutral dark:text-base-content">
            <span>Tema</span>
            <button
                onClick={toggleTheme}
                className="p-1.5 rounded-full bg-base-200 dark:bg-gray-700 flex items-center"
            >
                <span className={`p-1 rounded-full transition-colors ${theme === 'light' ? 'bg-primary text-white' : 'text-gray-400'}`}><SunIcon /></span>
                <span className={`p-1 rounded-full transition-colors ${theme === 'dark' ? 'bg-primary text-white' : 'text-gray-400'}`}><MoonIcon /></span>
            </button>
        </div>
    );
};

const MealCard: React.FC<{
    mealType: MealType,
    loggedFoods: LoggedFood[],
    allFoods: Food[],
    onAddClick: () => void,
    onRemoveClick: (index: number) => void,
    onEditClick: (index: number) => void
}> = ({ mealType, loggedFoods, allFoods, onAddClick, onRemoveClick, onEditClick }) => {
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
        <div className="bg-white dark:bg-neutral p-4 rounded-2xl shadow-lg">
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-xl font-bold text-neutral dark:text-base-content">{mealType}</h3>
                <p className="font-semibold text-primary">{mealTotals.calories.toFixed(0)} kcal</p>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                {loggedFoods.map((lf, index) => {
                    const food = allFoodsMap.get(lf.foodId);
                    return (
                        <div key={index} className="flex justify-between items-center bg-base-100 dark:bg-gray-800 p-2 rounded-lg">
                            <div>
                                <p className="font-semibold text-neutral dark:text-base-content">{food?.name}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{lf.grams}g &bull; {(food ? food.calories * (lf.grams / 100) : 0).toFixed(0)} kcal</p>
                            </div>
                            <div className="flex items-center space-x-1">
                                <button onClick={() => onEditClick(index)} className="text-blue-500 hover:text-blue-700 p-1"><PencilIcon/></button>
                                <button onClick={() => onRemoveClick(index)} className="text-red-500 hover:text-red-700 p-1"><TrashIcon/></button>
                            </div>
                        </div>
                    );
                })}
                 {loggedFoods.length === 0 && <p className="text-center text-sm text-gray-400 dark:text-gray-500 py-4">Nenhum alimento adicionado.</p>}
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
    onRemoveClick: (index: number) => void,
    onEditClick: (index: number) => void
}> = ({ loggedExercises, allExercises, onAddClick, onRemoveClick, onEditClick }) => {
    const allExercisesMap = useMemo(() => new Map(allExercises.map(e => [e.id, e])), [allExercises]);
    const totalCaloriesBurned = useMemo(() => {
        return loggedExercises.reduce((total, le) => {
            const exercise = allExercisesMap.get(le.exerciseId);
            return total + (exercise ? (exercise.caloriesBurned / 60) * le.minutes : 0);
        }, 0);
    }, [loggedExercises, allExercisesMap]);

    return (
        <div className="bg-white dark:bg-neutral p-6 rounded-2xl shadow-lg">
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-xl font-bold text-neutral dark:text-base-content flex items-center"><DumbbellIcon /><span className="ml-2">Exercícios</span></h3>
                <p className="font-semibold text-accent">{totalCaloriesBurned.toFixed(0)} kcal</p>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                {loggedExercises.map((le, index) => {
                    const exercise = allExercisesMap.get(le.exerciseId);
                    return (
                        <div key={index} className="flex justify-between items-center bg-base-100 dark:bg-gray-800 p-2 rounded-lg">
                            <div>
                                <p className="font-semibold text-neutral dark:text-base-content">{exercise?.name}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{le.minutes} min &bull; {(exercise ? (exercise.caloriesBurned / 60) * le.minutes : 0).toFixed(0)} kcal</p>
                            </div>
                            <div className="flex items-center space-x-1">
                                <button onClick={() => onEditClick(index)} className="text-blue-500 hover:text-blue-700 p-1"><PencilIcon/></button>
                                <button onClick={() => onRemoveClick(index)} className="text-red-500 hover:text-red-700 p-1"><TrashIcon/></button>
                            </div>
                        </div>
                    );
                })}
                 {loggedExercises.length === 0 && <p className="text-center text-sm text-gray-400 dark:text-gray-500 py-4">Nenhum exercício adicionado.</p>}
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
    const [selectedCalorieRange, setSelectedCalorieRange] = useState<string | null>(null);
    const [filterByMacro, setFilterByMacro] = useState<'protein' | 'carbs' | 'fat' | null>(null);


    const filteredItems = useMemo(() => {
        let filtered = items.filter(item => 
            itemDisplayFn(item).toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (itemLabel === 'Alimento') {
            const foodItems = filtered as unknown as Food[];
            // Apply calorie range filter
            if (selectedCalorieRange) {
                filtered = foodItems.filter(item => {
                    const cals = item.calories;
                    if (selectedCalorieRange === '0-100') return cals >= 0 && cals <= 100;
                    if (selectedCalorieRange === '100-200') return cals > 100 && cals <= 200;
                    if (selectedCalorieRange === '200-400') return cals > 200 && cals <= 400;
                    if (selectedCalorieRange === '>400') return cals > 400;
                    return true;
                }) as unknown as T[];
            }

            // Apply macro filter
            if (filterByMacro) {
                 filtered = (filtered as unknown as Food[]).filter(item => {
                    if (filterByMacro === 'protein') {
                        return item.protein > item.carbs && item.protein > item.fat;
                    }
                    if (filterByMacro === 'carbs') {
                        return item.carbs > item.protein && item.carbs > item.fat;
                    }
                    if (filterByMacro === 'fat') {
                        return item.fat > item.protein && item.fat > item.carbs;
                    }
                    return true;
                 }) as unknown as T[];
            }
        }
        return filtered;
    }, [items, searchTerm, itemDisplayFn, itemLabel, selectedCalorieRange, filterByMacro]);

    useEffect(() => {
        if (filteredItems.length > 0) {
            const isSelectedInList = filteredItems.some(item => item.id === selectedItem);
            if (!isSelectedInList) {
                setSelectedItem(filteredItems[0].id);
            }
        } else {
            setSelectedItem('');
        }
    }, [filteredItems, selectedItem]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedItem && amount) {
            onAdd(selectedItem, Number(amount));
            setSearchTerm('');
            setAmount('');
            setFilterByMacro(null);
            setSelectedCalorieRange(null);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder={`Buscar ${itemLabel}...`}
                    className="input-field w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                {itemLabel === 'Alimento' && (
                    <div className="my-4 p-3 bg-base-100 dark:bg-gray-800 rounded-lg space-y-4">
                         <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Faixa de Calorias (por 100g)</label>
                            <div className="flex flex-wrap gap-2">
                                {(['0-100', '100-200', '200-400', '>400'] as const).map((range) => (
                                    <button
                                        type="button"
                                        key={range}
                                        onClick={() => setSelectedCalorieRange(prev => prev === range ? null : range)}
                                        className={`flex-1 text-sm py-1.5 px-2 rounded-md transition-colors font-semibold min-w-[80px] ${selectedCalorieRange === range ? 'bg-primary text-white' : 'bg-base-200 dark:bg-gray-700 hover:bg-base-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'}`}
                                    >
                                        {range} kcal
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Filtrar por Macro Dominante</label>
                            <div className="flex flex-wrap gap-2">
                                {(['protein', 'carbs', 'fat'] as const).map((macro) => {
                                    const labels = { protein: 'Proteína', carbs: 'Carboidratos', fat: 'Gordura' };
                                    return (
                                        <button
                                            type="button"
                                            key={macro}
                                            onClick={() => setFilterByMacro(prev => prev === macro ? null : macro)}
                                            className={`flex-1 text-sm py-1.5 px-2 rounded-md transition-colors font-semibold min-w-[80px] ${filterByMacro === macro ? 'bg-primary text-white' : 'bg-base-200 dark:bg-gray-700 hover:bg-base-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'}`}
                                        >
                                            {labels[macro]}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                )}
                
                <select
                    className="input-field w-full my-4"
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
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{amountLabel}</label>
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

const EditFoodLogModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    allFoods: Food[];
    logToEdit: LoggedFood;
    onSave: (foodId: string, grams: number) => void;
}> = ({ isOpen, onClose, allFoods, logToEdit, onSave }) => {
    const [selectedFoodId, setSelectedFoodId] = useState(logToEdit.foodId);
    const [grams, setGrams] = useState(logToEdit.grams);

    useEffect(() => {
        setSelectedFoodId(logToEdit.foodId);
        setGrams(logToEdit.grams);
    }, [logToEdit]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(selectedFoodId, Number(grams));
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Editar Alimento">
            <form onSubmit={handleSubmit}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Alimento</label>
                <select
                    className="input-field w-full mb-4"
                    value={selectedFoodId}
                    onChange={(e) => setSelectedFoodId(e.target.value)}
                >
                    {allFoods.map(food => (
                        <option key={food.id} value={food.id}>
                            {`${food.name} (${food.calories} kcal)`}
                        </option>
                    ))}
                </select>
                <div className="flex items-end gap-4">
                    <div className="flex-grow">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Gramas (g)</label>
                        <input
                            type="number"
                            className="input-field w-full"
                            value={grams}
                            onChange={(e) => setGrams(Number(e.target.value))}
                            min="1"
                        />
                    </div>
                    <button type="submit" className="btn-primary h-10">Salvar Alterações</button>
                </div>
            </form>
        </Modal>
    );
};

const EditExerciseLogModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    allExercises: Exercise[];
    logToEdit: LoggedExercise;
    onSave: (exerciseId: string, minutes: number) => void;
}> = ({ isOpen, onClose, allExercises, logToEdit, onSave }) => {
    const [selectedExerciseId, setSelectedExerciseId] = useState(logToEdit.exerciseId);
    const [minutes, setMinutes] = useState(logToEdit.minutes);

    useEffect(() => {
        setSelectedExerciseId(logToEdit.exerciseId);
        setMinutes(logToEdit.minutes);
    }, [logToEdit]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(selectedExerciseId, Number(minutes));
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Editar Exercício">
            <form onSubmit={handleSubmit}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Exercício</label>
                <select
                    className="input-field w-full mb-4"
                    value={selectedExerciseId}
                    onChange={(e) => setSelectedExerciseId(e.target.value)}
                >
                    {allExercises.map(exercise => (
                        <option key={exercise.id} value={exercise.id}>
                            {`${exercise.name} (~${exercise.caloriesBurned} kcal/h)`}
                        </option>
                    ))}
                </select>
                <div className="flex items-end gap-4">
                    <div className="flex-grow">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Minutos</label>
                        <input
                            type="number"
                            className="input-field w-full"
                            value={minutes}
                            onChange={(e) => setMinutes(Number(e.target.value))}
                            min="1"
                        />
                    </div>
                    <button type="submit" className="btn-primary h-10">Salvar Alterações</button>
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
    
    const handleClose = () => {
        setEditingFood(null);
        onClose();
    }

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Gerenciar Alimentos">
            {editingFood ? (
                <form onSubmit={handleSave}>
                    <h4 className="font-semibold mb-2 dark:text-base-content">{editingFood.id ? 'Editar' : 'Novo'} Alimento</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <input className="input-field col-span-2" placeholder="Nome" value={editingFood.name} onChange={e => setEditingFood({...editingFood, name: e.target.value})} required/>
                        <input className="input-field" type="number" placeholder="Calorias" value={editingFood.calories || ''} onChange={e => setEditingFood({...editingFood, calories: Number(e.target.value)})} required min="0"/>
                        <input className="input-field" type="number" placeholder="Proteínas (g)" value={editingFood.protein || ''} onChange={e => setEditingFood({...editingFood, protein: Number(e.target.value)})} required min="0"/>
                        <input className="input-field" type="number" placeholder="Carboidratos (g)" value={editingFood.carbs || ''} onChange={e => setEditingFood({...editingFood, carbs: Number(e.target.value)})} required min="0"/>
                        <input className="input-field" type="number" placeholder="Gorduras (g)" value={editingFood.fat || ''} onChange={e => setEditingFood({...editingFood, fat: Number(e.target.value)})} required min="0"/>
                    </div>
                    <div className="mt-4 flex gap-4">
                        <button type="submit" className="btn-primary flex-1">Salvar</button>
                        <button type="button" onClick={() => setEditingFood(null)} className="btn-primary-outline flex-1">Cancelar</button>
                    </div>
                </form>
            ) : (
                <>
                    <ul className="space-y-2 mb-4 max-h-80 overflow-y-auto">
                        {customFoods.length > 0 ? customFoods.map(food => (
                            <li key={food.id} className="flex justify-between items-center p-2 bg-base-100 dark:bg-gray-800 rounded">
                                <span className="dark:text-base-content">{food.name}</span>
                                <div className="space-x-2">
                                    <button onClick={() => setEditingFood(food)} className="p-1 text-blue-600"><PencilIcon/></button>
                                    <button onClick={() => onDelete(food.id)} className="p-1 text-red-600"><TrashIcon/></button>
                                </div>
                            </li>
                        )) : <p className="text-center text-gray-500">Nenhum alimento personalizado.</p>}
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
    
    const handleClose = () => {
        setEditingExercise(null);
        onClose();
    }

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Gerenciar Exercícios">
            {editingExercise ? (
                <form onSubmit={handleSave}>
                    <h4 className="font-semibold mb-2 dark:text-base-content">{editingExercise.id ? 'Editar' : 'Novo'} Exercício</h4>
                    <input className="input-field w-full mb-2" placeholder="Nome" value={editingExercise.name} onChange={e => setEditingExercise({...editingExercise, name: e.target.value})} required/>
                    <input className="input-field w-full" type="number" placeholder="Calorias Gastas por Hora" value={editingExercise.caloriesBurned || ''} onChange={e => setEditingExercise({...editingExercise, caloriesBurned: Number(e.target.value)})} required min="0"/>
                    <div className="mt-4 flex gap-4">
                        <button type="submit" className="btn-primary flex-1">Salvar</button>
                        <button type="button" onClick={() => setEditingExercise(null)} className="btn-primary-outline flex-1">Cancelar</button>
                    </div>
                </form>
            ) : (
                <>
                    <ul className="space-y-2 mb-4 max-h-80 overflow-y-auto">
                        {customExercises.length > 0 ? customExercises.map(exercise => (
                            <li key={exercise.id} className="flex justify-between items-center p-2 bg-base-100 dark:bg-gray-800 rounded">
                                <span className="dark:text-base-content">{exercise.name}</span>
                                <div className="space-x-2">
                                    <button onClick={() => setEditingExercise(exercise)} className="p-1 text-blue-600"><PencilIcon/></button>
                                    <button onClick={() => onDelete(exercise.id)} className="p-1 text-red-600"><TrashIcon/></button>
                                </div>
                            </li>
                        )) : <p className="text-center text-gray-500">Nenhum exercício personalizado.</p>}
                    </ul>
                    <button onClick={() => setEditingExercise(emptyExercise)} className="btn-primary w-full">Adicionar Novo Exercício</button>
                </>
            )}
        </Modal>
    );
};

const SettingsModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    user: User;
    onSave: (newName: string, newPassword?: string) => void;
}> = ({ isOpen, onClose, user, onSave }) => {
    const [name, setName] = useState(user.name);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            setName(user.name);
            setPassword('');
            setConfirmPassword('');
            setError('');
        }
    }, [isOpen, user]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('As senhas não conferem.');
            return;
        }
        setError('');
        onSave(name, password || undefined);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Meus Dados">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">E-mail</label>
                    <p className="text-gray-500 dark:text-gray-400 bg-base-100 dark:bg-gray-800 p-2 rounded-md">{user.email}</p>
                </div>
                <div>
                    <label htmlFor="settings-name" className="block text-sm font-bold text-gray-700 dark:text-gray-300">Nome</label>
                    <input
                        id="settings-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="input-field w-full"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="settings-password"  className="block text-sm font-bold text-gray-700 dark:text-gray-300">Nova Senha (deixe em branco para não alterar)</label>
                    <input
                        id="settings-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input-field w-full"
                    />
                </div>
                <div>
                    <label htmlFor="settings-confirm-password"  className="block text-sm font-bold text-gray-700 dark:text-gray-300">Confirmar Nova Senha</label>
                    <input
                        id="settings-confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="input-field w-full"
                    />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <div className="pt-2">
                    <button type="submit" className="btn-primary w-full">Salvar Alterações</button>
                </div>
            </form>
        </Modal>
    );
};


export default App;