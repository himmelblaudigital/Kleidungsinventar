import * as Icons from 'lucide-react'
import { UI_TEXT } from '../constants/uiText'

export function PersonCard({ person, onEdit, onDelete, onViewClothing }) {
  const IconComponent = Icons[person.avatar] || Icons.User

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
          <IconComponent size={32} className="text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-800 truncate" title={person.name}>
            {person.name}
          </h3>
          <p className="text-sm text-gray-500">{person.kategorie}</p>
          {person.groesse && (
            <p className="text-xs text-gray-400">{person.groesse}</p>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <button
          onClick={() => onViewClothing(person)}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md text-sm font-medium transition-colors"
        >
          {UI_TEXT.clothing.viewClothing}
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(person)}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-md text-sm font-medium transition-colors"
          >
            {UI_TEXT.edit}
          </button>
          <button
            onClick={() => onDelete(person)}
            className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-md text-sm font-medium transition-colors"
          >
            {UI_TEXT.deletePerson}
          </button>
        </div>
      </div>
    </div>
  )
}
