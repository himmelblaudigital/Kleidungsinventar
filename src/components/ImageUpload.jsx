import { useRef } from 'react'
import { Camera, Upload, X, Image as ImageIcon } from 'lucide-react'

export function ImageUpload({ value, onChange, onClear, disabled, error }) {
  const fileInputRef = useRef(null)

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      onChange(file)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleClear = (e) => {
    e.stopPropagation()
    onClear()
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-2">
      {/* Preview or Upload Area */}
      {value ? (
        <div className="relative">
          <img
            src={value}
            alt="Vorschau"
            className="w-full h-48 object-cover rounded-lg border-2 border-gray-300"
          />
          {!disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
            >
              <X size={20} />
            </button>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={handleClick}
          disabled={disabled}
          className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors flex flex-col items-center justify-center gap-3 bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex gap-4">
            <Upload size={32} className="text-gray-400" />
            <Camera size={32} className="text-gray-400" />
          </div>
          <p className="text-sm text-gray-600">
            Bild hochladen oder Foto aufnehmen
          </p>
          <p className="text-xs text-gray-500">
            Klicken zum Auswählen (max. 5MB)
          </p>
        </button>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        disabled={disabled}
        className="hidden"
      />

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-2 rounded">
          <X size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Action Buttons (when image is selected) */}
      {value && !disabled && (
        <button
          type="button"
          onClick={handleClick}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
        >
          <Upload size={16} />
          Bild ändern
        </button>
      )}
    </div>
  )
}
