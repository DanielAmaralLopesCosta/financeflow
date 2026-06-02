import { LogOut, Sun, Moon, BarChart2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const [dark, setDark]  = useState(() => localStorage.getItem('ff_theme') !== 'light')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('ff_theme', dark ? 'dark' : 'light')
  }, [dark])

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart2 size={20} className="text-blue-500" />
          <span className="font-bold text-lg">Finance<span className="text-blue-500">Flow</span></span>
        </div>
        <div className="flex items-center gap-3">
          {user && (
            <span className="text-sm text-slate-500 dark:text-slate-400 hidden sm:block">
              Olá, <strong className="text-slate-700 dark:text-slate-200">{user.name.split(' ')[0]}</strong>
            </span>
          )}
          <button onClick={() => setDark(d => !d)} className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-400 hover:text-blue-500 transition-colors" aria-label="Alternar tema">
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          {user && (
            <button onClick={logout} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-500 transition-colors" aria-label="Sair">
              <LogOut size={16} /><span className="hidden sm:inline">Sair</span>
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
