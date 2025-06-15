import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from 'recharts';
import { Typography } from '@mui/material';

interface ScoreProgressChartProps {
  data: Array<{ name: string; score: number; date: string }>;
  height?: number;
}

export const ScoreProgressChart: React.FC<ScoreProgressChartProps> = ({ data, height = 320 }) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{`Test ${label}`}</p>
          <p className="text-purple-600 font-bold">{`${payload[0].value} points`}</p>
          <p className="text-sm text-gray-500">
            {new Date(payload[0].payload.date).toLocaleDateString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="name" 
            stroke="#6b7280"
            fontSize={12}
          />
          <YAxis 
            domain={[200, 800]} 
            stroke="#6b7280"
            fontSize={12}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#8B5CF6"
            strokeWidth={3}
            dot={{ r: 6, fill: '#8B5CF6', stroke: '#ffffff', strokeWidth: 2 }}
            activeDot={{ r: 8, stroke: '#8B5CF6', strokeWidth: 2, fill: '#ffffff' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

interface SectionPerformanceChartProps {
  data: Array<{ name: string; value: number; color: string }>;
  height?: number;
}

export const SectionPerformanceChart: React.FC<SectionPerformanceChartProps> = ({ data, height = 320 }) => {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{payload[0].name}</p>
          <p className="text-purple-600 font-bold">{`${payload[0].value}%`}</p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex justify-center gap-6 mt-4">
        {payload.map((entry: any, index: number) => (
          <div key={`legend-${index}`} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-600">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={120}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

interface AccuracyChartProps {
  data: Array<{ name: string; value: number; color: string }>;
  height?: number;
}

export const AccuracyChart: React.FC<AccuracyChartProps> = ({ data, height = 320 }) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{label}</p>
          <p className="text-purple-600 font-bold">{`${payload[0].value} questions`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
          <YAxis stroke="#6b7280" fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="value" 
            fill="#8B5CF6"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

interface EmptyChartStateProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  subtitle: string;
  height?: number;
}

export const EmptyChartState: React.FC<EmptyChartStateProps> = ({ 
  icon: Icon, 
  title, 
  subtitle, 
  height = 320 
}) => {
  return (
    <div 
      className="flex items-center justify-center text-gray-500"
      style={{ height }}
    >
      <div className="text-center">
        <Icon className="mx-auto mb-4" size={48} />
        <Typography variant="body1" className="font-medium mb-2">
          {title}
        </Typography>
        <Typography variant="body2" className="text-gray-400">
          {subtitle}
        </Typography>
      </div>
    </div>
  );
}; 