import React from 'react';
import { AreaChart, Area, ResponsiveContainer, Tooltip, YAxis } from 'recharts';

interface MiniChartProps {
  data: { day: string; value: number }[];
  color?: string;
  height?: number;
  showTooltip?: boolean;
}

const MiniChart: React.FC<MiniChartProps> = ({
  data,
  color = '#6366F1',
  height = 48,
  showTooltip = false,
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
        <defs>
          <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color} stopOpacity={0.0} />
          </linearGradient>
        </defs>
        <YAxis domain={['auto', 'auto']} hide />
        {showTooltip && (
          <Tooltip
            contentStyle={{ background: '#1C1C2E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 11, color: '#F4F4FF' }}
            itemStyle={{ color: color }}
            labelStyle={{ color: '#9B9BAE' }}
          />
        )}
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          fill={`url(#grad-${color.replace('#', '')})`}
          dot={false}
          activeDot={showTooltip ? { r: 3, fill: color } : false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default MiniChart;
