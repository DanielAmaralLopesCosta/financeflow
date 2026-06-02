export const formatCurrency = (value) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)

export const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })

export const CATEGORIES = [
  { value: 'alimentação',  label: 'Alimentação',  emoji: '🍔', color: '#f59e0b' },
  { value: 'transporte',   label: 'Transporte',   emoji: '🚗', color: '#3b82f6' },
  { value: 'moradia',      label: 'Moradia',      emoji: '🏠', color: '#8b5cf6' },
  { value: 'saúde',        label: 'Saúde',        emoji: '💊', color: '#10b981' },
  { value: 'educação',     label: 'Educação',     emoji: '📚', color: '#06b6d4' },
  { value: 'lazer',        label: 'Lazer',        emoji: '🎮', color: '#ec4899' },
  { value: 'vestuário',    label: 'Vestuário',    emoji: '👕', color: '#f97316' },
  { value: 'tecnologia',   label: 'Tecnologia',   emoji: '💻', color: '#6366f1' },
  { value: 'outros',       label: 'Outros',       emoji: '📦', color: '#94a3b8' },
]

export const getCatInfo = (value) =>
  CATEGORIES.find(c => c.value === value) ?? CATEGORIES.at(-1)
