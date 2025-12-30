import { UI_TEXT } from '../constants/uiText'

export function PersonStatistics({ clothing }) {
  const total = clothing.length
  const zuKlein = clothing.filter((item) => item.status === 'zu_klein').length
  const aussortiert = clothing.filter((item) => item.status === 'aussortiert').length

  return (
    <div className="bg-blue-50 rounded-lg p-4 mb-6">
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-700">Gesamt:</span>
          <span className="text-blue-700 font-bold">{total} {UI_TEXT.clothing.items}</span>
        </div>
        {zuKlein > 0 && (
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            <span className="text-gray-700">{zuKlein} {UI_TEXT.clothing.itemsToSmall}</span>
          </div>
        )}
        {aussortiert > 0 && (
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-gray-700">{aussortiert} {UI_TEXT.clothing.itemsSorted}</span>
          </div>
        )}
      </div>
    </div>
  )
}
