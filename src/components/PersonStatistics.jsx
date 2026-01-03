import { UI_TEXT } from '../constants/uiText'
import { CLOTHING_STATUSES } from '../constants/clothingStatuses'

export function PersonStatistics({ clothing }) {
  const total = clothing.length
  const passt = clothing.filter((item) => item.status === 'vorhanden').length
  const zuGross = clothing.filter((item) => item.status === 'zu_gross').length
  const zuKlein = clothing.filter((item) => item.status === 'zu_klein').length
  const aussortiert = clothing.filter((item) => item.status === 'aussortiert').length

  const stats = [
    { label: 'Gesamt', value: total, color: 'text-primary' },
    { label: CLOTHING_STATUSES.vorhanden.label, value: passt, color: 'text-success' },
    { label: CLOTHING_STATUSES.zu_gross.label, value: zuGross, color: 'text-blue-600', show: zuGross > 0 },
    { label: CLOTHING_STATUSES.zu_klein.label, value: zuKlein, color: 'text-warning', show: zuKlein > 0 },
    { label: CLOTHING_STATUSES.aussortiert.label, value: aussortiert, color: 'text-error', show: aussortiert > 0 }
  ].filter(stat => stat.show !== false)

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-sm font-medium text-gray-600 mb-1">{stat.label}</div>
          <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
          {index === 0 && <div className="text-xs text-gray-500 mt-1">{UI_TEXT.clothing.items}</div>}
        </div>
      ))}
    </div>
  )
}
