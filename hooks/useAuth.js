import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase.js';

export default function useAuth() {
  const [user, setUser] = useState(null);
  // Loading state to track if Firebase is checking auth
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      console.log('got user: ', user);
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      // Set loading to false after the check is complete
      setIsAuthLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsub();
  }, []);

  // Return the user AND the loading state
  return { user, isAuthLoading };
}
