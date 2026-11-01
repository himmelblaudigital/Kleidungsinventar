import { apiRequest } from './client'

const MAX_DIMENSION = 1600 // px, längste Kante
const JPEG_QUALITY = 0.85

/**
 * Verkleinert große Bilder im Browser und kodiert sie als JPEG.
 * Fällt bei Fehlern (z.B. nicht dekodierbares Format) auf die Originaldatei zurück.
 */
async function downscaleImage(file) {
  try {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height))
    // Kleine Dateien unverändert lassen
    if (scale === 1 && file.size <= 1024 * 1024) {
      bitmap.close()
      return file
    }

    const canvas = document.createElement('canvas')
    canvas.width = Math.round(bitmap.width * scale)
    canvas.height = Math.round(bitmap.height * scale)
    canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    bitmap.close()

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', JPEG_QUALITY))
    if (!blob) return file

    return new File([blob], 'image.jpg', { type: 'image/jpeg' })
  } catch {
    return file
  }
}

/**
 * Upload clothing image to the server (stored on disk, path saved in MySQL)
 * @param {File} file - Image file to upload
 * @param {string|number} personId - ID of the person who owns the clothing
 * @param {string|number} clothingId - ID of the clothing item
 * @returns {Promise<{downloadURL: string, storagePath: string}>}
 */
export async function uploadClothingImage(originalFile, personId, clothingId) {
  if (!originalFile.type.startsWith('image/')) {
    throw new Error('Datei muss ein Bild sein')
  }

  // Handyfotos sind oft größer als die PHP-Upload-Grenze des Hosters -> vorher verkleinern
  const file = await downscaleImage(originalFile)

  const MAX_SIZE = 5 * 1024 * 1024 // 5MB
  if (file.size > MAX_SIZE) {
    throw new Error('Bild ist zu groß (max. 5MB)')
  }

  const formData = new FormData()
  formData.append('image', file, file.name)
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
