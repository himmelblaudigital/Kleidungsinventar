import { Edit2, Trash2, Image as ImageIcon } from 'lucide-react'
import { StatusBadge } from './StatusBadge'
import { UI_TEXT } from '../constants/uiText'

export function ClothingCard({ item, onStatusChange, onEdit, onDelete }) {
  const handleCardClick = () => {
    onEdit(item)
  }

  const handleStatusChange = (newStatus) => {
    onStatusChange(item.id, newStatus)
  }

  const handleDelete = (e) => {
    e.stopPropagation()
    onDelete(item)
  }

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden cursor-pointer"
    >
      {/* Image Section */}
      {item.imageUrl ? (
        <div className="relative w-full h-48">
          <img
            src={item.imageUrl}
            alt={item.kategorie}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="relative w-full h-48 bg-gray-100 flex items-center justify-center">
          <ImageIcon size={48} className="text-gray-400" />
        </div>
      )}

      {/* Content Section */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{item.kategorie}</h3>
        {item.groesse && (
          <p className="text-sm text-gray-600 mt-2">
            <span className="font-medium">{UI_TEXT.clothing.size}:</span> {item.groesse}
          </p>
        )}

        {item.notizen && (
          <p className="text-sm text-gray-500 italic mt-3 pt-3 border-t border-gray-200">
            {item.notizen}
          </p>
        )}

        <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-200">
          <div onClick={(e) => e.stopPropagation()}>
            <StatusBadge
              currentStatus={item.status}
              onChange={handleStatusChange}
            />
          </div>

          <button
            onClick={handleDelete}
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
