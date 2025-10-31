// hooks/useAuth.js
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, firestore } from '../config/firebase.js';

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is logged in, now check their role in Firestore
        let userProfile = null;
        let userRole = null;

        // Check if they are in the 'admins' collection
        const adminDocRef = doc(firestore, 'admins', user.uid);
        const adminDocSnap = await getDoc(adminDocRef);

        if (adminDocSnap.exists()) {
          userProfile = adminDocSnap.data();
          userRole = 'Admin';
        } else {
          // If not an admin, check if they are in the 'teachers' collection
          const teacherDocRef = doc(firestore, 'teachers', user.uid);
          const teacherDocSnap = await getDoc(teacherDocRef);

          if (teacherDocSnap.exists()) {
            userProfile = teacherDocSnap.data();
            userRole = 'Teacher';
          }
        }

        // Set the user object with auth info AND their role
        setUser({
          ...user, // uid, email, etc. from auth
          ...userProfile, // username, etc. from firestore
          role: userRole, // 'Admin', 'Teacher', or null
        });
      } else {
        // No user is logged in
        setUser(null);
      }
      // Set loading to false after the check is complete
      setIsAuthLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsub();
  }, []);

  // Return the user (with role info) AND the loading state
  return { user, isAuthLoading };
}