import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

type Machine = {
  id: number;
  name: string;
  status: string;
  temperature: number;
  energyConsumption: number;
};

export default function Dashboard() {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  function getToken() {
    return typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  }

  async function fetchMachines() {
    const token = getToken();
    if (!token) {
      router.push('/login');
      return;
    }
    setLoading(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const res = await fetch(`${API_URL}/machines`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem('token');
        router.push('/login');
        return;
      }
      const data = await res.json();
      setMachines(data);
    } catch (error) {
      console.error('Failed to fetch machines:', error);
      // Optionally show an error message to the user
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMachines();
    const id = setInterval(fetchMachines, 10000);
    return () => clearInterval(id);
  }, []);

  function logout() {
    localStorage.removeItem('token');
    router.push('/login');
  }

  const runningCount = machines.filter((m) => m.status === 'Running').length;
  const idleCount = machines.filter((m) => m.status === 'Idle').length;
  const stoppedCount = machines.filter((m) => m.status === 'Stopped').length;
  const avgTemp =
    machines.length > 0
      ? Math.round(
          machines.reduce((sum, m) => sum + m.temperature, 0) / machines.length
        )
      : 0;

  function getStatusClass(status: string) {
    if (status === 'Running') return 'statusRunning';
    if (status === 'Idle') return 'statusIdle';
    return 'statusStopped';
  }

  return (
    <div className="dashboardWrapper">
      <div className="dashboardHeader">
        <div className="headerLeft">
          <h1 className="dashboardTitle">Machine Monitoring Dashboard</h1>
          <p className="dashboardSubtitle">Real-time monitoring system</p>
        </div>
        <div className="headerRight">
          <div className="userInfo">
            <div className="avatar">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
                <path
                  d="M4 20c0-4 3.5-7 8-7s8 3 8 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="userDetails">
              <div className="userName">Admin User</div>
              <div className="userEmail">admin@example.com</div>
            </div>
          </div>
          <button onClick={logout} className="logoutButton">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M7 16H4a2 2 0 01-2-2V4a2 2 0 012-2h3M12 13l4-4-4-4M16 9H7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Logout
          </button>
        </div>
      </div>

      <div className="statsGrid">
        <div className="statCard statCard1">
          <div className="statIcon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="2" />
              <path d="M16 8v8l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div className="statContent">
            <div className="statValue">{runningCount}</div>
            <div className="statLabel">Running</div>
          </div>
        </div>

        <div className="statCard statCard2">
          <div className="statIcon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="2" />
              <path d="M12 16h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div className="statContent">
            <div className="statValue">{idleCount}</div>
            <div className="statLabel">Idle</div>
          </div>
        </div>

        <div className="statCard statCard3">
          <div className="statIcon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="2" />
              <path d="M16 12v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div className="statContent">
            <div className="statValue">{stoppedCount}</div>
            <div className="statLabel">Stopped</div>
          </div>
        </div>

        <div className="statCard statCard4">
          <div className="statIcon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path
                d="M16 6v4M16 22v4M6 16h4M22 16h4M9.5 9.5l2.8 2.8M19.7 19.7l2.8 2.8M9.5 22.5l2.8-2.8M19.7 12.3l2.8-2.8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="16" cy="16" r="4" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
          <div className="statContent">
            <div className="statValue">{avgTemp}°C</div>
            <div className="statLabel">Avg Temp</div>
          </div>
        </div>
      </div>

      <div className="mainContent">
        <div className="contentHeader">
          <h2 className="sectionTitle">All Machines</h2>
          <div className="refreshIndicator">
            <div className="pulseIcon"></div>
            Auto-refresh: 10s
          </div>
        </div>

        {loading ? (
          <div className="loadingState">
            <div className="loadingSpinner"></div>
            <div>Loading machines...</div>
          </div>
        ) : (
          <div className="tableContainer">
            <table className="machineTable">
              <thead>
                <tr>
                  <th>Machine Name</th>
                  <th>Status</th>
                  <th>Temperature</th>
                  <th>Energy Consumption</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {machines.map((m) => (
                  <tr
                    key={m.id}
                    className="tableRow"
                    onClick={() => router.push(`/machines/${m.id}`)}
                  >
                    <td>
                      <div className="machineNameCell">
                        <div className="machineIcon">
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <rect
                              x="2"
                              y="2"
                              width="16"
                              height="16"
                              rx="2"
                              stroke="currentColor"
                              strokeWidth="1.5"
                            />
                            <path
                              d="M6 6h8M6 10h8M6 14h5"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                            />
                          </svg>
                        </div>
                        <span className="machineName">{m.name}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`statusBadge ${getStatusClass(m.status)}`}>
                        <span className="statusDot"></span>
                        {m.status}
                      </span>
                    </td>
                    <td>
                      <div className="tempCell">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M8 11a2 2 0 100-4 2 2 0 000 4z" fill="currentColor" />
                          <path
                            d="M6 3v5a3 3 0 106 0V3a1 1 0 00-2 0v5a1 1 0 11-2 0V3a1 1 0 00-2 0z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          />
                        </svg>
                        <span className="tempValue">{m.temperature}°C</span>
                      </div>
                    </td>
                    <td>
                      <div className="energyCell">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path
                            d="M9 2L5 8h4l-2 6 6-8H9l2-4z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span className="energyValue">{m.energyConsumption} kWh</span>
                      </div>
                    </td>
                    <td>
                      <button
                        className="viewButton"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/machines/${m.id}`);
                        }}
                      >
                        View Details
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path
                            d="M6 4l4 4-4 4"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
