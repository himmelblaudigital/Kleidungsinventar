import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage } from './config'

/**
 * Upload clothing image to Firebase Storage
 * @param {File} file - Image file to upload
 * @param {string} personId - ID of the person who owns the clothing
 * @param {string} clothingId - ID of the clothing item
 * @returns {Promise<{downloadURL: string, storagePath: string}>}
 */
export async function uploadClothingImage(file, personId, clothingId) {
  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('Datei muss ein Bild sein')
    }

    // Validate file size (max 5MB)
    const MAX_SIZE = 5 * 1024 * 1024 // 5MB
    if (file.size > MAX_SIZE) {
      throw new Error('Bild ist zu groß (max. 5MB)')
    }

    // Create storage path
    const fileExtension = file.name.split('.').pop() || 'jpg'
    const storagePath = `clothing/${personId}/${clothingId}/image.${fileExtension}`

    // Create storage reference
    const storageRef = ref(storage, storagePath)

    // Upload file
    const snapshot = await uploadBytes(storageRef, file, {
      contentType: file.type,
      customMetadata: {
        uploadedAt: new Date().toISOString(),
        personId,
        clothingId
      }
    })

    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref)

    return {
      downloadURL,
      storagePath
    }
  } catch (error) {
    console.error('Error uploading image:', error)
    throw new Error(`Fehler beim Hochladen des Bildes: ${error.message}`)
  }
}

/**
 * Delete clothing image from Firebase Storage
 * @param {string} storagePath - Path to the image in Storage
 * @returns {Promise<void>}
 */
export async function deleteClothingImage(storagePath) {
  try {
    if (!storagePath) {
      return // No image to delete
    }

    const storageRef = ref(storage, storagePath)
    await deleteObject(storageRef)
  } catch (error) {
    // If file doesn't exist, ignore the error
    if (error.code === 'storage/object-not-found') {
      console.warn('Image not found in storage, skipping deletion')
      return
    }

    console.error('Error deleting image:', error)
    throw new Error(`Fehler beim Löschen des Bildes: ${error.message}`)
  }
}
