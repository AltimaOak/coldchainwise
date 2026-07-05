import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  onAuthStateChanged
} from 'firebase/auth';
import { ref, set, get } from 'firebase/database';
import { auth, database, isFirebaseConfigured } from './firebase';
import type { UserProfile, UserRole } from '../types/user';

// Mock storage keys
const MOCK_USERS_KEY = 'coldchain_mock_users';
const MOCK_SESSION_KEY = 'coldchain_mock_session';

// Helper to get mock users from localStorage
const getMockUsers = (): Record<string, UserProfile & { passwordHash: string }> => {
  const data = localStorage.getItem(MOCK_USERS_KEY);
  return data ? JSON.parse(data) : {};
};

// Helper to save mock users
const saveMockUsers = (users: Record<string, UserProfile & { passwordHash: string }>) => {
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
};

export const signUpUser = async (
  email: string,
  password: string,
  name: string,
  company: string,
  phone: string,
  role: UserRole
): Promise<UserProfile> => {
  if (isFirebaseConfigured && auth && database) {
    // Live Firebase implementation
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    const profile: UserProfile = {
      uid: user.uid,
      name,
      company,
      email,
      phone,
      role,
      createdAt: Date.now(),
    };
    
    // Save to Realtime Database
    try {
      await set(ref(database, `users/${user.uid}`), profile);
    } catch (dbError) {
      console.warn("Realtime Database write failed during signup (possibly permission denied). Saving user to local storage fallback cache.", dbError);
      const users = getMockUsers();
      users[user.uid] = { ...profile, passwordHash: password };
      saveMockUsers(users);
      // Store in session storage / local storage as if logged in
      localStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(profile));
    }
    return profile;
  } else {
    // Simulation mode implementation
    await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate network latency
    const users = getMockUsers();
    
    // Check if email already exists
    const emailExists = Object.values(users).some(u => u.email.toLowerCase() === email.toLowerCase());
    if (emailExists) {
      throw new Error('auth/email-already-in-use');
    }
    
    const uid = 'mock-uid-' + Math.random().toString(36).substr(2, 9);
    const profile: UserProfile = {
      uid,
      name,
      company,
      email,
      phone,
      role,
      createdAt: Date.now(),
    };
    
    // Store user along with a simulated hashed password (plain text for mock)
    users[uid] = {
      ...profile,
      passwordHash: password
    };
    saveMockUsers(users);
    
    // Save active session
    localStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(profile));
    
    return profile;
  }
};

export const logInUser = async (email: string, password: string): Promise<UserProfile> => {
  if (isFirebaseConfigured && auth && database) {
    // Live Firebase implementation
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Fetch profile from Realtime Database
    try {
      const snapshot = await get(ref(database, `users/${user.uid}`));
      if (snapshot.exists()) {
        return snapshot.val() as UserProfile;
      } else {
        // Check local cache
        const users = getMockUsers();
        if (users[user.uid]) {
          const { passwordHash, ...profile } = users[user.uid];
          return profile;
        }
        throw new Error('User profile does not exist in Realtime Database.');
      }
    } catch (dbError) {
      console.warn("Realtime Database read failed during login. Fetching from local storage fallback cache.", dbError);
      const users = getMockUsers();
      if (users[user.uid]) {
        const { passwordHash, ...profile } = users[user.uid];
        // Save active session locally
        localStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(profile));
        return profile;
      }
      throw dbError; // Rethrow if no local fallback exists
    }
  } else {
    // Simulation mode implementation
    await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate latency
    const users = getMockUsers();
    
    const userMatch = Object.values(users).find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.passwordHash === password
    );
    
    if (!userMatch) {
      throw new Error('auth/wrong-password-or-email');
    }
    
    // Extract profile without password hash
    const { passwordHash, ...profile } = userMatch;
    
    // Save active session
    localStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(profile));
    
    return profile;
  }
};

export const logOutUser = async (): Promise<void> => {
  if (isFirebaseConfigured && auth) {
    await signOut(auth);
  } else {
    await new Promise((resolve) => setTimeout(resolve, 300));
    localStorage.removeItem(MOCK_SESSION_KEY);
  }
};

export const sendPasswordReset = async (email: string): Promise<void> => {
  if (isFirebaseConfigured && auth) {
    await sendPasswordResetEmail(auth, email);
  } else {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const users = getMockUsers();
    const emailExists = Object.values(users).some(u => u.email.toLowerCase() === email.toLowerCase());
    if (!emailExists) {
      throw new Error('auth/user-not-found');
    }
  }
};

// Monitor active login state
export const subscribeToAuthChanges = (
  onChanged: (user: UserProfile | null) => void
): (() => void) => {
  if (isFirebaseConfigured && auth && database) {
    // Live Firebase subscription
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const snapshot = await get(ref(database, `users/${firebaseUser.uid}`));
          if (snapshot.exists()) {
            onChanged(snapshot.val() as UserProfile);
          } else {
            // Check local fallback
            const users = getMockUsers();
            if (users[firebaseUser.uid]) {
              const { passwordHash, ...profile } = users[firebaseUser.uid];
              onChanged(profile);
            } else {
              onChanged(null);
            }
          }
        } catch (err) {
          console.warn("Error retrieving user profile on auth state change (possibly database rules locked). Fetching from local storage fallback cache.", err);
          const users = getMockUsers();
          if (users[firebaseUser.uid]) {
            const { passwordHash, ...profile } = users[firebaseUser.uid];
            onChanged(profile);
          } else {
            onChanged(null);
          }
        }
      } else {
        onChanged(null);
      }
    });
  } else {
    // Simulation state subscription
    const checkSession = () => {
      const data = localStorage.getItem(MOCK_SESSION_KEY);
      if (data) {
        onChanged(JSON.parse(data) as UserProfile);
      } else {
        onChanged(null);
      }
    };
    
    // Run immediately
    checkSession();
    
    // Listen for storage events (e.g. across tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === MOCK_SESSION_KEY) {
        checkSession();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    
    // Return unsubscribe function
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }
};
