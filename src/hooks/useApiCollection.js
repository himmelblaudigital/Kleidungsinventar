import { useState, useEffect, useCallback } from 'react'
import { apiRequest } from '../api/client'

/**
 * Custom hook for a MySQL-backed collection served by the PHP API.
 * Same shape as the former Firestore hook so components don't need to change.
 * @param {string} resource - API resource name (matches api/<resource>.php)
 * @returns {{data: Array, loading: boolean, error: string|null, addItem: Function, updateItem: Function, deleteItem: Function, refetch: Function}}
 */
export function useApiCollection(resource) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async () => {
    try {
      const items = await apiRequest(`/api/${resource}.php`)
      setData(items || [])
      setError(null)
    } catch (err) {
      console.error(`Error fetching ${resource}:`, err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [resource])

  useEffect(() => {
    setLoading(true)
    fetchData()
  }, [fetchData])

  const addItem = async (itemData) => {
    try {
      const result = await apiRequest(`/api/${resource}.php`, { method: 'POST', body: itemData })
      await fetchData()
      return String(result.id)
    } catch (err) {
      console.error(`Error adding to ${resource}:`, err)
      setError(err.message)
      throw err
    }
  }

  const updateItem = async (id, itemData) => {
    try {
      await apiRequest(`/api/${resource}.php?id=${id}`, { method: 'PUT', body: itemData })
      await fetchData()
    } catch (err) {
      console.error(`Error updating ${resource}:`, err)
      setError(err.message)
      throw err
    }
  }

  const deleteItem = async (id) => {
    try {
      await apiRequest(`/api/${resource}.php?id=${id}`, { method: 'DELETE' })
      await fetchData()
    } catch (err) {
      console.error(`Error deleting from ${resource}:`, err)
      setError(err.message)
      throw err
    }
  }

  return {
    data,
    loading,
    error,
    addItem,
    updateItem,
    deleteItem,
    refetch: fetchData,
  }
}
