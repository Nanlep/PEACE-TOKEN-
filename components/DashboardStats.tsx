
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: '00:00', impact: 4000, treasury: 2400 },
  { name: '04:00', impact: 3000, treasury: 1398 },
  { name: '08:00', impact: 2000, treasury: 9800 },
  { name: '12:00', impact: 2780, treasury: 3908 },
  { name: '16:00', impact: 4890, treasury: 4800 },
  { name: '20:00', impact: 5390, treasury: 3800 },
  { name: '24:00', impact: 6490, treasury: 4300 },
];

interface DashboardStatsProps {
  treasury: number;
  totalRewarded: number;
}

const StatCard = ({ title, value, change, color }: any) => (
  <div className="glass-panel p-5 rounded-xl border border-white/10 relative overflow-hidden group">
    <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
      <div className={`w-12 h-12 rounded-full bg-${color || 'blue'}-500`}></div>
    </div>
    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-1">{title}</p>
    <div className="flex items-baseline justify-between">
      <h3 className="text-2xl font-bold text-white mono tracking-tight">{value}</h3>
      <span className={`text-[10px] font-black ${change.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
        {change}
      </span>
    </div>
  </div>
);

const DashboardStats: React.FC<DashboardStatsProps> = ({ treasury, totalRewarded }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="USDC LIQUIDITY" value={`$${treasury.toLocaleString()}`} change="-0.04%" color="emerald" />
        <StatCard title="REWARDED PT" value={`${totalRewarded.toLocaleString()} PT`} change="+1.2%" color="blue" />
        <StatCard title="NODE CONSENSUS" value="99.99%" change="OPTIMAL" color="emerald" />
        <StatCard title="TOTAL ACTORS" value="12,842" change="+312" color="slate" />
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-white/10 h-[280px]">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Peace Impact Index (24H Live)</h4>
          <div className="flex gap-4">
             <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500"></div><span className="text-[10px] text-slate-500">Impact</span></div>
             <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500"></div><span className="text-[10px] text-slate-500">Payouts</span></div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorImpact" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
            <XAxis dataKey="name" stroke="#475569" fontSize={9} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', fontSize: '10px' }}
              itemStyle={{ color: '#f8fafc' }}
            />
            <Area type="monotone" dataKey="impact" stroke="#3b82f6" fillOpacity={1} fill="url(#colorImpact)" strokeWidth={3} />
            <Area type="monotone" dataKey="treasury" stroke="#10b981" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardStats;
