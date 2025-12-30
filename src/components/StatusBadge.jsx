import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { CLOTHING_STATUSES } from '../constants/clothingStatuses'

export function StatusBadge({ currentStatus, onChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const statusConfig = CLOTHING_STATUSES[currentStatus] || CLOTHING_STATUSES.vorhanden

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleStatusChange = (newStatus) => {
    onChange(newStatus)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium
          border transition-colors
          ${statusConfig.bgColor} ${statusConfig.textColor} ${statusConfig.borderColor}
          ${statusConfig.hoverBg}
        `}
      >
        {statusConfig.label}
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-40 bg-white rounded-md shadow-lg border border-gray-200">
          <div className="py-1">
            {Object.entries(CLOTHING_STATUSES).map(([statusKey, config]) => (
              <button
                key={statusKey}
                type="button"
                onClick={() => handleStatusChange(statusKey)}
                className={`
                  w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors
                  ${currentStatus === statusKey ? 'bg-gray-50 font-medium' : ''}
                `}
              >
                <span className={`inline-block w-2 h-2 rounded-full mr-2 ${config.bgColor.replace('bg-', 'bg-')}`} />
                {config.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
