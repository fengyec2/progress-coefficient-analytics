
import React from 'react';
import { BarChart, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { GroupData } from '../types';

interface DashboardProps {
  winnerId: string | null;
  groups: GroupData[];
  chartData: any[];
}

const Dashboard: React.FC<DashboardProps> = ({ winnerId, groups, chartData }) => {
  const winner = groups.find(g => g.id === winnerId);

  return (
    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 text-white shadow-xl shadow-slate-200 min-h-[260px]">
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center h-full">
        <div className="flex-1">
          <h2 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-1">实时优胜组排行榜</h2>
          {winnerId ? (
            <div>
              <div className="text-3xl font-black text-emerald-400 flex items-center gap-3">
                {winner?.name}
                <span className="text-sm font-normal text-slate-400">目前领先</span>
              </div>
              <p className="text-slate-300 mt-2 text-sm">
                该组凭借最高平均系数 
                <span className="font-mono font-bold text-emerald-400 mx-1">
                  {winner?.averageCoefficient.toFixed(4)}
                </span> 
                暂居榜首。
              </p>
            </div>
          ) : (
            <div className="text-slate-500 italic">等待数据输入...</div>
          )}
        </div>
        <div className="w-full md:w-[400px] h-64 md:h-full min-h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 10, left: 10, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tick={{fill: '#94a3b8'}} axisLine={false} tickLine={false} interval={0} angle={-45} textAnchor="end" />
              <Tooltip cursor={{fill: '#1e293b'}} contentStyle={{backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff'}} />
              <Bar dataKey="avg" radius={[4, 4, 0, 0]} barSize={40}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.avg >= 0 ? '#10b981' : '#ef4444'} />
                ))}
                <LabelList dataKey="avg" position="top" fill="#fff" fontSize={10} fontWeight="bold" formatter={(val: number) => val.toFixed(3)} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
