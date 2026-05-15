import React from 'react';
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip, Cell } from 'recharts';

interface BarChartComponentProps {
  data: { day: string; value: number }[];
  color?: string;
  height?: number;
  highlightLast?: boolean;
}

const BarChartComponent: React.FC<BarChartComponentProps> = ({
  data,
  color = '#6366F1',
  height = 64,
  highlightLast = true,
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 2, right: 2, left: 2, bottom: 2 }} barCategoryGap="30%">
        <XAxis dataKey="day" tick={{ fill: '#5A5A72', fontSize: 9 }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ background: '#1C1C2E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 11, color: '#F4F4FF' }}
          cursor={{ fill: 'rgba(255,255,255,0.03)' }}
        />
        <Bar dataKey="value" radius={[3, 3, 0, 0]}>
          {data.map((_, i) => (
            <Cell
              key={i}
              fill={highlightLast && i === data.length - 1 ? color : `${color}55`}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartComponent;
