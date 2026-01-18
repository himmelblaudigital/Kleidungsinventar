import { AlertTriangle } from 'lucide-react'
import { UI_TEXT } from '../constants/uiText'

export function ClothingConfirmDialog({ item, onConfirm, onCancel }) {
  const message = UI_TEXT.clothing.confirmDeleteClothing.replace('{item}', item.kategorie)

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md shadow-xl">
        <div className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle size={24} className="text-error" strokeWidth={2.5} />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-xl text-gray-800 mb-2">
                {UI_TEXT.clothing.deleteClothing}
              </h3>
              <p className="text-gray-600 leading-relaxed">{message}</p>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-secondary border-2 border-secondary-dark text-secondary-dark hover:bg-secondary/80 rounded-lg transition-colors font-medium"
            >
              {UI_TEXT.cancel}
            </button>
            <button
              onClick={() => onConfirm(item)}
              className="px-4 py-2 bg-error text-white hover:bg-error/90 rounded-lg transition-colors font-medium shadow-sm"
            >
              {UI_TEXT.clothing.deleteClothing}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
