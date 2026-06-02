import mongoose from 'mongoose'

const CATEGORIES = [
  'alimentação','transporte','moradia','saúde',
  'educação','lazer','vestuário','tecnologia','outros'
]

const expenseSchema = new mongoose.Schema({
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title:       { type: String, required: true, trim: true, maxlength: 100 },
  amount:      { type: Number, required: true, min: 0.01 },
  category:    { type: String, required: true, enum: CATEGORIES, default: 'outros' },
  date:        { type: Date, required: true, default: Date.now },
  description: { type: String, trim: true, maxlength: 300 },
  type:        { type: String, enum: ['expense', 'income'], default: 'expense' },
}, { timestamps: true })

// Index composto para queries de listagem por usuário + data
expenseSchema.index({ user: 1, date: -1 })

export default mongoose.model('Expense', expenseSchema)
