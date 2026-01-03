import { ChevronDown } from 'lucide-react'
import { CLOTHING_STATUSES } from '../constants/clothingStatuses'

export function StatusBadge({ currentStatus, onChange }) {
  const statusConfig = CLOTHING_STATUSES[currentStatus] || CLOTHING_STATUSES.vorhanden

  const getBadgeColor = (status) => {
    switch (status) {
      case 'vorhanden':
        return 'badge-success'
      case 'zu_klein':
        return 'badge-warning'
      case 'aussortiert':
        return 'badge-error'
      default:
        return 'badge-ghost'
    }
  }

  return (
    <div className="dropdown">
      <button
        type="button"
        tabIndex={0}
        className={`badge gap-1 ${getBadgeColor(currentStatus)} cursor-pointer`}
      >
        {statusConfig.label}
        <ChevronDown size={12} />
      </button>

      <ul tabIndex={0} className="dropdown-content z-10 menu p-2 shadow-lg bg-base-100 rounded-box w-40 mt-1">
        {Object.entries(CLOTHING_STATUSES).map(([statusKey, config]) => (
          <li key={statusKey}>
            <button
              type="button"
              onClick={() => onChange(statusKey)}
              className={currentStatus === statusKey ? 'active' : ''}
            >
              <span className={`w-2 h-2 rounded-full ${getBadgeColor(statusKey)}`} />
              {config.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
