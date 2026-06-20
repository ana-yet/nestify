import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import toast from 'react-hot-toast';
import { auth, googleProvider } from '../firebase/firebase.config.js';
import {
  registerUser,
  loginUser,
  googleLoginUser,
  fetchCurrentUser,
} from '../api/auth.api.js';
import { getToken, setToken, removeToken } from '../utils/tokenStorage.js';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const persistSession = useCallback(({ user: userData, token }) => {
    setToken(token);
    setUser(userData);
  }, []);

  const clearSession = useCallback(async () => {
    removeToken();
    setUser(null);
    try {
      await signOut(auth);
    } catch {
      // Firebase may not be signed in
    }
  }, []);

  const bootstrapAuth = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const currentUser = await fetchCurrentUser();
      setUser(currentUser);
    } catch {
      removeToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    bootstrapAuth();
  }, [bootstrapAuth]);

  const register = useCallback(async ({ name, email, password, photo, role }) => {
    const credential = await createUserWithEmailAndPassword(auth, email, password);

    await updateProfile(credential.user, {
      displayName: name,
      photoURL: photo || undefined,
    });

    const idToken = await credential.user.getIdToken();
    const result = await registerUser({ idToken, name, role, photo: photo || '' });
    persistSession(result);
    toast.success('Account created successfully');
    return result.user;
  }, [persistSession]);

  const login = useCallback(async ({ email, password }) => {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await credential.user.getIdToken();
    const result = await loginUser({ idToken });
    persistSession(result);
    toast.success('Welcome back!');
    return result.user;
  }, [persistSession]);

  const loginWithGoogle = useCallback(async () => {
    const credential = await signInWithPopup(auth, googleProvider);
    const idToken = await credential.user.getIdToken();
    const result = await googleLoginUser({ idToken });
    persistSession(result);
    toast.success('Signed in with Google');
    return result.user;
  }, [persistSession]);

  const logout = useCallback(async () => {
    await clearSession();
    toast.success('Logged out');
  }, [clearSession]);

  const refreshUser = useCallback(async (userData) => {
    if (userData) {
      setUser(userData);
      return userData;
    }
    const currentUser = await fetchCurrentUser();
    setUser(currentUser);
    return currentUser;
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      register,
      login,
      loginWithGoogle,
      logout,
      refreshUser,
    }),
    [user, loading, register, login, loginWithGoogle, logout, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
