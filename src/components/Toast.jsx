import { useEffect } from 'react'
import { Check, X } from 'lucide-react'

export function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 3000)

    return () => clearTimeout(timer)
  }, [onClose])

  const alertClass = type === 'success' ? 'alert-success' : 'alert-error'
  const Icon = type === 'success' ? Check : X

  return (
    <div className="toast toast-top toast-end z-50">
      <div className={`alert ${alertClass} shadow-lg animate-slide-in`}>
        <Icon className="w-5 h-5" />
        <span>{message}</span>
        <button
          onClick={onClose}
          className="btn btn-sm btn-circle btn-ghost"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
