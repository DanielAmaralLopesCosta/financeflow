import { Router } from 'express'
import { body }   from 'express-validator'
import { getExpenses, createExpense, updateExpense, deleteExpense } from '../controllers/expenseController.js'
import { protect }  from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'

const router = Router()

const expenseValidation = [
  body('title').trim().notEmpty().withMessage('Título é obrigatório'),
  body('amount').isFloat({ min: 0.01 }).withMessage('Valor deve ser maior que zero'),
  body('category').notEmpty().withMessage('Categoria é obrigatória'),
  body('date').isISO8601().withMessage('Data inválida'),
]

router.use(protect)

router.get('/',         getExpenses)
router.post('/',        expenseValidation, validate, createExpense)
router.put('/:id',      expenseValidation, validate, updateExpense)
router.delete('/:id',   deleteExpense)

export default router
