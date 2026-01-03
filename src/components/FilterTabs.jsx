import { UI_TEXT } from '../constants/uiText'

export function FilterTabs({ activeFilter, counts, onChange }) {
  const filters = [
    { key: 'all', label: UI_TEXT.clothing.filters.all, count: counts.total },
    { key: 'vorhanden', label: UI_TEXT.clothing.filters.vorhanden, count: counts.vorhanden },
    { key: 'zu_gross', label: UI_TEXT.clothing.filters.zu_gross, count: counts.zu_gross || 0 },
    { key: 'zu_klein', label: UI_TEXT.clothing.filters.zu_klein, count: counts.zu_klein },
    { key: 'aussortiert', label: UI_TEXT.clothing.filters.aussortiert, count: counts.aussortiert }
  ]

  return (
    <div className="bg-white rounded-lg shadow-md p-2 flex flex-wrap gap-2">
      {filters.map((filter) => (
        <button
          key={filter.key}
          onClick={() => onChange(filter.key)}
          className={`px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2 ${
            activeFilter === filter.key
              ? 'bg-primary text-primary-light'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {filter.label}
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            activeFilter === filter.key
              ? 'bg-primary-light text-primary'
              : 'bg-gray-200 text-gray-600'
          }`}>
            {filter.count}
          </span>
        </button>
      ))}
    </div>
  )
}
