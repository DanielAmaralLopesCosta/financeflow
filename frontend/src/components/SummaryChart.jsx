import { useState, useEffect } from 'react'
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { formatCurrency, getCatInfo } from '../utils/format'

function useDarkMode() {
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'))
  useEffect(() => {
    const obs = new MutationObserver(() =>
      setIsDark(document.documentElement.classList.contains('dark'))
    )
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])
  return isDark
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs shadow-lg">
      <p className="font-semibold mb-1">{label}</p>
      {payload.map(p => <p key={p.name} style={{ color: p.color }}>{formatCurrency(p.value)}</p>)}
    </div>
  )
}

export function AreaChartComp({ data }) {
  const isDark = useDarkMode()
  const gridColor  = isDark ? '#1e293b' : '#f1f5f9'
  const axisColor  = isDark ? '#475569' : '#94a3b8'

  return (
    <ResponsiveContainer width="100%" height={180}>
      <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={gridColor} strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="_id" tick={{ fontSize: 10, fill: axisColor }} tickLine={false} axisLine={false}
          tickFormatter={d => d.slice(5)} />
        <YAxis tick={{ fontSize: 10, fill: axisColor }} tickLine={false} axisLine={false}
          tickFormatter={v => `R$${(v/1000).toFixed(0)}k`} />
        <Tooltip content={<CustomTooltip />} />
        <Area type="monotone" dataKey="total" name="Despesas" stroke="#ef4444" strokeWidth={2} fill="url(#cg)" dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function CategoryPie({ data }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie data={data} dataKey="total" nameKey="_id" cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3}>
          {data.map(entry => {
            const cat = getCatInfo(entry._id)
            return <Cell key={entry._id} fill={cat.color} />
          })}
        </Pie>
        <Tooltip formatter={(v) => formatCurrency(v)} />
        <Legend formatter={(v) => getCatInfo(v)?.label ?? v} iconType="circle" iconSize={8}
          wrapperStyle={{ fontSize: '11px' }} />
      </PieChart>
    </ResponsiveContainer>
  )
}
