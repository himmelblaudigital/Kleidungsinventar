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
    zu_gross: clothing.filter((item) => item.status === 'zu_gross').length,
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
      <div className="relative">
        {/* Person Badge */}
        <div className="absolute top-2 left-2 z-10 bg-primary text-primary-light px-2 py-1 rounded-md flex items-center gap-1 text-xs font-medium shadow-sm">
          <IconComponent size={12} />
          <span>{person.name}</span>
        </div>

        {/* Clothing Card */}
        <ClothingCard
          item={item}
          onStatusChange={onStatusChange}
          onEdit={onEditClothing}
          onDelete={onDeleteClothing}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={onBack}
            className="bg-secondary border-2 border-secondary-dark text-secondary-dark hover:bg-secondary/80 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium mb-4"
          >
            <ArrowLeft size={20} />
            {UI_TEXT.clothing.backToDashboard}
          </button>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              {UI_TEXT.clothing.allClothing}
            </h1>
            <p className="text-gray-600 mt-1">
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {UI_TEXT.clothing.filterByPerson}
              </label>
              <select
                value={activePersonFilter}
                onChange={(e) => setActivePersonFilter(e.target.value)}
                className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {UI_TEXT.clothing.filterByCategory}
              </label>
              <select
                value={activeCategoryFilter}
                onChange={(e) => setActiveCategoryFilter(e.target.value)}
                className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
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
