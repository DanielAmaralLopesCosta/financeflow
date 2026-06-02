import 'dotenv/config'
import express    from 'express'
import cors       from 'cors'
import morgan     from 'morgan'
import mongoose   from 'mongoose'

import authRoutes    from './routes/auth.js'
import expenseRoutes from './routes/expenses.js'
import summaryRoutes from './routes/summary.js'
import { errorHandler } from './middleware/errorHandler.js'

const app  = express()
const PORT = process.env.PORT || 5000

app.use(cors({ origin: process.env.FRONTEND_URL || '*', credentials: true }))
app.use(express.json())
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))

app.get('/', (_req, res) => res.json({ message: 'ExpenseTracker API v1.0 OK' }))
app.use('/api/auth',     authRoutes)
app.use('/api/expenses', expenseRoutes)
app.use('/api/summary',  summaryRoutes)

app.use((_req, res) => res.status(404).json({ error: 'Rota não encontrada' }))
app.use(errorHandler)

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB conectado')
    app.listen(PORT, () => console.log(`Servidor na porta ${PORT}`))
  })
  .catch(err => { console.error('Falha MongoDB:', err.message); process.exit(1) })
