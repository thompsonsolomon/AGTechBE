import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth'

import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore'

import { auth, db } from '../config/firebase'


export async function registerUser({
  email,
  password,
  fullName,
  phone,
}) {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  )

  const user = userCredential.user

  await updateProfile(user, {
    displayName: fullName,
  })

  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    fullName,
    email: user.email,
    phone: phone || '',
    role: 'customer',
    status: 'active',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  return user
}


export async function loginUser({
  email,
  password,
}) {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  )

  return userCredential.user
}


export async function logoutUser() {
  await signOut(auth)
}


export async function resetUserPassword(email) {
  await sendPasswordResetEmail(auth, email)
}


export async function getUserProfile(uid) {
  const userRef = doc(db, 'users', uid)
  const userSnapshot = await getDoc(userRef)

  if (!userSnapshot.exists()) {
    return null
  }

  return {
    id: userSnapshot.id,
    ...userSnapshot.data(),
  }
}