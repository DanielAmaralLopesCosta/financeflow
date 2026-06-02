import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { formatCurrency, formatDate, getCatInfo } from '../utils/format'

export default function ExpenseCard({ expense, onEdit, onDelete }) {
  const cat = getCatInfo(expense.category)
  const isIncome = expense.type === 'income'
  const [confirmDelete, setConfirmDelete] = useState(false)

  return (
    <div className="flex items-center gap-3 py-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
           style={{ background: cat.color + '20' }}>
        {cat.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{expense.title}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500">
          {cat.label} · {formatDate(expense.date)}
        </p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className={`font-semibold text-sm ${isIncome ? 'text-green-500' : 'text-red-500'}`}>
          {isIncome ? '+' : '-'}{formatCurrency(expense.amount)}
        </span>
        {!confirmDelete ? (
          <div className="flex gap-1">
            <button
              onClick={() => onEdit(expense)}
              className="p-1 rounded text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors"
              aria-label="Editar transação"
            >
              <Pencil size={13} />
            </button>
            <button
              onClick={() => setConfirmDelete(true)}
              className="p-1 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
              aria-label="Remover transação"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <button
              onClick={() => { onDelete(expense._id); setConfirmDelete(false) }}
              className="text-xs px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              Sim
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="text-xs px-2 py-1 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg transition-colors"
            >
              Não
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
