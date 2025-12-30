import { Edit2, Trash2 } from 'lucide-react'
import { StatusBadge } from './StatusBadge'
import { UI_TEXT } from '../constants/uiText'

export function ClothingCard({ item, onStatusChange, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800">{item.kategorie}</h3>
          <div className="text-sm text-gray-600 space-y-1 mt-1">
            {item.farbe && (
              <p>
                <span className="font-medium">{UI_TEXT.clothing.color}:</span> {item.farbe}
              </p>
            )}
            {item.marke && (
              <p>
                <span className="font-medium">{UI_TEXT.clothing.brand}:</span> {item.marke}
              </p>
            )}
            {item.groesse && (
              <p>
                <span className="font-medium">{UI_TEXT.clothing.size}:</span> {item.groesse}
              </p>
            )}
          </div>
        </div>
      </div>

      {item.notizen && (
        <p className="text-sm text-gray-500 italic mb-3 border-t pt-2">
          {item.notizen}
        </p>
      )}

      <div className="flex items-center justify-between pt-3 border-t">
        <StatusBadge
          currentStatus={item.status}
          onChange={(newStatus) => onStatusChange(item.id, newStatus)}
        />

        <div className="flex gap-2">
          <button
            onClick={() => onEdit(item)}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            title={UI_TEXT.edit}
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={() => onDelete(item)}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
            title={UI_TEXT.clothing.deleteClothing}
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
