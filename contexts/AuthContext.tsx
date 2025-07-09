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
import { addDoc, collection } from 'firebase/firestore';

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  loginWithCredential: (credential: AuthCredential) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  register: async () => {},
  loginWithCredential: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (email: string, password: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await addDoc(collection(db, 'login'), {
      uid: cred.user.uid,
      email: cred.user.email,
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
