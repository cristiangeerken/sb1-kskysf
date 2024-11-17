import React, { createContext, useContext, useState, useEffect } from 'react';
import { isSameDay } from 'date-fns';

type ChallengeType = 'consumo' | 'residuos' | 'electricidad' | 'combustible';

interface ChallengeHistory {
  challenge: string;
  challengeType: ChallengeType;
  status: 'cumplido' | 'no cumplido';
  date: string;
}

interface ChallengeContextType {
  currentChallenge: string | null;
  challengeType: ChallengeType;
  setChallengeType: (type: ChallengeType) => void;
  generateChallenge: () => void;
  markProgress: (completed: boolean) => void;
  resetProgress: () => void;
  stats: {
    completed: number;
    failed: number;
  };
  history: ChallengeHistory[];
  streakCount: number;
}

const challenges = {
  consumo: [
    "¡Sé un héroe del planeta! Compra productos locales y de temporada",
    "¡Misión especial! Evita usar productos desechables hoy",
    "¡Aventura verde! Elige productos con empaques reciclables",
    "¡Sé un campeón del intercambio! Comparte o intercambia ropa o juguetes",
    "¡Misión cero residuos! Compra a granel para reducir empaques"
  ],
  residuos: [
    "¡Conviértete en maestro del reciclaje! Separa residuos orgánicos e inorgánicos",
    "¡Misión creativa! Reutiliza envases y recipientes de forma divertida",
    "¡Sé un superhéroe comunitario! Participa en una limpieza local",
    "¡Aventura del compostaje! Transforma residuos orgánicos en abono",
    "¡Misión papel cero! Evita imprimir documentos innecesarios"
  ],
  electricidad: [
    "¡Sé un guardián de la energía! Desconecta dispositivos sin usar",
    "¡Misión luz inteligente! Usa bombillas de bajo consumo",
    "¡Aventura solar! Aprovecha la luz natural en lugar de la artificial",
    "¡Poder del ahorro! Apaga tu computadora cuando no la uses",
    "¡Misión eficiencia! Configura tus dispositivos en modo ahorro"
  ],
  combustible: [
    "¡Únete al club del transporte verde! Comparte el coche",
    "¡Aventura urbana! Usa transporte público hoy",
    "¡Misión mantenimiento! Cuida tu vehículo para reducir emisiones",
    "¡Sé un planificador experto! Organiza rutas eficientes",
    "¡Explora alternativas! Considera opciones de transporte sostenible"
  ]
};

const ChallengeContext = createContext<ChallengeContextType | null>(null);

export const ChallengeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentChallenge, setCurrentChallenge] = useState<string | null>(null);
  const [challengeType, setChallengeType] = useState<ChallengeType>('consumo');
  const [stats, setStats] = useState(() => ({
    completed: parseInt(localStorage.getItem('completed') || '0'),
    failed: parseInt(localStorage.getItem('failed') || '0')
  }));
  const [history, setHistory] = useState<ChallengeHistory[]>(() => {
    const saved = localStorage.getItem('history');
    return saved ? JSON.parse(saved) : [];
  });

  const streakCount = React.useMemo(() => {
    if (history.length === 0) return 0;

    const sortedHistory = [...history].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    let streak = 0;
    let currentDate = new Date();

    for (let i = 0; i < sortedHistory.length; i++) {
      const historyDate = new Date(sortedHistory[i].date);
      
      if (!isSameDay(currentDate, historyDate)) {
        break;
      }

      if (sortedHistory[i].status === 'cumplido') {
        streak++;
      }

      currentDate.setDate(currentDate.getDate() - 1);
    }

    return streak;
  }, [history]);

  useEffect(() => {
    localStorage.setItem('completed', stats.completed.toString());
    localStorage.setItem('failed', stats.failed.toString());
  }, [stats]);

  useEffect(() => {
    localStorage.setItem('history', JSON.stringify(history));
  }, [history]);

  const generateChallenge = () => {
    const availableChallenges = challenges[challengeType];
    const randomIndex = Math.floor(Math.random() * availableChallenges.length);
    setCurrentChallenge(availableChallenges[randomIndex]);
  };

  const markProgress = (completed: boolean) => {
    if (!currentChallenge) {
      alert('¡Primero genera un reto para comenzar tu aventura ecológica!');
      return;
    }

    const newHistory: ChallengeHistory = {
      challenge: currentChallenge,
      challengeType,
      status: completed ? 'cumplido' : 'no cumplido',
      date: new Date().toISOString()
    };

    setHistory(prev => [...prev, newHistory]);
    setStats(prev => ({
      completed: prev.completed + (completed ? 1 : 0),
      failed: prev.failed + (completed ? 0 : 1)
    }));
    setCurrentChallenge(null);
  };

  const resetProgress = () => {
    if (window.confirm('¿Estás seguro de que quieres reiniciar tu progreso? ¡Perderás toda tu historia de aventuras ecológicas!')) {
      setStats({ completed: 0, failed: 0 });
      setHistory([]);
      setCurrentChallenge(null);
      localStorage.clear();
    }
  };

  return (
    <ChallengeContext.Provider
      value={{
        currentChallenge,
        challengeType,
        setChallengeType,
        generateChallenge,
        markProgress,
        resetProgress,
        stats,
        history,
        streakCount
      }}
    >
      {children}
    </ChallengeContext.Provider>
  );
};

export const useChallengeContext = () => {
  const context = useContext(ChallengeContext);
  if (!context) {
    throw new Error('useChallengeContext must be used within a ChallengeProvider');
  }
  return context;
};