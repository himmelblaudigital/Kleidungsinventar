import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { CategorySelect } from './CategorySelect'
import { ImageUpload } from './ImageUpload'
import { UI_TEXT } from '../constants/uiText'
import { CLOTHING_STATUSES } from '../constants/clothingStatuses'

export function ClothingForm({ mode, clothing, personId, persons, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    personId: personId || clothing?.personId || '',
    kategorie: clothing?.kategorie || '',
    groesse: clothing?.groesse || '',
    status: clothing?.status || 'vorhanden',
    notizen: clothing?.notizen || '',
    imageUrl: clothing?.imageUrl || null,
    imagePath: clothing?.imagePath || null
  })
  const [error, setError] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imageError, setImageError] = useState('')
  const showPersonSelect = !personId && persons && persons.length > 0

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      if (imageFile) {
        URL.revokeObjectURL(URL.createObjectURL(imageFile))
      }
    }
  }, [imageFile])

  const handleSubmit = (e) => {
    e.preventDefault()

    if (showPersonSelect && !formData.personId) {
      setError(UI_TEXT.clothing.personRequired)
      return
    }

    if (!formData.kategorie || formData.kategorie === 'Andere...') {
      setError(UI_TEXT.clothing.categoryRequired)
      return
    }

    onSave(formData, imageFile)
  }

  const handleImageChange = (file) => {
    setImageFile(file)
    setImageError('')
  }

  const handleImageClear = () => {
    setImageFile(null)
    handleChange('imageUrl', null)
    handleChange('imagePath', null)
    setImageError('')
  }

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (error) setError('')
  }

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b-2 border-primary px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-primary">
            {mode === 'addClothing' ? UI_TEXT.clothing.addClothing : UI_TEXT.clothing.editClothing}
          </h2>
          <button
            onClick={onCancel}
            className="text-primary hover:text-primary/70 transition-colors"
            aria-label={UI_TEXT.cancel}
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {showPersonSelect && (
            <div>
              <label htmlFor="personId" className="block text-sm font-medium text-primary mb-1">
                {UI_TEXT.clothing.selectPerson} *
              </label>
              <select
                id="personId"
                value={formData.personId}
                onChange={(e) => handleChange('personId', e.target.value)}
                className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">{UI_TEXT.clothing.selectPerson}...</option>
                {persons.map((person) => (
                  <option key={person.id} value={person.id}>
                    {person.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label htmlFor="kategorie" className="block text-sm font-medium text-primary mb-1">
              {UI_TEXT.clothing.category} *
            </label>
            <CategorySelect
              value={formData.kategorie}
              onChange={(value) => handleChange('kategorie', value)}
            />
            {error && (
              <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
          </div>

          <div>
            <label htmlFor="groesse" className="block text-sm font-medium text-primary mb-1">
              {UI_TEXT.clothing.size}
            </label>
            <input
              type="text"
              id="groesse"
              value={formData.groesse}
              onChange={(e) => handleChange('groesse', e.target.value)}
              className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="z.B. 122cm, M, 38"
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-primary mb-1">
              {UI_TEXT.clothing.status}
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {Object.entries(CLOTHING_STATUSES).map(([statusKey, config]) => (
                <option key={statusKey} value={statusKey}>
                  {config.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="notizen" className="block text-sm font-medium text-primary mb-1">
              {UI_TEXT.clothing.notes}
            </label>
            <textarea
              id="notizen"
              value={formData.notizen}
              onChange={(e) => handleChange('notizen', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Optionale Notizen..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-1">
              {UI_TEXT.clothing.image}
            </label>
            <ImageUpload
              value={imageFile ? URL.createObjectURL(imageFile) : formData.imageUrl}
              onChange={handleImageChange}
              onClear={handleImageClear}
              disabled={false}
              error={imageError}
            />
            <p className="mt-1 text-sm text-gray-500">{UI_TEXT.clothing.imageOptional}</p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 bg-secondary border-2 border-secondary-dark text-secondary-dark hover:bg-secondary/80 rounded-md transition-colors font-medium"
            >
              {UI_TEXT.cancel}
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary text-primary-light rounded-md hover:bg-primary/90 transition-colors font-medium"
            >
              {UI_TEXT.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
