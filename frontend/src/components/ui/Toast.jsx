import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, X } from 'lucide-react'

export default function Toast({ message, type = 'success', onDismiss }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
    const t = setTimeout(() => { setVisible(false); setTimeout(onDismiss, 300) }, 4000)
    return () => clearTimeout(t)
  }, [onDismiss])
  return (
    <div className={`fixed bottom-5 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg
                     bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700
                     max-w-sm transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {type === 'success' ? <CheckCircle size={18} className="text-green-500 flex-shrink-0" /> : <XCircle size={18} className="text-red-500 flex-shrink-0" />}
      <span className="text-sm flex-1">{message}</span>
      <button onClick={onDismiss} className="text-slate-400 hover:text-slate-600"><X size={14} /></button>
    </div>
  )
}
