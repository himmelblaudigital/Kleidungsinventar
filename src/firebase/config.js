import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDRgsgU1VXWCE_nSYcJyMOpGfo6SkddZH4",
  authDomain: "kleidungsinventar.firebaseapp.com",
  projectId: "kleidungsinventar",
  storageBucket: "kleidungsinventar.firebasestorage.app",
  messagingSenderId: "435354267146",
  appId: "1:435354267146:web:d074dad403a2189c32f9f3",
  measurementId: "G-TYQQFX2P4J"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firestore
export const db = getFirestore(app)

// Initialize Storage
export const storage = getStorage(app)
