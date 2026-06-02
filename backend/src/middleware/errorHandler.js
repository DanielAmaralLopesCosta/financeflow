export function errorHandler(err, _req, res, _next) {
  console.error(err)

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message)
    return res.status(400).json({ error: messages.join('; ') })
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0]
    return res.status(409).json({ error: `${field} já está em uso.` })
  }

  res.status(err.statusCode || 500).json({ error: err.message || 'Erro interno do servidor.' })
}
