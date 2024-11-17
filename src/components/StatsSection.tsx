import React from 'react';
import { useChallengeContext } from '../context/ChallengeContext';
import { format, subDays, eachDayOfInterval } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { motion } from 'framer-motion';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const StatsSection = () => {
  const { stats, history } = useChallengeContext();
  const [timeRange, setTimeRange] = React.useState(30); // días por defecto

  const completionData = {
    labels: ['Cumplidos', 'No Cumplidos'],
    datasets: [{
      data: [stats.completed, stats.failed],
      backgroundColor: ['#22c55e', '#f97316'],
      borderWidth: 0,
    }],
  };

  const typeCounts = React.useMemo(() => {
    const counts = {
      consumo: { completed: 0, failed: 0 },
      residuos: { completed: 0, failed: 0 },
      electricidad: { completed: 0, failed: 0 },
      combustible: { completed: 0, failed: 0 },
    };

    history.forEach(item => {
      if (item.status === 'cumplido') {
        counts[item.challengeType].completed++;
      } else {
        counts[item.challengeType].failed++;
      }
    });

    return counts;
  }, [history]);

  const typeData = {
    labels: ['Consumo', 'Residuos', 'Electricidad', 'Combustible'],
    datasets: [
      {
        label: 'Cumplidos',
        data: Object.values(typeCounts).map(v => v.completed),
        backgroundColor: '#22c55e',
        borderRadius: 6,
      },
      {
        label: 'No Cumplidos',
        data: Object.values(typeCounts).map(v => v.failed),
        backgroundColor: '#f97316',
        borderRadius: 6,
      },
    ],
  };

  const trendData = React.useMemo(() => {
    const endDate = new Date();
    const startDate = subDays(endDate, timeRange);
    
    const dateRange = eachDayOfInterval({ start: startDate, end: endDate });
    const dataPoints = dateRange.map(date => {
      const dayHistory = history.filter(item => {
        const itemDate = new Date(item.date);
        return format(itemDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
      });

      return {
        date: format(date, 'd MMM', { locale: es }),
        completed: dayHistory.filter(h => h.status === 'cumplido').length,
        failed: dayHistory.filter(h => h.status === 'no cumplido').length,
      };
    });

    return {
      labels: dataPoints.map(d => d.date),
      datasets: [
        {
          label: 'Cumplidos',
          data: dataPoints.map(d => d.completed),
          borderColor: '#22c55e',
          backgroundColor: '#22c55e20',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
        {
          label: 'No Cumplidos',
          data: dataPoints.map(d => d.failed),
          borderColor: '#f97316',
          backgroundColor: '#f9731620',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    };
  }, [history, timeRange]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#1f2937',
        bodyColor: '#1f2937',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-end mb-4">
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(Number(e.target.value))}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value={7}>Última semana</option>
          <option value={30}>Último mes</option>
          <option value={90}>Últimos 3 meses</option>
          <option value={365}>Último año</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-2xl shadow-xl"
        >
          <h3 className="text-lg font-medium text-gray-800 mb-4">Resumen de Retos</h3>
          <div className="w-full aspect-square">
            <Doughnut 
              data={completionData}
              options={{
                ...chartOptions,
                cutout: '60%',
              }}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-2xl shadow-xl"
        >
          <h3 className="text-lg font-medium text-gray-800 mb-4">Distribución por Tipo</h3>
          <Bar
            data={typeData}
            options={{
              ...chartOptions,
              scales: {
                x: {
                  stacked: true,
                },
                y: {
                  stacked: true,
                  beginAtZero: true,
                  ticks: {
                    stepSize: 1,
                  },
                },
              },
            }}
          />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white p-6 rounded-2xl shadow-xl"
      >
        <h3 className="text-lg font-medium text-gray-800 mb-4">Tendencia de Retos</h3>
        <Line
          data={trendData}
          options={chartOptions}
        />
      </motion.div>
    </div>
  );
};

export default StatsSection;