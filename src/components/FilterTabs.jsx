import { UI_TEXT } from '../constants/uiText'

export function FilterTabs({ activeFilter, counts, onChange }) {
  const filters = [
    { key: 'all', label: UI_TEXT.clothing.filters.all, count: counts.total },
    { key: 'vorhanden', label: UI_TEXT.clothing.filters.vorhanden, count: counts.vorhanden },
    { key: 'zu_klein', label: UI_TEXT.clothing.filters.zu_klein, count: counts.zu_klein },
    { key: 'aussortiert', label: UI_TEXT.clothing.filters.aussortiert, count: counts.aussortiert }
  ]

  return (
    <div className="tabs tabs-boxed bg-base-100 shadow">
      {filters.map((filter) => (
        <button
          key={filter.key}
          onClick={() => onChange(filter.key)}
          className={`tab gap-2 ${activeFilter === filter.key ? 'tab-active' : ''}`}
        >
          {filter.label}
          <span className="badge badge-sm">{filter.count}</span>
        </button>
      ))}
    </div>
  )
}
