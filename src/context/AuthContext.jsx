import {
  createContext,
  useEffect,
  useState,
} from 'react'

import { onAuthStateChanged } from 'firebase/auth'

import { auth } from '../config/firebase'
import { getUserProfile } from '../services/auth'


const AuthContext = createContext(null)


function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {

        try {

          if (!firebaseUser) {
            setUser(null)
            setProfile(null)
            setLoading(false)
            return
          }

          setUser(firebaseUser)

          const userProfile = await getUserProfile(
            firebaseUser.uid
          )

          setProfile(userProfile)

        } catch (error) {

          console.error(
            'Failed to load user profile:',
            error
          )

          setProfile(null)

        } finally {

          setLoading(false)

        }
      }
    )

    return unsubscribe
  }, [])


  const value = {
    user,
    profile,
    loading,

    isAuthenticated: !!user,

    role: profile?.role || null,
  }


  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}


export {
  AuthContext,
  AuthProvider,
}