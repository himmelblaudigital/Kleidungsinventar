import { AlertTriangle } from 'lucide-react'
import { UI_TEXT } from '../constants/uiText'

export function ConfirmDialog({ person, onConfirm, onCancel }) {
  const message = UI_TEXT.confirmDelete.replace('{name}', person.name)

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={24} className="text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800">
              {UI_TEXT.deletePerson}
            </h3>
            <p className="text-sm text-gray-600 mt-1">{message}</p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            {UI_TEXT.cancel}
          </button>
          <button
            onClick={() => onConfirm(person)}
            className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            {UI_TEXT.deletePerson}
          </button>
        </div>
      </div>
    </div>
  )
}
