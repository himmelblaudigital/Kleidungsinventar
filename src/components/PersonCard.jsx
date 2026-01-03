import * as Icons from 'lucide-react'
import { UI_TEXT } from '../constants/uiText'

export function PersonCard({ person, onEdit, onDelete, onViewClothing }) {
  const IconComponent = Icons[person.avatar] || Icons.User

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      <div className="p-6">
        {/* Header with Avatar and Info */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <div className="bg-primary text-primary-light rounded-full w-20 h-20 flex items-center justify-center ring-4 ring-primary/10">
              <IconComponent size={40} strokeWidth={2} />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-gray-800 truncate mb-1" title={person.name}>
              {person.name}
            </h3>
            <p className="text-sm text-gray-600 font-medium">{person.kategorie}</p>
            {person.groesse && (
              <p className="text-sm text-gray-500 mt-0.5">Größe: {person.groesse}</p>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => onViewClothing(person)}
            className="w-full bg-primary hover:bg-primary/90 text-primary-light px-4 py-3 rounded-lg transition-colors font-semibold shadow-sm hover:shadow-md"
          >
            {UI_TEXT.clothing.viewClothing}
          </button>
          <div className="flex gap-3">
            <button
              onClick={() => onEdit(person)}
              className="flex-1 bg-secondary border-2 border-secondary-dark text-secondary-dark hover:bg-secondary/80 px-4 py-2 rounded-lg transition-colors font-medium"
            >
              {UI_TEXT.edit}
            </button>
            <button
              onClick={() => onDelete(person)}
              className="flex-1 border-2 border-error text-error hover:bg-error hover:text-white px-4 py-2 rounded-lg transition-colors font-medium"
            >
              {UI_TEXT.deletePerson}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
