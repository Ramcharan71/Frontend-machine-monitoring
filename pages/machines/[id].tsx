import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

export default function MachineDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [machine, setMachine] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    fetch(`${API_URL}/machines/${id}`, { 
      headers: { Authorization: `Bearer ${token}` } 
    })
      .then((r) => r.json())
      .then((d) => setMachine(d));
  }, [id]);

  if (!machine) return (
    <div className="detailsWrapper">
      <div className="loadingState">
        <div className="loadingSpinner"></div>
        <div>Loading machine details...</div>
      </div>
    </div>
  );

  const history: number[] = (machine.temperatureHistory as number[]) || [];
  const labels = history.map((_, i) => `T-${history.length - 1 - i}`);
  
  const chartData = {
    labels: labels.reverse(),
    datasets: [
      {
        label: 'Temperature (°C)',
        data: [...history].reverse(),
        borderColor: 'rgb(0, 245, 255)',
        backgroundColor: 'rgba(0, 245, 255, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointBackgroundColor: 'rgb(0, 245, 255)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: 'rgba(255, 255, 255, 0.8)',
          font: { size: 12, weight: 500 },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(0, 245, 255, 0.5)',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: 'rgba(255, 255, 255, 0.6)' },
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: 'rgba(255, 255, 255, 0.6)' },
      },
    },
  };

  function getStatusClass(status: string) {
    if (status === 'Running') return 'statusRunning';
    if (status === 'Idle') return 'statusIdle';
    return 'statusStopped';
  }

  return (
    <div className="detailsWrapper">
      <div className="detailsHeader">
        <button onClick={() => router.push('/')} className="backButton">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12 16l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Dashboard
        </button>
        
        <h1 className="detailsTitle">{machine.name}</h1>
        <p className="detailsSubtitle">Detailed machine monitoring and analytics</p>
      </div>

      <div className="detailsGrid">
        <div className="detailCard statusCard">
          <div className="cardHeader">
            <div className="cardIcon statusIcon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 6v6l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <div className="cardLabel">Status</div>
              <span className={`statusBadge ${getStatusClass(machine.status)}`}>
                <span className="statusDot"></span>
                {machine.status}
              </span>
            </div>
          </div>
        </div>

        <div className="detailCard tempCard">
          <div className="cardHeader">
            <div className="cardIcon tempIcon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 17a3 3 0 100-6 3 3 0 000 6z" fill="currentColor"/>
                <path d="M9 5v8a4 4 0 108 0V5a2 2 0 00-4 0v8a2 2 0 11-4 0V5a2 2 0 00-4 0z" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <div>
              <div className="cardLabel">Temperature</div>
              <div className="cardValue">{machine.temperature}°C</div>
            </div>
          </div>
        </div>

        <div className="detailCard energyCard">
          <div className="cardHeader">
            <div className="cardIcon energyIcon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M13 2L3 14h8l-1 8 10-12h-8l2-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <div className="cardLabel">Energy Consumption</div>
              <div className="cardValue">{machine.energyConsumption} kWh</div>
            </div>
          </div>
        </div>

        <div className="detailCard idCard">
          <div className="cardHeader">
            <div className="cardIcon idIcon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                <path d="M9 9h6M9 12h6M9 15h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <div className="cardLabel">Machine ID</div>
              <div className="cardValue">#{machine.id}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="chartSection">
        <div className="chartHeader">
          <h2 className="chartTitle">Temperature Trend</h2>
          <div className="chartInfo">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M8 4v5M8 11v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Real-time temperature monitoring
          </div>
        </div>
        <div className="chartWrapper">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}
