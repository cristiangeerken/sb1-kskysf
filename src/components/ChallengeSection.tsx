import React from 'react';
import { Trophy, XCircle, RefreshCw, Tree, Droplets, Zap, Car } from 'lucide-react';
import { useChallengeContext } from '../context/ChallengeContext';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';

const ChallengeTypeIcons = {
  consumo: Tree,
  residuos: Droplets,
  electricidad: Zap,
  combustible: Car,
};

const ChallengeSection = () => {
  const {
    currentChallenge,
    challengeType,
    setChallengeType,
    generateChallenge,
    markProgress,
    resetProgress,
    stats,
    streakCount,
  } = useChallengeContext();

  const [showConfetti, setShowConfetti] = React.useState(false);

  const handleSuccess = () => {
    setShowConfetti(true);
    markProgress(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const Icon = ChallengeTypeIcons[challengeType];

  return (
    <div className="space-y-8">
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8"
      >
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-green-800 mb-4">¡Elige tu Aventura Ecológica!</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Object.entries(ChallengeTypeIcons).map(([type, TypeIcon]) => (
              <button
                key={type}
                onClick={() => setChallengeType(type as any)}
                className={`p-4 rounded-xl flex flex-col items-center gap-2 transition-all ${
                  challengeType === type
                    ? 'bg-green-100 ring-2 ring-green-500 shadow-lg'
                    : 'bg-gray-50 hover:bg-green-50'
                }`}
              >
                <TypeIcon className={`w-8 h-8 ${
                  challengeType === type ? 'text-green-600' : 'text-gray-600'
                }`} />
                <span className="text-sm font-medium capitalize">{type}</span>
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentChallenge || 'empty'}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-6 bg-green-50 rounded-xl mb-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <Icon className="w-6 h-6 text-green-600" />
              <h2 className="text-lg font-medium text-green-800">Tu Reto Actual:</h2>
            </div>
            <p className="text-green-700 text-lg">
              {currentChallenge || "¡Haz clic en 'Generar Reto' para comenzar tu aventura ecológica!"}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="flex flex-wrap gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={generateChallenge}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            Generar Reto
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSuccess}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Trophy className="w-5 h-5" />
            ¡Cumplí mi reto!
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => markProgress(false)}
            className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            <XCircle className="w-5 h-5" />
            No pude cumplir
          </motion.button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8"
      >
        <h2 className="text-xl font-bold text-green-800 mb-6">Tu Progreso Ecológico</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-green-50 rounded-xl">
            <h3 className="text-lg font-medium text-green-800 mb-2">Retos Cumplidos</h3>
            <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
          </div>
          <div className="p-6 bg-orange-50 rounded-xl">
            <h3 className="text-lg font-medium text-orange-800 mb-2">Retos Pendientes</h3>
            <p className="text-3xl font-bold text-orange-600">{stats.failed}</p>
          </div>
          <div className="p-6 bg-blue-50 rounded-xl">
            <h3 className="text-lg font-medium text-blue-800 mb-2">Racha Actual</h3>
            <p className="text-3xl font-bold text-blue-600">{streakCount} días</p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={resetProgress}
          className="mt-6 px-6 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
        >
          Reiniciar Progreso
        </motion.button>
      </motion.div>
    </div>
  );
}

export default ChallengeSection;