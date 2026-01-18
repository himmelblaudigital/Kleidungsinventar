import { initializeApp } from 'firebase/app'
import { getFirestore, initializeFirestore, CACHE_SIZE_UNLIMITED } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAuth } from 'firebase/auth'

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

// Initialize Firestore with explicit settings for mobile compatibility
// Disable experimental features that can cause issues on mobile browsers
export const db = initializeFirestore(app, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED,
  experimentalForceLongPolling: true,  // Better compatibility with mobile browsers
  ignoreUndefinedProperties: true
})

// Initialize Storage
export const storage = getStorage(app)

// Initialize Authentication
export const auth = getAuth(app)
