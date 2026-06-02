import { useState, useEffect, useCallback } from 'react'
import { TrendingUp, TrendingDown, Wallet, Plus, Download } from 'lucide-react'
import api from '../api/axios'
import Navbar from '../components/Navbar'
import { AreaChartComp, CategoryPie } from '../components/SummaryChart'
import ExpenseCard from '../components/ExpenseCard'
import ExpenseForm from '../components/ExpenseForm'
import Modal from '../components/ui/Modal'
import Toast from '../components/ui/Toast'
import Spinner from '../components/ui/Spinner'
import { useExpenses } from '../hooks/useExpenses'
import { formatCurrency } from '../utils/format'

const MONTHS = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']

export default function Dashboard() {
  const now = new Date()
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year]            = useState(now.getFullYear())
  const [summary, setSummary]     = useState(null)
  const [summaryLoading, setSL]   = useState(true)
  const [modal,   setModal]       = useState(null)   // null | 'add' | expense-obj
  const [toast,   setToast]       = useState(null)
  const [filters, setFilters]     = useState({ category: '', type: '', page: 1 })

  const { expenses, pagination, loading: expLoading, error: expError, fetch, create, update, remove } = useExpenses()

  // Carrega summary
  const loadSummary = useCallback(async () => {
    setSL(true)
    try {
      const res = await api.get('/summary', { params: { month, year } })
      setSummary(res.data)
    } catch {/* silencioso */}
    finally { setSL(false) }
  }, [month, year])

  // Carrega despesas com filtros
  useEffect(() => { fetch({ ...filters, month, year }) }, [filters, month, year, fetch])
  useEffect(() => { loadSummary() }, [loadSummary])

  const handleSubmit = async (data) => {
    try {
      if (modal?._id) {
        await update(modal._id, data)
        setToast({ msg: 'Despesa atualizada!', type: 'success' })
      } else {
        await create(data)
        setToast({ msg: 'Despesa adicionada!', type: 'success' })
      }
      setModal(null)
      fetch({ ...filters, month, year })
      loadSummary()
    } catch (err) {
      setToast({ msg: err.response?.data?.error || 'Erro ao salvar.', type: 'error' })
    }
  }

  const handleDelete = async (id) => {
    try {
      await remove(id)
      setToast({ msg: 'Despesa removida.', type: 'success' })
      fetch({ ...filters, month, year })
      loadSummary()
    } catch {
      setToast({ msg: 'Erro ao remover.', type: 'error' })
    }
  }

  const exportCSV = () => {
    const rows = [['Título','Valor','Tipo','Categoria','Data','Descrição']]
    expenses.forEach(e => rows.push([e.title, e.amount, e.type, e.category,
      new Date(e.date).toLocaleDateString('pt-BR'), e.description ?? '']))
    const csv  = rows.map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a'); a.href = url
    a.download = `financeflow-${year}-${String(month).padStart(2,'0')}.csv`; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Visão geral das suas finanças</p>
          </div>
          <div className="flex items-center gap-2">
            <select className="input w-auto py-1.5 text-sm" value={month} onChange={e => setMonth(Number(e.target.value))}>
              {MONTHS.map((m, i) => <option key={i} value={i+1}>{m} {year}</option>)}
            </select>
            <button onClick={() => setModal('add')} className="btn-primary flex items-center gap-1.5">
              <Plus size={16} /> Nova
            </button>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="card flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-950 flex items-center justify-center">
              <TrendingUp size={20} className="text-green-500" />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Receitas</p>
              <p className="text-xl font-bold text-green-500">{summaryLoading ? '...' : formatCurrency(summary?.income ?? 0)}</p>
            </div>
          </div>
          <div className="card flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950 flex items-center justify-center">
              <TrendingDown size={20} className="text-red-500" />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Despesas</p>
              <p className="text-xl font-bold text-red-500">{summaryLoading ? '...' : formatCurrency(summary?.expense ?? 0)}</p>
            </div>
          </div>
          <div className="card flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
              <Wallet size={20} className="text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Saldo</p>
              <p className={`text-xl font-bold ${(summary?.balance ?? 0) >= 0 ? 'text-blue-500' : 'text-red-500'}`}>
                {summaryLoading ? '...' : formatCurrency(summary?.balance ?? 0)}
              </p>
            </div>
          </div>
        </div>

        {/* Charts */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="card">
              <h2 className="font-semibold text-sm mb-4">Despesas — últimos 30 dias</h2>
              {summary.byDay.length > 0
                ? <AreaChartComp data={summary.byDay} />
                : <p className="text-sm text-slate-400 text-center py-10">Sem dados no período</p>}
            </div>
            <div className="card">
              <h2 className="font-semibold text-sm mb-4">Por categoria</h2>
              {summary.byCategory.length > 0
                ? <CategoryPie data={summary.byCategory} />
                : <p className="text-sm text-slate-400 text-center py-10">Sem dados no período</p>}
            </div>
          </div>
        )}

        {/* Lista de transações */}
        <div className="card">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h2 className="font-semibold text-sm">Transações</h2>
            <div className="flex items-center gap-2 flex-wrap">
              <select className="input w-auto py-1 text-xs" value={filters.type}
                onChange={e => setFilters(f => ({ ...f, type: e.target.value, page: 1 }))}>
                <option value="">Todos os tipos</option>
                <option value="expense">Despesas</option>
                <option value="income">Receitas</option>
              </select>
              <button onClick={exportCSV} className="btn-outline flex items-center gap-1 py-1 text-xs">
                <Download size={13} /> CSV
              </button>
            </div>
          </div>

          {expLoading
            ? <div className="flex justify-center py-10"><Spinner /></div>
            : expError
              ? <p className="text-sm text-red-500 text-center py-10">{expError}</p>
            : expenses.length === 0
              ? <div className="text-center py-10">
                  <p className="text-slate-400 mb-3">Nenhuma transação ainda.</p>
                  <button onClick={() => setModal('add')} className="btn-primary text-sm">+ Adicionar primeira</button>
                </div>
              : <>
                  {expenses.map(e => (
                    <ExpenseCard key={e._id} expense={e} onEdit={setModal} onDelete={handleDelete} />
                  ))}
                  {/* Paginação */}
                  {pagination.pages > 1 && (
                    <div className="flex justify-center gap-2 mt-4">
                      {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
                        <button key={p} onClick={() => setFilters(f => ({ ...f, page: p }))}
                          className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                            pagination.page === p ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                          }`}>{p}</button>
                      ))}
                    </div>
                  )}
                </>
          }
        </div>
      </main>

      {modal && (
        <Modal title={modal === 'add' ? 'Nova transação' : 'Editar transação'} onClose={() => setModal(null)}>
          <ExpenseForm
            initial={modal !== 'add' ? { ...modal, date: modal.date?.split('T')[0], amount: String(modal.amount) } : null}
            onSubmit={handleSubmit}
            onCancel={() => setModal(null)}
          />
        </Modal>
      )}

      {toast && <Toast message={toast.msg} type={toast.type} onDismiss={() => setToast(null)} />}
    </div>
  )
}
