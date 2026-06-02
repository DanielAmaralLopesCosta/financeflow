import jwt  from 'jsonwebtoken'
import User from '../models/User.js'

export async function protect(req, res, next) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer '))
    return res.status(401).json({ error: 'Não autenticado. Faça login.' })

  try {
    const token   = header.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user      = await User.findById(decoded.id)
    if (!req.user) return res.status(401).json({ error: 'Usuário não encontrado.' })
    next()
  } catch {
    res.status(401).json({ error: 'Token inválido ou expirado.' })
  }
}
