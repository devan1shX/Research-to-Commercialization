import React, { createContext, useState, useEffect, useContext } from 'react';
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
    const handleAuthRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          console.log("Caught redirect result, syncing with backend...");
          const user = result.user;
          const idToken = await user.getIdToken();

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
    
    handleAuthRedirect();

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

  // Render children only when authentication check is complete
  return <AuthContext.Provider value={value}>{!loadingAuth && children}</AuthContext.Provider>;
};
