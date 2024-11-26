import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { FirebaseApp, initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  User,
  signOut,
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth";
import { getFirestore, collection, getDocs, getDoc, addDoc, updateDoc, deleteDoc } from "firebase/firestore";
export type { User } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBzn-huX73FWQalz95xfC-UMHUCRwIb65E",
  authDomain: "audioclassroom.firebaseapp.com",
  projectId: "audioclassroom",
  storageBucket: "audioclassroom.appspot.com",
  messagingSenderId: "826309820418",
  appId: "1:826309820418:web:1cda3e0f5ac1d4f900671b",
};

type FirebaseContextType = {
  app: FirebaseApp;
  profile: User | null | undefined;
  name: string;
  signup: (email: string, password: string, displayName: string) => Promise<User>;
  signin: (email: string, password: string) => Promise<User>;
  signout: () => Promise<void>;
  rename: (name: string) => Promise<User | null>;
  reset: (email: string) => Promise<void>;
};

export const FirebaseContext = createContext<FirebaseContextType>({} as any);

export function FirebaseProvider({ children }: any) {
  const app = useMemo(() => initializeApp(firebaseConfig), []);
  const auth = useMemo(() => getAuth(app), []);

  const [profile, setProfile] = useState<User | null | undefined>();
  const [name, setName] = useState<string>("");

  useEffect(() => {
    setName(profile?.displayName ?? "");
  }, [profile]);

  useEffect(() => {
    return onAuthStateChanged(auth, (value) => setProfile(value));
  }, []);

  const signup = useCallback(
    async (email: string, password: string, displayName: string) => {
      let { user } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(user, { displayName });
      return user;
    },
    [auth]
  );

  const signin = useCallback(
    async (email: string, password: string) => {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      return user;
    },
    [auth]
  );

  const signout = useCallback(async () => {
    await signOut(auth);
  }, [auth]);

  const rename = useCallback(
    async (displayName: string) => {
      if (!auth.currentUser) return null;
      await updateProfile(auth.currentUser, { displayName });
      setName(displayName);
      return auth.currentUser;
    },
    [auth]
  );

  const reset = useCallback(
    async (email: string) => {
      await sendPasswordResetEmail(auth, email);
    },
    [auth]
  );
  const value = {
    app,
    profile,
    name,
    signin,
    signup,
    signout,
    rename,
    reset,
  };

  return <FirebaseContext.Provider value={value} children={children} />;
}

export function useFirebase(): FirebaseContextType {
  return useContext(FirebaseContext);
}
