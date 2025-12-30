import { useState } from 'react'
import { CLOTHING_CATEGORIES } from '../constants/clothingCategories'
import { UI_TEXT } from '../constants/uiText'

export function CategorySelect({ value, onChange }) {
  const isCustom = value && !CLOTHING_CATEGORIES.includes(value) && value !== 'Andere...'

  const handleSelectChange = (e) => {
    const selectedValue = e.target.value
    if (selectedValue === 'Andere...') {
      onChange('')
    } else {
      onChange(selectedValue)
    }
  }

  return (
    <div className="space-y-2">
      <select
        value={isCustom ? 'Andere...' : value || ''}
        onChange={handleSelectChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Kategorie wählen...</option>
        {CLOTHING_CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      {(isCustom || value === 'Andere...') && (
        <input
          type="text"
          value={isCustom ? value : ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={UI_TEXT.clothing.customCategory}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
        />
      )}
    </div>
  )
}
