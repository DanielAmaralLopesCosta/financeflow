import { useState, useCallback } from 'react'
import api from '../api/axios'

export function useExpenses() {
  const [expenses,   setExpenses]   = useState([])
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 })
  const [loading,    setLoading]    = useState(false)
  const [error,      setError]      = useState(null)

  const fetch = useCallback(async (params = {}) => {
    setLoading(true); setError(null)
    try {
      const res = await api.get('/expenses', { params })
      setExpenses(res.data.expenses)
      setPagination(res.data.pagination)
    } catch (e) {
      setError(e.response?.data?.error || 'Erro ao carregar despesas.')
    } finally { setLoading(false) }
  }, [])

  const create = useCallback(async (data) => {
    const res = await api.post('/expenses', data)
    return res.data.expense
  }, [])

  const update = useCallback(async (id, data) => {
    const res = await api.put(`/expenses/${id}`, data)
    return res.data.expense
  }, [])

  const remove = useCallback(async (id) => {
    await api.delete(`/expenses/${id}`)
  }, [])

  return { expenses, pagination, loading, error, fetch, create, update, remove }
}
