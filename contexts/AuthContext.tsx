import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebaseConfig';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithCredential,
  signOut,
  AuthCredential,
} from 'firebase/auth';
import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore';

type AuthContextType = {
  user: User | null;
  login: (identifier: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  loginWithCredential: (credential: AuthCredential) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async (_i: string, _p: string) => {},
  register: async (_e: string, _p: string, _u: string) => {},
  loginWithCredential: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return unsubscribe;
  }, []);

  const login = async (identifier: string, password: string) => {
    let email = identifier;
    if (!identifier.includes('@')) {
      const q = query(collection(db, 'login'), where('username', '==', identifier));
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        throw new Error('Usuario no encontrado');
      }
      email = snapshot.docs[0].data().email;
    }
    await signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (email: string, password: string, username: string) => {
    const q = query(collection(db, 'login'), where('username', '==', username));
    const existing = await getDocs(q);
    if (!existing.empty) {
      throw new Error('El nombre de usuario ya existe');
    }
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await addDoc(collection(db, 'login'), {
      uid: cred.user.uid,
      email: cred.user.email,
      username,
    });
  };

  const loginWithCredential = async (credential: AuthCredential) => {
    const result = await signInWithCredential(auth, credential);
    await addDoc(collection(db, 'login'), {
      uid: result.user.uid,
      email: result.user.email,
    });
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, loginWithCredential, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
