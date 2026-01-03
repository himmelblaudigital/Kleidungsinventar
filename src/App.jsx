import { useState } from 'react'
import { useFirestoreCollection } from './hooks/useFirestoreCollection'
import { uploadClothingImage, deleteClothingImage } from './firebase/storage'
import { Dashboard } from './components/Dashboard'
import { PersonForm } from './components/PersonForm'
import { ConfirmDialog } from './components/ConfirmDialog'
import { PersonDetail } from './components/PersonDetail'
import { ClothingForm } from './components/ClothingForm'
import { AllClothingView } from './components/AllClothingView'
import { Toast } from './components/Toast'
import { UI_TEXT } from './constants/uiText'

function App() {
  // Firestore collections with real-time sync
  const personsCollection = useFirestoreCollection('persons')
  const clothingCollection = useFirestoreCollection('clothing')

  // View management state
  const [currentView, setCurrentView] = useState('dashboard')
  const [editingPerson, setEditingPerson] = useState(null)
  const [deleteConfirmPerson, setDeleteConfirmPerson] = useState(null)
  const [selectedPerson, setSelectedPerson] = useState(null)
  const [editingClothing, setEditingClothing] = useState(null)

  // Toast notification state
  const [toast, setToast] = useState(null)

  // Extract data from Firestore hooks
  const persons = personsCollection.data
  const clothing = clothingCollection.data
  const loading = personsCollection.loading || clothingCollection.loading

  // Show loading screen while data is being fetched
  if (loading && persons.length === 0 && clothing.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Laden...</p>
        </div>
      </div>
    )
  }

  const handleAddClick = () => {
    setCurrentView('add')
    setEditingPerson(null)
  }

  const handleEditClick = (person) => {
    setEditingPerson(person)
    setCurrentView('edit')
  }

  const handleDeleteClick = (person) => {
    setDeleteConfirmPerson(person)
  }

  const handleSavePerson = async (formData) => {
    try {
      if (currentView === 'add') {
        await personsCollection.addItem(formData)
        setToast({ message: UI_TEXT.personAdded, type: 'success' })
      } else if (currentView === 'edit') {
        await personsCollection.updateItem(editingPerson.id, formData)
        setToast({ message: UI_TEXT.personUpdated, type: 'success' })
      }
      setCurrentView('dashboard')
      setEditingPerson(null)
    } catch (error) {
      console.error('Error saving person:', error)
      setToast({ message: 'Fehler beim Speichern der Person', type: 'error' })
    }
  }

  const handleCancelForm = () => {
    setCurrentView('dashboard')
    setEditingPerson(null)
  }

  const handleConfirmDelete = async (person) => {
    try {
      await personsCollection.deleteItem(person.id)

      // Delete all clothing items and their images
      const personClothing = clothing.filter(c => c.personId === person.id)
      await Promise.all(personClothing.map(async (item) => {
        // Delete image from Storage if exists
        if (item.imagePath) {
          await deleteClothingImage(item.imagePath)
        }
        // Delete Firestore document
        await clothingCollection.deleteItem(item.id)
      }))

      setDeleteConfirmPerson(null)
      setToast({ message: UI_TEXT.personDeleted, type: 'success' })
    } catch (error) {
      console.error('Error deleting person:', error)
      setToast({ message: 'Fehler beim Löschen der Person', type: 'error' })
    }
  }

  const handleCancelDelete = () => {
    setDeleteConfirmPerson(null)
  }

  // Clothing management handlers
  const handleViewClothing = (person) => {
    setSelectedPerson(person)
    setCurrentView('personDetail')
  }

  const handleAddClothing = () => {
    setCurrentView('addClothing')
  }

  const handleQuickAddClothing = () => {
    setSelectedPerson(null)
    setEditingClothing(null)
    setCurrentView('quickAddClothing')
  }

  const handleEditClothing = (item) => {
    setEditingClothing(item)
    setCurrentView('editClothing')
  }

  const handleSaveClothing = async (formData, imageFile) => {
    try {
      let imageUrl = formData.imageUrl
      let imagePath = formData.imagePath
      const targetPersonId = formData.personId || selectedPerson?.id

      if (currentView === 'addClothing' || currentView === 'quickAddClothing') {
        // Create Firestore document first to get the ID
        const newItem = {
          personId: targetPersonId,
          ...formData,
          imageUrl: null,
          imagePath: null
        }
        const docId = await clothingCollection.addItem(newItem)

        // Upload image if provided
        if (imageFile) {
          const { downloadURL, storagePath } = await uploadClothingImage(
            imageFile,
            targetPersonId,
            docId
          )
          imageUrl = downloadURL
          imagePath = storagePath

          // Update document with image URLs
          await clothingCollection.updateItem(docId, {
            imageUrl,
            imagePath
          })
        }

        setToast({ message: UI_TEXT.clothing.clothingAdded, type: 'success' })

      } else if (currentView === 'editClothing') {
        // Handle image replacement
        if (imageFile) {
          // Delete old image if exists
          if (editingClothing.imagePath) {
            await deleteClothingImage(editingClothing.imagePath)
          }

          // Upload new image
          const { downloadURL, storagePath } = await uploadClothingImage(
            imageFile,
            selectedPerson.id,
            editingClothing.id
          )
          imageUrl = downloadURL
          imagePath = storagePath
        }

        await clothingCollection.updateItem(editingClothing.id, {
          ...formData,
          imageUrl,
          imagePath
        })

        setToast({ message: UI_TEXT.clothing.clothingUpdated, type: 'success' })
      }

      // Navigate back based on context
      if (currentView === 'quickAddClothing') {
        setCurrentView('dashboard')
      } else {
        setCurrentView('personDetail')
      }
      setEditingClothing(null)
    } catch (error) {
      console.error('Error saving clothing:', error)
      setToast({ message: 'Fehler beim Speichern des Kleidungsstücks', type: 'error' })
    }
  }

  const handleDeleteClothing = async (item) => {
    try {
      // Delete image from Storage if exists
      if (item.imagePath) {
        await deleteClothingImage(item.imagePath)
      }

      // Delete Firestore document
      await clothingCollection.deleteItem(item.id)
      setToast({ message: UI_TEXT.clothing.clothingDeleted, type: 'success' })
    } catch (error) {
      console.error('Error deleting clothing:', error)
      setToast({ message: 'Fehler beim Löschen des Kleidungsstücks', type: 'error' })
    }
  }

  const handleStatusChange = async (itemId, newStatus) => {
    try {
      await clothingCollection.updateItem(itemId, { status: newStatus })
      setToast({ message: UI_TEXT.clothing.statusUpdated, type: 'success' })
    } catch (error) {
      console.error('Error updating status:', error)
      setToast({ message: 'Fehler beim Aktualisieren des Status', type: 'error' })
    }
  }

  const handleBackToPersonDetail = () => {
    setCurrentView('personDetail')
    setEditingClothing(null)
  }

  const handleBackToDashboard = () => {
    setCurrentView('dashboard')
    setSelectedPerson(null)
  }

  const handleViewAllClothing = () => {
    setCurrentView('allClothing')
  }

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {currentView === 'dashboard' && (
        <Dashboard
          persons={persons}
          onAddClick={handleAddClick}
          onEditClick={handleEditClick}
          onDeleteClick={handleDeleteClick}
          onViewClothing={handleViewClothing}
          onViewAllClothing={handleViewAllClothing}
          onQuickAddClothing={handleQuickAddClothing}
        />
      )}

      {currentView === 'allClothing' && (
        <AllClothingView
          persons={persons}
          clothing={clothing}
          onBack={handleBackToDashboard}
          onEditClothing={handleEditClothing}
          onDeleteClothing={handleDeleteClothing}
          onStatusChange={handleStatusChange}
        />
      )}

      {currentView === 'personDetail' && selectedPerson && (
        <PersonDetail
          person={selectedPerson}
          clothing={clothing.filter((c) => c.personId === selectedPerson.id)}
          onBack={handleBackToDashboard}
          onAddClothing={handleAddClothing}
          onEditClothing={handleEditClothing}
          onDeleteClothing={handleDeleteClothing}
          onStatusChange={handleStatusChange}
        />
      )}

      {(currentView === 'add' || currentView === 'edit') && (
        <PersonForm
          mode={currentView}
          person={editingPerson}
          onSave={handleSavePerson}
          onCancel={handleCancelForm}
        />
      )}

      {(currentView === 'addClothing' || currentView === 'editClothing') && selectedPerson && (
        <ClothingForm
          mode={currentView}
          clothing={editingClothing}
          personId={selectedPerson.id}
          persons={persons}
          onSave={handleSaveClothing}
          onCancel={handleBackToPersonDetail}
        />
      )}

      {currentView === 'quickAddClothing' && (
        <ClothingForm
          mode="addClothing"
          clothing={null}
          personId={null}
          persons={persons}
          onSave={handleSaveClothing}
          onCancel={handleBackToDashboard}
        />
      )}

      {deleteConfirmPerson && (
        <ConfirmDialog
          person={deleteConfirmPerson}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </>
  )
}

export default App
