import { getApp, getApps, initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getDatabase } from 'firebase/database'
import { getAnalytics, isSupported } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: 'AIzaSyAM31ZpPKimZuCLfqX_TBlTXmfQ9a9PTaw',
  authDomain: 'myjob-tracker-app.firebaseapp.com',
  databaseURL:
    'https://myjob-tracker-app-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'myjob-tracker-app',
  storageBucket: 'myjob-tracker-app.firebasestorage.app',
  messagingSenderId: '1013789087770',
  appId: '1:1013789087770:web:99a6ee5a1ce7d73cfe19a3',
  measurementId: 'G-Y955RMPYJG',
}

export const firebaseApp =
  getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)

export const auth = getAuth(firebaseApp)
export const database = getDatabase(firebaseApp)
export const googleProvider = new GoogleAuthProvider()

if (typeof window !== 'undefined') {
  void isSupported().then((supported) => {
    if (supported) {
      getAnalytics(firebaseApp)
    }
  })
}
