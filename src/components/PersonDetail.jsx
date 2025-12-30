import { useState, useMemo } from 'react'
import { ArrowLeft, Plus } from 'lucide-react'
import * as Icons from 'lucide-react'
import { ClothingCard } from './ClothingCard'
import { FilterTabs } from './FilterTabs'
import { PersonStatistics } from './PersonStatistics'
import { UI_TEXT } from '../constants/uiText'

export function PersonDetail({ person, clothing, onBack, onAddClothing, onEditClothing, onDeleteClothing, onStatusChange }) {
  const [activeFilter, setActiveFilter] = useState('all')

  // Calculate counts for filters
  const counts = useMemo(() => ({
    total: clothing.length,
    vorhanden: clothing.filter((item) => item.status === 'vorhanden').length,
    zu_klein: clothing.filter((item) => item.status === 'zu_klein').length,
    aussortiert: clothing.filter((item) => item.status === 'aussortiert').length
  }), [clothing])

  // Filter clothing items based on active filter
  const filteredClothing = useMemo(() => {
    if (activeFilter === 'all') {
      return clothing
    }
    return clothing.filter((item) => item.status === activeFilter)
  }, [clothing, activeFilter])

  const IconComponent = Icons[person.avatar] || Icons.User

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            {UI_TEXT.clothing.backToDashboard}
          </button>

          <div className="bg-white rounded-lg shadow-md p-6 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <IconComponent size={32} className="text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                    {person.name}
                  </h1>
                  <p className="text-gray-600">
                    {person.kategorie}
                    {person.groesse && ` · ${person.groesse}`}
                  </p>
                </div>
              </div>

              <button
                onClick={onAddClothing}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-md hover:shadow-lg"
              >
                <Plus size={20} />
                <span className="hidden sm:inline">{UI_TEXT.clothing.addClothing}</span>
              </button>
            </div>
          </div>

          {clothing.length > 0 && <PersonStatistics clothing={clothing} />}
        </div>

        {/* Filters */}
        {clothing.length > 0 && (
          <div className="mb-6">
            <FilterTabs
              activeFilter={activeFilter}
              counts={counts}
              onChange={setActiveFilter}
            />
          </div>
        )}

        {/* Clothing List */}
        {filteredClothing.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Plus size={64} className="mx-auto" />
            </div>
            <p className="text-xl text-gray-600 mb-2">
              {clothing.length === 0 ? UI_TEXT.clothing.noClothing : 'Keine Kleidung in diesem Filter'}
            </p>
            <p className="text-gray-500">
              {clothing.length === 0 && UI_TEXT.clothing.addFirstItem}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredClothing.map((item) => (
              <ClothingCard
                key={item.id}
                item={item}
                onStatusChange={onStatusChange}
                onEdit={onEditClothing}
                onDelete={onDeleteClothing}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
