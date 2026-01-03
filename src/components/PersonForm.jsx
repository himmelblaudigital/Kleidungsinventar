import { useState } from 'react'
import { X } from 'lucide-react'
import { IconPicker } from './IconPicker'
import { CATEGORIES } from '../constants/categories'
import { UI_TEXT } from '../constants/uiText'

export function PersonForm({ mode, person, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: person?.name || '',
    kategorie: person?.kategorie || 'kind',
    groesse: person?.groesse || '',
    avatar: person?.avatar || 'User'
  })
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      setError(UI_TEXT.nameRequired)
      return
    }

    onSave(formData)
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
            {mode === 'add' ? UI_TEXT.addPerson : UI_TEXT.editPerson}
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
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-primary mb-1">
              {UI_TEXT.name} *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder={UI_TEXT.name}
              autoFocus
            />
            {error && (
              <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
          </div>

          <div>
            <label htmlFor="kategorie" className="block text-sm font-medium text-primary mb-1">
              {UI_TEXT.category}
            </label>
            <select
              id="kategorie"
              value={formData.kategorie}
              onChange={(e) => handleChange('kategorie', e.target.value)}
              className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="groesse" className="block text-sm font-medium text-primary mb-1">
              {UI_TEXT.size}
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

          <IconPicker
            selectedIcon={formData.avatar}
            onSelectIcon={(icon) => handleChange('avatar', icon)}
          />

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
