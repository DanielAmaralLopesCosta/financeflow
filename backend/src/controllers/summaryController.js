import Expense from '../models/Expense.js'

// GET /api/summary
export async function getSummary(req, res, next) {
  try {
    const { month, year } = req.query
    const now     = new Date()
    const y       = Number(year  || now.getFullYear())
    const m       = Number(month || now.getMonth() + 1)

    const start = new Date(y, m - 1, 1)
    const end   = new Date(y, m, 0, 23, 59, 59)

    const baseMatch = { user: req.user._id, date: { $gte: start, $lte: end } }

    // Totais por tipo
    const totals = await Expense.aggregate([
      { $match: baseMatch },
      { $group: { _id: '$type', total: { $sum: '$amount' } } },
    ])

    // Por categoria (apenas despesas)
    const byCategory = await Expense.aggregate([
      { $match: { ...baseMatch, type: 'expense' } },
      { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { total: -1 } },
    ])

    // Por dia (últimos 30 dias — para gráfico de linha)
    const last30Start = new Date(); last30Start.setDate(last30Start.getDate() - 29)
    const byDay = await Expense.aggregate([
      { $match: { user: req.user._id, type: 'expense', date: { $gte: last30Start } } },
      { $group: {
        _id:   { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
        total: { $sum: '$amount' },
      }},
      { $sort: { _id: 1 } },
    ])

    const income  = totals.find(t => t._id === 'income')?. total || 0
    const expense = totals.find(t => t._id === 'expense')?.total || 0

    res.json({
      month: m, year: y,
      income, expense, balance: income - expense,
      byCategory, byDay,
    })
  } catch (err) { next(err) }
}
