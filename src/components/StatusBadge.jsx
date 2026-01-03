import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { CLOTHING_STATUSES } from '../constants/clothingStatuses'

export function StatusBadge({ currentStatus, onChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const statusConfig = CLOTHING_STATUSES[currentStatus] || CLOTHING_STATUSES.vorhanden

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleStatusChange = (statusKey) => {
    onChange(statusKey)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`${statusConfig.bgColor} ${statusConfig.textColor} px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${statusConfig.hoverBg} transition-colors`}
      >
        {statusConfig.label}
        <ChevronDown size={14} />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
          {Object.entries(CLOTHING_STATUSES).map(([statusKey, config]) => (
            <button
              key={statusKey}
              type="button"
              onClick={() => handleStatusChange(statusKey)}
              className={`w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                currentStatus === statusKey ? 'bg-gray-100' : ''
              }`}
            >
              <span className={`w-3 h-3 rounded-full ${config.bgColor}`} />
              <span className="text-sm font-medium text-gray-700">{config.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
