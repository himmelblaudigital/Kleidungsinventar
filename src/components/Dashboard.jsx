import { Plus, Package } from 'lucide-react'
import { PersonCard } from './PersonCard'
import { UI_TEXT } from '../constants/uiText'

export function Dashboard({ persons, onAddClick, onEditClick, onDeleteClick, onViewClothing, onViewAllClothing }) {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            {UI_TEXT.appTitle}
          </h1>
          <div className="flex gap-2">
            <button
              onClick={onViewAllClothing}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Package size={20} />
              <span className="hidden sm:inline">{UI_TEXT.clothing.allClothing}</span>
            </button>
            <button
              onClick={onAddClick}
              className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium shadow-sm"
            >
              <Plus size={20} />
              <span>{UI_TEXT.addPerson}</span>
            </button>
          </div>
        </header>

        {persons.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Plus size={64} className="mx-auto" />
            </div>
            <p className="text-xl text-gray-600 mb-2">{UI_TEXT.noPersons}</p>
            <p className="text-gray-500">{UI_TEXT.addFirstPerson}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {persons.map((person) => (
              <PersonCard
                key={person.id}
                person={person}
                onEdit={onEditClick}
                onDelete={onDeleteClick}
                onViewClothing={onViewClothing}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
