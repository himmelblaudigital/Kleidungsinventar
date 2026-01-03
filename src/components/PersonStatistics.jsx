import { UI_TEXT } from '../constants/uiText'

export function PersonStatistics({ clothing }) {
  const total = clothing.length
  const zuKlein = clothing.filter((item) => item.status === 'zu_klein').length
  const aussortiert = clothing.filter((item) => item.status === 'aussortiert').length

  return (
    <div className="stats shadow bg-base-100 mb-6">
      <div className="stat">
        <div className="stat-title">Gesamt</div>
        <div className="stat-value text-primary text-2xl">{total}</div>
        <div className="stat-desc">{UI_TEXT.clothing.items}</div>
      </div>

      {zuKlein > 0 && (
        <div className="stat">
          <div className="stat-title">Zu klein</div>
          <div className="stat-value text-warning text-2xl">{zuKlein}</div>
          <div className="stat-desc">{UI_TEXT.clothing.itemsToSmall}</div>
        </div>
      )}

      {aussortiert > 0 && (
        <div className="stat">
          <div className="stat-title">Aussortiert</div>
          <div className="stat-value text-error text-2xl">{aussortiert}</div>
          <div className="stat-desc">{UI_TEXT.clothing.itemsSorted}</div>
        </div>
      )}
    </div>
  )
}
