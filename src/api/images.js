import { apiRequest } from './client'

/**
 * Upload clothing image to the server (stored on disk, path saved in MySQL)
 * @param {File} file - Image file to upload
 * @param {string|number} personId - ID of the person who owns the clothing
 * @param {string|number} clothingId - ID of the clothing item
 * @returns {Promise<{downloadURL: string, storagePath: string}>}
 */
export async function uploadClothingImage(file, personId, clothingId) {
  if (!file.type.startsWith('image/')) {
    throw new Error('Datei muss ein Bild sein')
  }

  const MAX_SIZE = 5 * 1024 * 1024 // 5MB
  if (file.size > MAX_SIZE) {
    throw new Error('Bild ist zu groß (max. 5MB)')
  }

  const formData = new FormData()
  formData.append('image', file)
  formData.append('personId', personId)
  formData.append('clothingId', clothingId)

  const result = await apiRequest('/api/upload.php', {
    method: 'POST',
    body: formData,
    isFormData: true,
  })

  return {
    downloadURL: result.url,
    storagePath: result.path,
  }
}

/**
 * Delete clothing image from the server
 * @param {string} storagePath - Relative path returned by uploadClothingImage
 * @returns {Promise<void>}
 */
export async function deleteClothingImage(storagePath) {
  if (!storagePath) {
    return // No image to delete
  }

  await apiRequest('/api/upload.php', {
    method: 'DELETE',
    body: { path: storagePath },
  })
}
