import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { UserProfile, UserRole } from '../types/user';
import { 
  signUpUser, 
  logInUser, 
  logOutUser, 
  sendPasswordReset, 
  subscribeToAuthChanges 
} from '../firebase/auth';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  signUp: (email: string, password: string, name: string, company: string, phone: string, role: UserRole) => Promise<void>;
  logIn: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  logOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Subscribe to auth changes on mount
  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (
    email: string,
    password: string,
    name: string,
    company: string,
    phone: string,
    role: UserRole
  ) => {
    setLoading(true);
    setError(null);
    try {
      const profile = await signUpUser(email, password, name, company, phone, role);
      setUser(profile);
    } catch (err: any) {
      console.error("Signup error in context:", err);
      let errMsg = "Failed to create an account. Please try again.";
      if (err.code === 'auth/email-already-in-use' || err.message === 'auth/email-already-in-use') {
        errMsg = "This email is already in use by another account.";
      } else if (err.code === 'auth/weak-password') {
        errMsg = "Password is too weak. Please use at least 6 characters.";
      } else if (err.code === 'auth/invalid-email') {
        errMsg = "Please enter a valid email address.";
      }
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const logIn = async (email: string, password: string, rememberMe: boolean) => {
    setLoading(true);
    setError(null);
    try {
      const profile = await logInUser(email, password);
      
      // Handle session persistence in simulation mode
      if (!import.meta.env.VITE_FIREBASE_API_KEY) {
        if (rememberMe) {
          localStorage.setItem('coldchain_mock_session', JSON.stringify(profile));
        } else {
          sessionStorage.setItem('coldchain_mock_session', JSON.stringify(profile));
          // Remove from local storage to prevent persistence across browser sessions
          localStorage.removeItem('coldchain_mock_session');
        }
      }
      
      setUser(profile);
    } catch (err: any) {
      console.error("Login error in context:", err);
      let errMsg = "Incorrect email or password.";
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.message === 'auth/wrong-password-or-email') {
        errMsg = "Invalid email or password combination.";
      } else if (err.code === 'auth/invalid-email') {
        errMsg = "Please enter a valid email address.";
      } else if (err.code === 'auth/too-many-requests') {
        errMsg = "Too many failed login attempts. Please try again later.";
      }
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const logOut = async () => {
    setLoading(true);
    setError(null);
    try {
      await logOutUser();
      sessionStorage.removeItem('coldchain_mock_session');
      setUser(null);
    } catch (err: any) {
      console.error("Logout error in context:", err);
      setError("Failed to log out cleanly.");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setError(null);
    try {
      await sendPasswordReset(email);
    } catch (err: any) {
      console.error("Password reset error in context:", err);
      let errMsg = "Failed to send password reset email.";
      if (err.code === 'auth/user-not-found' || err.message === 'auth/user-not-found') {
        errMsg = "No account found with this email address.";
      } else if (err.code === 'auth/invalid-email') {
        errMsg = "Please enter a valid email address.";
      }
      setError(errMsg);
      throw new Error(errMsg);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      signUp,
      logIn,
      logOut,
      resetPassword,
      clearError
    }}>
      {children}
    </AuthContext.Provider>
  );
};
