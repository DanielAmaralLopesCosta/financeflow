import { useState } from 'react'
import { CATEGORIES } from '../utils/format'

const EMPTY = { title: '', amount: '', category: 'alimentação', date: new Date().toISOString().split('T')[0], type: 'expense', description: '' }

export default function ExpenseForm({ initial, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState(initial ?? EMPTY)
  const [error, setError] = useState('')

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) return setError('Título é obrigatório.')
    if (!form.amount || Number(form.amount) <= 0) return setError('Valor inválido.')
    setError('')
    await onSubmit({ ...form, amount: Number(form.amount) })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Tipo */}
      <div className="flex gap-2">
        {['expense', 'income'].map(t => (
          <button key={t} type="button" onClick={() => set('type', t)}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${
              form.type === t
                ? t === 'expense' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}>
            {t === 'expense' ? '↓ Despesa' : '↑ Receita'}
          </button>
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Título</label>
        <input className="input" value={form.title} onChange={e => set('title', e.target.value)}
          placeholder="Ex: Almoço no restaurante" maxLength={100} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Valor (R$)</label>
          <input className="input" type="number" min="0.01" step="0.01" value={form.amount}
            onChange={e => set('amount', e.target.value)} placeholder="0,00" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Data</label>
          <input className="input" type="date" value={form.date} onChange={e => set('date', e.target.value)} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Categoria</label>
        <select className="input" value={form.category} onChange={e => set('category', e.target.value)}>
          {CATEGORIES.map(c => (
            <option key={c.value} value={c.value}>{c.emoji} {c.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Descrição <span className="text-slate-400">(opcional)</span></label>
        <textarea className="input resize-none" rows={2} value={form.description}
          onChange={e => set('description', e.target.value)} placeholder="Detalhes adicionais..." maxLength={300} />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex gap-3 pt-1">
        <button type="submit" disabled={loading} className="btn-primary flex-1">
          {loading ? 'Salvando...' : (initial ? 'Salvar alterações' : 'Adicionar')}
        </button>
        <button type="button" onClick={onCancel} className="btn-outline">Cancelar</button>
      </div>
    </form>
  )
}
