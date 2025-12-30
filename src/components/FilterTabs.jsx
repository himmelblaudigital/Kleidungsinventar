import { UI_TEXT } from '../constants/uiText'

export function FilterTabs({ activeFilter, counts, onChange }) {
  const filters = [
    { key: 'all', label: UI_TEXT.clothing.filters.all, count: counts.total },
    { key: 'vorhanden', label: UI_TEXT.clothing.filters.vorhanden, count: counts.vorhanden },
    { key: 'zu_klein', label: UI_TEXT.clothing.filters.zu_klein, count: counts.zu_klein },
    { key: 'aussortiert', label: UI_TEXT.clothing.filters.aussortiert, count: counts.aussortiert }
  ]

  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {filters.map((filter) => (
        <button
          key={filter.key}
          onClick={() => onChange(filter.key)}
          className={`
            flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors
            ${
              activeFilter === filter.key
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }
          `}
        >
          {filter.label} ({filter.count})
        </button>
      ))}
    </div>
  )
}
