import { useState, useMemo } from 'react'
import { ArrowLeft } from 'lucide-react'
import * as Icons from 'lucide-react'
import { ClothingCard } from './ClothingCard'
import { FilterTabs } from './FilterTabs'
import { UI_TEXT } from '../constants/uiText'

export function AllClothingView({ persons, clothing, onBack, onEditClothing, onDeleteClothing, onStatusChange }) {
  const [activeStatusFilter, setActiveStatusFilter] = useState('all')
  const [activePersonFilter, setActivePersonFilter] = useState('all')
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all')

  // Get unique categories from clothing items
  const categories = useMemo(() => {
    const cats = new Set(clothing.map(item => item.kategorie))
    return Array.from(cats).sort()
  }, [clothing])

  // Calculate counts for status filters
  const statusCounts = useMemo(() => ({
    total: clothing.length,
    vorhanden: clothing.filter((item) => item.status === 'vorhanden').length,
    zu_klein: clothing.filter((item) => item.status === 'zu_klein').length,
    aussortiert: clothing.filter((item) => item.status === 'aussortiert').length
  }), [clothing])

  // Filter clothing items
  const filteredClothing = useMemo(() => {
    return clothing.filter((item) => {
      // Status filter
      if (activeStatusFilter !== 'all' && item.status !== activeStatusFilter) {
        return false
      }
      // Person filter
      if (activePersonFilter !== 'all' && item.personId !== activePersonFilter) {
        return false
      }
      // Category filter
      if (activeCategoryFilter !== 'all' && item.kategorie !== activeCategoryFilter) {
        return false
      }
      return true
    })
  }, [clothing, activeStatusFilter, activePersonFilter, activeCategoryFilter])

  // Get person by ID
  const getPersonById = (personId) => {
    return persons.find(p => p.id === personId)
  }

  // Enhanced clothing card with person info
  const ClothingCardWithPerson = ({ item }) => {
    const person = getPersonById(item.personId)
    if (!person) return null

    const IconComponent = Icons[person.avatar] || Icons.User

    return (
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
        {/* Person Badge */}
        <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <IconComponent size={14} className="text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-700">{person.name}</span>
          </div>
        </div>

        {/* Clothing Info */}
        <div className="p-4">
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-gray-800">{item.kategorie}</h3>
            <div className="text-sm text-gray-600 space-y-1 mt-1">
              {item.farbe && (
                <p>
                  <span className="font-medium">{UI_TEXT.clothing.color}:</span> {item.farbe}
                </p>
              )}
              {item.marke && (
                <p>
                  <span className="font-medium">{UI_TEXT.clothing.brand}:</span> {item.marke}
                </p>
              )}
              {item.groesse && (
                <p>
                  <span className="font-medium">{UI_TEXT.clothing.size}:</span> {item.groesse}
                </p>
              )}
            </div>
          </div>

          {item.notizen && (
            <p className="text-sm text-gray-500 italic mb-3 border-t pt-2">
              {item.notizen}
            </p>
          )}

          <ClothingCard
            item={item}
            onStatusChange={onStatusChange}
            onEdit={onEditClothing}
            onDelete={onDeleteClothing}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            {UI_TEXT.clothing.backToDashboard}
          </button>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              {UI_TEXT.clothing.allClothing}
            </h1>
            <p className="text-gray-600">
              {clothing.length} {UI_TEXT.clothing.items} insgesamt
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="space-y-4 mb-6">
          {/* Status Filter */}
          <div>
            <FilterTabs
              activeFilter={activeStatusFilter}
              counts={statusCounts}
              onChange={setActiveStatusFilter}
            />
          </div>

          {/* Person and Category Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Person Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {UI_TEXT.clothing.filterByPerson}
              </label>
              <select
                value={activePersonFilter}
                onChange={(e) => setActivePersonFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="all">{UI_TEXT.clothing.allPersons}</option>
                {persons.map((person) => (
                  <option key={person.id} value={person.id}>
                    {person.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {UI_TEXT.clothing.filterByCategory}
              </label>
              <select
                value={activeCategoryFilter}
                onChange={(e) => setActiveCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="all">{UI_TEXT.clothing.allCategories}</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Clothing Grid */}
        {filteredClothing.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600 mb-2">
              {clothing.length === 0 ? UI_TEXT.clothing.noClothing : 'Keine Kleidung passt zu den Filtern'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredClothing.map((item) => (
              <ClothingCardWithPerson key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
