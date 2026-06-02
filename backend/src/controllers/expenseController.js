import Expense from '../models/Expense.js'

const PAGE_SIZE = 10

// GET /api/expenses
export async function getExpenses(req, res, next) {
  try {
    const { category, type, startDate, endDate, page = 1 } = req.query
    const filter = { user: req.user._id }

    if (category)  filter.category = category
    if (type)      filter.type     = type
    if (startDate || endDate) {
      filter.date = {}
      if (startDate) filter.date.$gte = new Date(startDate)
      if (endDate)   filter.date.$lte = new Date(endDate)
    }

    const total    = await Expense.countDocuments(filter)
    const expenses = await Expense.find(filter)
      .sort({ date: -1 })
      .skip((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)

    res.json({
      expenses,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / PAGE_SIZE),
      },
    })
  } catch (err) { next(err) }
}

// POST /api/expenses
export async function createExpense(req, res, next) {
  try {
    const expense = await Expense.create({ ...req.body, user: req.user._id })
    res.status(201).json({ expense })
  } catch (err) { next(err) }
}

// PUT /api/expenses/:id
export async function updateExpense(req, res, next) {
  try {
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    )
    if (!expense) return res.status(404).json({ error: 'Despesa não encontrada.' })
    res.json({ expense })
  } catch (err) { next(err) }
}

// DELETE /api/expenses/:id
export async function deleteExpense(req, res, next) {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user._id })
    if (!expense) return res.status(404).json({ error: 'Despesa não encontrada.' })
    res.json({ message: 'Despesa removida.' })
  } catch (err) { next(err) }
}
