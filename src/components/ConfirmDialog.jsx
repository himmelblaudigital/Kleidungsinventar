import { AlertTriangle } from 'lucide-react'
import { UI_TEXT } from '../constants/uiText'

export function ConfirmDialog({ person, onConfirm, onCancel }) {
  const message = UI_TEXT.confirmDelete.replace('{name}', person.name)

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-error bg-opacity-20 rounded-full flex items-center justify-center">
              <AlertTriangle size={24} className="text-error" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-2">
              {UI_TEXT.deletePerson}
            </h3>
            <p className="opacity-70">{message}</p>
          </div>
        </div>

        <div className="modal-action">
          <button
            onClick={onCancel}
            className="btn btn-ghost"
          >
            {UI_TEXT.cancel}
          </button>
          <button
            onClick={() => onConfirm(person)}
            className="btn btn-error"
          >
            {UI_TEXT.deletePerson}
          </button>
        </div>
      </div>
    </div>
  )
}
