
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TOKENOMICS } from '../constants';

const data = [
  { name: '00:00', impact: 4000, treasury: 2400 },
  { name: '04:00', impact: 3000, treasury: 1398 },
  { name: '08:00', impact: 2000, treasury: 9800 },
  { name: '12:00', impact: 2780, treasury: 3908 },
  { name: '16:00', impact: 4890, treasury: 4800 },
  { name: '20:00', impact: 5390, treasury: 3800 },
  { name: '24:00', impact: 6490, treasury: 4300 },
];

const allocationData = [
  { name: 'Rewards (Peace Acts)', value: TOKENOMICS.ALLOCATION.REWARDS, color: '#3b82f6' },
  { name: 'DAO Treasury', value: TOKENOMICS.ALLOCATION.DAO, color: '#10b981' },
  { name: 'Systems & Architects', value: TOKENOMICS.ALLOCATION.SYSTEM, color: '#f59e0b' },
];

interface DashboardStatsProps {
  treasury: number;
  totalRewarded: number;
  ptPrice: number;
}

const StatCard = ({ title, value, change, color, prefix = "" }: any) => (
  <div className="glass-panel p-5 rounded-xl border border-white/10 relative overflow-hidden group">
    <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
      <div className={`w-12 h-12 rounded-full bg-${color || 'blue'}-500`}></div>
    </div>
    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-1">{title}</p>
    <div className="flex items-baseline justify-between">
      <h3 className="text-xl font-bold text-white mono tracking-tight">{prefix}{value}</h3>
      <span className={`text-[10px] font-black ${change.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
        {change}
      </span>
    </div>
  </div>
);

const DashboardStats: React.FC<DashboardStatsProps> = ({ treasury, totalRewarded, ptPrice }) => {
  const marketCap = TOKENOMICS.TOTAL_SUPPLY * ptPrice;
  const rewardPoolTokens = TOKENOMICS.TOTAL_SUPPLY * TOKENOMICS.ALLOCATION.REWARDS;
  const rewardPercentageUsed = (totalRewarded / rewardPoolTokens) * 100;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="MARKET CAP (LIVE)" value={`${marketCap.toLocaleString()}`} change="+0.02%" color="blue" prefix="$" />
        <StatCard title="PEACE PRICE (ENTRY: $0.19)" value={`${ptPrice.toFixed(4)}`} change={`${ptPrice > 0.19 ? '+' : ''}${((ptPrice - 0.19)/0.19*100).toFixed(2)}%`} color="emerald" prefix="$" />
        <StatCard title="REWARDS DISTRIBUTED" value={`${totalRewarded.toLocaleString()}`} change={`${rewardPercentageUsed.toFixed(2)}% OF POOL`} color="purple" />
        <StatCard title="DAO TREASURY RESERVE" value={`${treasury.toLocaleString()}`} change="SOLVENT" color="amber" prefix="$" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-white/10 h-[320px]">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol Valuation Index (24H window)</h4>
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500"></div><span className="text-[10px] text-slate-500">PEACE Market Velocity</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500"></div><span className="text-[10px] text-slate-500">Liquidity Depth</span></div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height="80%">
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

        <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col items-center">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 w-full text-left">Supply Allocation (1B Cap)</h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={allocationData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {allocationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => `${(value * 100).toFixed(0)}%`}
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', fontSize: '10px' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="w-full space-y-2 mt-4">
             {allocationData.map((item, i) => (
               <div key={i} className="flex justify-between items-center text-[9px] uppercase font-bold">
                 <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                   <span className="text-slate-400">{item.name}</span>
                 </div>
                 <span className="text-white">{(item.value * 100).toFixed(0)}%</span>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
