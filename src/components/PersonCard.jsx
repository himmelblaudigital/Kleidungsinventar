import * as Icons from 'lucide-react'
import { UI_TEXT } from '../constants/uiText'

export function PersonCard({ person, onEdit, onDelete, onViewClothing }) {
  const IconComponent = Icons[person.avatar] || Icons.User

  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
      <div className="card-body">
        <div className="flex items-center gap-4 mb-4">
          <div className="avatar placeholder">
            <div className="bg-primary text-primary-content rounded-full w-16">
              <IconComponent size={32} />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="card-title text-lg truncate" title={person.name}>
              {person.name}
            </h3>
            <p className="text-sm text-base-content opacity-70">{person.kategorie}</p>
            {person.groesse && (
              <p className="text-xs text-base-content opacity-50">{person.groesse}</p>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2 mt-4">
          <button
            onClick={() => onViewClothing(person)}
            className="w-full bg-primary hover:bg-primary/90 text-primary-light px-4 py-2 rounded-lg transition-colors font-medium"
          >
            {UI_TEXT.clothing.viewClothing}
          </button>
          <div className="flex gap-2 w-full">
            <button
              onClick={() => onEdit(person)}
              className="flex-1 bg-secondary border-2 border-secondary-dark text-secondary-dark hover:bg-secondary/80 px-3 py-2 rounded-lg transition-colors font-medium"
            >
              {UI_TEXT.edit}
            </button>
            <button
              onClick={() => onDelete(person)}
              className="flex-1 border-2 border-error text-error hover:bg-error hover:text-white px-3 py-2 rounded-lg transition-colors"
            >
              {UI_TEXT.deletePerson}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
