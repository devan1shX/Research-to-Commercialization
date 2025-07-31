import React, { createContext, useState, useEffect, useContext } from 'react';
// --- CHANGE: Add getRedirectResult ---
import { onAuthStateChanged, signOut as firebaseSignOut, getRedirectResult } from 'firebase/auth';
import { auth } from './firebaseConfig'; 

const AuthContext = createContext(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true); 

  useEffect(() => {
    // --- CHANGE: Add logic to handle the redirect result ---
    const handleAuthRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);
        // If 'result' exists, it means we just came back from the Google Sign-In page
        if (result) {
          const user = result.user;
          const idToken = await user.getIdToken();

          // Sync the new user with your backend
          await fetch("/api/auth/google-signin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken: idToken }),
          });
        }
      } catch (error) {
        console.error("Error handling Google redirect result:", error);
      }
    };
    
    // Call the function to check for a redirect result
    handleAuthRedirect();

    // This listener will then run and set the user correctly
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoadingAuth(false);
    });

    return unsubscribe; 
  }, []);

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const value = {
    currentUser,
    loadingAuth,
    logout,
  };

  return <AuthContext.Provider value={value}>{!loadingAuth && children}</AuthContext.Provider>;
};
