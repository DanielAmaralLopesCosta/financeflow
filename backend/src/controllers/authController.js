import User      from '../models/User.js'
import { signToken } from '../utils/jwt.js'

// POST /api/auth/register
export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body
    const existing = await User.findOne({ email })
    if (existing) return res.status(409).json({ error: 'E-mail já cadastrado.' })

    const user  = await User.create({ name, email, password })
    const token = signToken(user._id)

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    })
  } catch (err) { next(err) }
}

// POST /api/auth/login
export async function login(req, res, next) {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email }).select('+password')
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ error: 'E-mail ou senha incorretos.' })

    const token = signToken(user._id)
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } })
  } catch (err) { next(err) }
}

// GET /api/auth/me
export async function getMe(req, res) {
  const u = req.user
  res.json({ user: { id: u._id, name: u.name, email: u.email } })
}
