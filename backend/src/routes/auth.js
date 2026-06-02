import { Router } from 'express'
import { body }   from 'express-validator'
import { register, login, getMe } from '../controllers/authController.js'
import { protect }  from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'

const router = Router()

router.post('/register',
  body('name').trim().notEmpty().withMessage('Nome é obrigatório'),
  body('email').isEmail().withMessage('E-mail inválido').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Senha deve ter ao menos 6 caracteres'),
  validate,
  register
)

router.post('/login',
  body('email').isEmail().withMessage('E-mail inválido').normalizeEmail(),
  body('password').notEmpty().withMessage('Senha é obrigatória'),
  validate,
  login
)

router.get('/me', protect, getMe)

export default router
