import * as Icons from 'lucide-react'
import { ICON_OPTIONS } from '../constants/iconOptions'
import { UI_TEXT } from '../constants/uiText'

export function IconPicker({ selectedIcon, onSelectIcon }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {UI_TEXT.avatar}
      </label>
      <div className="grid grid-cols-5 gap-2">
        {ICON_OPTIONS.map((iconName) => {
          const IconComponent = Icons[iconName]
          const isSelected = selectedIcon === iconName

          return (
            <button
              key={iconName}
              type="button"
              onClick={() => onSelectIcon(iconName)}
              className={`
                p-3 rounded-lg border-2 transition-all
                flex items-center justify-center
                hover:bg-blue-50 hover:border-blue-300
                ${
                  isSelected
                    ? 'bg-blue-100 border-blue-500'
                    : 'bg-white border-gray-200'
                }
              `}
              style={{ minWidth: '44px', minHeight: '44px' }}
              title={iconName}
            >
              <IconComponent
                size={24}
                className={isSelected ? 'text-blue-600' : 'text-gray-600'}
              />
            </button>
          )
        })}
      </div>
    </div>
  )
}
