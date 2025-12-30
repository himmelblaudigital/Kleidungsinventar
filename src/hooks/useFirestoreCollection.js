import { useState, useEffect } from 'react'
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
} from 'firebase/firestore'
import { db } from '../firebase/config'

/**
 * Custom hook for Firestore collection with real-time updates
 * @param {string} collectionName - Name of the Firestore collection
 * @returns {[Array, Function]} - [data, operations]
 */
export function useFirestoreCollection(collectionName) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Real-time listener
  useEffect(() => {
    setLoading(true)

    const collectionRef = collection(db, collectionName)

    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(
      collectionRef,
      (snapshot) => {
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }))
        setData(items)
        setLoading(false)
        setError(null)
      },
      (err) => {
        console.error(`Error fetching ${collectionName}:`, err)
        setError(err.message)
        setLoading(false)
      }
    )

    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [collectionName])

  // Add new document
  const addItem = async (itemData) => {
    try {
      const collectionRef = collection(db, collectionName)
      const docRef = await addDoc(collectionRef, itemData)
      return docRef.id
    } catch (err) {
      console.error(`Error adding to ${collectionName}:`, err)
      setError(err.message)
      throw err
    }
  }

  // Update existing document
  const updateItem = async (id, itemData) => {
    try {
      const docRef = doc(db, collectionName, id)
      await updateDoc(docRef, itemData)
    } catch (err) {
      console.error(`Error updating ${collectionName}:`, err)
      setError(err.message)
      throw err
    }
  }

  // Delete document
  const deleteItem = async (id) => {
    try {
      const docRef = doc(db, collectionName, id)
      await deleteDoc(docRef)
    } catch (err) {
      console.error(`Error deleting from ${collectionName}:`, err)
      setError(err.message)
      throw err
    }
  }

  // Return data and operations
  return {
    data,
    loading,
    error,
    addItem,
    updateItem,
    deleteItem
  }
}
