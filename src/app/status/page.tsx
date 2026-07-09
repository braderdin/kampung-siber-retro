"use client";

import { useState, useEffect } from 'react';

interface ServerStatus {
  name: string;
  status: 'online' | 'offline' | 'maintenance';
  responseTime: number;
  uptime: number;
  lastCheck: Date;
}

interface SystemMetric {
  label: string;
  value: number;
  unit: string;
  status: 'ok' | 'warning' | 'critical';
}

export default function StatusPage() {
  const [serverStatus, setServerStatus] = useState<ServerStatus[]>([]);
  const [metrics, setMetrics] = useState<SystemMetric[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [latencyData, setLatencyData] = useState<number[]>([]);

  useEffect(() => {
    setIsClient(true);
    
    // Simulate server status data
    const initialStatus: ServerStatus[] = [
      {
        name: 'Main API Server',
        status: 'online',
        responseTime: 42,
        uptime: 99.98,
        lastCheck: new Date(),
      },
      {
        name: 'Database Cluster',
        status: 'online',
        responseTime: 18,
        uptime: 99.99,
        lastCheck: new Date(),
      },
      {
        name: 'File Storage (R2)',
        status: 'online',
        responseTime: 35,
        uptime: 99.95,
        lastCheck: new Date(),
      },
      {
        name: 'Auth Service',
        status: 'online',
        responseTime: 28,
        uptime: 99.97,
        lastCheck: new Date(),
      },
      {
        name: 'WebSocket Gateway',
        status: 'online',
        responseTime: 55,
        uptime: 99.92,
        lastCheck: new Date(),
      },
    ];

    const initialMetrics: SystemMetric[] = [
      { label: 'CPU Usage', value: 23, unit: '%', status: 'ok' },
      { label: 'Memory', value: 67, unit: '%', status: 'ok' },
      { label: 'Disk I/O', value: 12, unit: '%', status: 'ok' },
      { label: 'Network Traffic', value: 45, unit: '%', status: 'ok' },
      { label: 'Active Connections', value: 1284, unit: '', status: 'ok' },
    ];

    setServerStatus(initialStatus);
    setMetrics(initialMetrics);
    setLatencyData([42, 38, 55, 28, 35, 41, 29, 33, 47, 42]);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setServerStatus(prev => prev.map(server => {
        const newResponseTime = Math.floor(Math.random() * 50) + 15;
        return {
          ...server,
          responseTime: newResponseTime,
          lastCheck: new Date(),
        };
      }));

      setLatencyData(prev => {
        const newData = [...prev.slice(1), Math.floor(Math.random() * 50) + 15];
        return newData;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'text-green-500';
      case 'offline':
        return 'text-red-500';
      case 'maintenance':
        return 'text-amber-500';
      default:
        return 'text-gray-500';
    }
  };

  const getMetricColor = (status: string) => {
    switch (status) {
      case 'ok':
        return 'text-green-500';
      case 'warning':
        return 'text-amber-500';
      case 'critical':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return '🟢';
      case 'offline':
        return '🔴';
      case 'maintenance':
        return '🟡';
      default:
        return '⚪';
    }
  };

  const formatUptime = (uptime: number) => {
    const days = Math.floor(uptime * 365);
    const hours = Math.floor((uptime * 365 % 365) * 24);
    return `${days}d ${hours}h`;
  };

  const maxLatency = Math.max(...latencyData, 100);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-16">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Start: Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 pixel-font mb-4 inline-block">
            📊 System Status Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Real-time server health monitoring • Classic 90s Admin Console
          </p>
        </div>
        {/* End: Page Header */}

        {/* Start: Overall Status Banner */}
        <div className="retro-terminal bg-black border-2 border-cyan-500 rounded-none p-4 mb-8 overflow-x-auto">
          <div className="flex items-center gap-4 font-mono text-sm">
            <span className="text-cyan-400">[{new Date().toISOString().split('.')[0]}Z]</span>
            <span className="text-green-400">STATUS:</span>
            <span className="text-2xl">🟢 ALL SYSTEMS OPERATIONAL</span>
            <span className="text-cyan-400">|</span>
            <span className="text-yellow-400">UPTIME: 99.97%</span>
            <span className="text-cyan-400">|</span>
            <span className="text-yellow-400">LATENCY: {latencyData[latencyData.length - 1]}ms</span>
          </div>
        </div>
        {/* End: Overall Status Banner */}

        {/* Start: System Pulse Monitor */}
        <section className="retro-section mb-8">
          <h2 className="text-2xl font-bold text-cyan-600 dark:text-cyan-400 mb-6 pixel-font border-b-2 border-cyan-500 pb-2">
            📈 System Pulse Monitor
          </h2>
          <div className="retro-card border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 rounded-none p-4">
            <div className="h-32 bg-black/10 dark:bg-black/30 rounded-none border border-gray-200 dark:border-gray-700 p-2">
              <div className="flex items-end gap-2 h-full items-center justify-center">
                {latencyData.map((latency, index) => (
                  <div key={index} className="flex flex-col items-center gap-1">
                    <div
                      className={`w-6 rounded-none ${
                        latency > 40 ? 'bg-red-500' : latency > 30 ? 'bg-amber-500' : 'bg-green-500'
                      } transition-all duration-500`}
                      style={{ height: `${(latency / maxLatency) * 100}%` }}
                    ></div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                      {latency}ms
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 flex justify-between text-xs text-gray-500 dark:text-gray-400 font-mono">
              <span>Last 10 measurements (5s intervals)</span>
              <span>Status: {latencyData[latencyData.length - 1] > 40 ? '⚠️ Warning' : '✅ OK'}</span>
            </div>
          </div>
        </section>
        {/* End: System Pulse Monitor */}

        {/* Start: Server Status Grid */}
        <section className="retro-section mb-8">
          <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-6 pixel-font border-b-2 border-purple-500 pb-2">
            🖥️ Server Status
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {serverStatus.map((server) => (
              <div
                key={server.name}
                className="retro-card border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 rounded-none p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 pixel-font text-sm">
                    {server.name}
                  </h3>
                  <span className={`text-xl ${getStatusColor(server.status)}`}>
                    {getStatusIcon(server.status)}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Status:</span>
                    <span className={`text-xs font-bold ${getStatusColor(server.status)}`}>
                      {server.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Response:</span>
                    <span className="text-xs font-mono text-gray-900 dark:text-gray-100">
                      {server.responseTime}ms
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Uptime:</span>
                    <span className="text-xs font-mono text-gray-900 dark:text-gray-100">
                      {server.uptime.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Last Check:</span>
                    <span className="text-xs font-mono text-gray-900 dark:text-gray-100">
                      {server.lastCheck.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        {/* End: Server Status Grid */}

        {/* Start: System Metrics */}
        <section className="retro-section mb-8">
          <h2 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-6 pixel-font border-b-2 border-green-500 pb-2">
            📊 System Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="retro-card border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 rounded-none p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 pixel-font text-sm">
                    {metric.label}
                  </h3>
                  <span className={`text-xl ${getMetricColor(metric.status)}`}>
                    {metric.status === 'ok' ? '✅' : metric.status === 'warning' ? '⚠️' : '🔴'}
                  </span>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 pixel-font">
                    {metric.value}
                    <span className="text-sm font-normal">{metric.unit}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        {/* End: System Metrics */}

        {/* Start: Footer Stats */}
        <div className="mt-8 pt-4 border-t-2 border-dashed border-gray-300 dark:border-gray-600 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 pixel-font">
            Data refreshes every 5 seconds • Storage: R2 CDN • Monitoring: RetroOS
          </p>
        </div>
        {/* End: Footer Stats */}
      </div>
    </main>
  );
}