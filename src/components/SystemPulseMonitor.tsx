"use client";

import { useState, useEffect, useRef } from 'react';

interface SystemPulseMonitorProps {
  className?: string;
  width?: number;
  height?: number;
  dataPoints?: number;
}

interface LatencyDataPoint {
  time: Date;
  latency: number;
}

export default function SystemPulseMonitor({
  className = '',
  width = 400,
  height = 150,
  dataPoints = 20,
}: SystemPulseMonitorProps) {
  const [latencyHistory, setLatencyHistory] = useState<LatencyDataPoint[]>([]);
  const [currentLatency, setCurrentLatency] = useState<number>(0);
  const [status, setStatus] = useState<'ok' | 'warning'>('ok');
  const [isClient, setIsClient] = useState(false);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    setIsClient(true);

    // Initialize with random data
    const initialData = Array.from({ length: dataPoints }, (_, i) => ({
      time: new Date(Date.now() - (dataPoints - i) * 1000),
      latency: Math.floor(Math.random() * 50) + 15,
    }));

    setLatencyHistory(initialData);
    setCurrentLatency(initialData[initialData.length - 1].latency);

    // Simulate real-time latency updates
    const interval = setInterval(() => {
      const newLatency = Math.floor(Math.random() * 50) + 15;
      const newDataPoint = {
        time: new Date(),
        latency: newLatency,
      };

      setLatencyHistory((prev) => {
        const updated = [...prev.slice(1), newDataPoint];
        return updated;
      });

      setCurrentLatency(newLatency);
      setStatus(newLatency > 40 ? 'warning' : 'ok');
    }, 1000);

    return () => {
      clearInterval(interval);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dataPoints]);

  const getLineColor = () => {
    return status === 'ok' ? '#22c55e' : '#ef4444';
  };

  const getStatusColor = () => {
    return status === 'ok' ? 'text-green-500' : 'text-red-500';
  };

  const getStatusIcon = () => {
    return status === 'ok' ? '🟢' : '🔴';
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const calculateChartDimensions = () => {
    const padding = { left: 30, right: 10, top: 10, bottom: 30 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    return { padding, chartWidth, chartHeight };
  };

  const { padding, chartWidth, chartHeight } = calculateChartDimensions();

  // Calculate the maximum latency for scaling
  const maxLatency = Math.max(...latencyHistory.map((d) => d.latency), 100);
  const minLatency = Math.min(...latencyHistory.map((d) => d.latency), 10);

  // Generate SVG path for the line chart
  const generatePath = () => {
    if (latencyHistory.length === 0) return '';

    const stepWidth = chartWidth / (latencyHistory.length - 1);
    const stepHeight = chartHeight / (maxLatency - minLatency || 1);

    const points = latencyHistory.map((point, index) => {
      const x = padding.left + index * stepWidth;
      const y = padding.top + chartHeight - (point.latency - minLatency) * stepHeight;
      return `${x},${y}`;
    });

    return `M${points.join(' L')}`;
  };

  // Generate gradient stops for the area under the line
  const generateGradientStops = () => {
    return `
      <linearGradient id="pulse-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="${getLineColor()}" stop-opacity="0.4" />
        <stop offset="100%" stop-color="${getLineColor()}" stop-opacity="0" />
      </linearGradient>
    `;
  };

  return (
    <div className={`system-pulse-monitor ${className}`} style={{ width, height }}>
      <div className="retro-card border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 rounded-none">
        {/* Start: Header */}
        <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xl">{getStatusIcon()}</span>
            <h3 className="font-bold text-gray-900 dark:text-gray-100 pixel-font text-sm">
              Latency Monitor
            </h3>
          </div>
          <div className="text-right">
            <div className={`font-mono text-lg font-bold ${getStatusColor()}`}>
              {currentLatency}ms
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Status: {status === 'ok' ? 'OK' : 'Warning'}
            </div>
          </div>
        </div>
        {/* End: Header */}

        {/* Start: Chart */}
        <div className="p-3">
          <svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto"
          >
            {/* Start: Background Grid */}
            <defs>
              {generateGradientStops()}
            </defs>
            
            {/* Horizontal grid lines */}
            {[0, 25, 50, 75, 100].map((percent) => (
              <line
                key={`grid-${percent}`}
                x1={padding.left}
                y1={padding.top + (chartHeight * percent) / 100}
                x2={padding.left + chartWidth}
                y2={padding.top + (chartHeight * percent) / 100}
                stroke="rgba(156, 163, 175, 0.2)"
                strokeWidth="1"
              />
            ))}

            {/* Vertical grid lines */}
            {Array.from({ length: 5 }, (_, i) => {
              const x = padding.left + (i * chartWidth) / 4;
              return (
                <line
                  key={`v-grid-${i}`}
                  x1={x}
                  y1={padding.top}
                  x2={x}
                  y2={padding.top + chartHeight}
                  stroke="rgba(156, 163, 175, 0.1)"
                  strokeWidth="1"
                />
              );
            })}

            {/* Start: Area Fill */}
            <path
              d={`${generatePath()} L${padding.left + chartWidth},${padding.top + chartHeight} L${padding.left},${padding.top + chartHeight} Z`}
              fill="url(#pulse-gradient)"
            />
            {/* End: Area Fill */}

            {/* Start: Line Path */}
            <path
              d={generatePath()}
              fill="none"
              stroke={getLineColor()}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all duration-300"
            />
            {/* End: Line Path */}

            {/* Data points */}
            {latencyHistory.map((point, index) => {
              const x = padding.left + (index * chartWidth) / (latencyHistory.length - 1);
              const y = padding.top + chartHeight - ((point.latency - minLatency) * chartHeight) / (maxLatency - minLatency || 1);
              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r={status === 'ok' ? 3 : 4}
                  fill={getLineColor()}
                  className="transition-all duration-300"
                />
              );
            })}
          </svg>

          {/* Start: Y-Axis Labels */}
          <div className="absolute left-2 top-1/2 -translate-y-1/2 flex flex-col justify-between h-full text-xs text-gray-500 dark:text-gray-400 font-mono">
            <span>{maxLatency}ms</span>
            <span>{Math.round((maxLatency + minLatency) / 2)}ms</span>
            <span>{minLatency}ms</span>
          </div>
          {/* End: Y-Axis Labels */}
        </div>
        {/* End: Chart */}

        {/* Start: Legend */}
        <div className="px-3 pb-2 text-xs text-gray-500 dark:text-gray-400 font-mono flex justify-between">
          <span>Real-time latency visualization</span>
          <span className={getStatusColor()}>{status === 'ok' ? '✅ Normal' : '⚠️ Warning'}</span>
        </div>
        {/* End: Legend */}
      </div>
    </div>
  );
}