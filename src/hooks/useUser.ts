import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';

export const useUser = () => {
  const [userRole, setUserRole] = useState<'patient' | 'doctor' | null>(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const checkUserRole = async () => {
      if (!currentUser) return;

      // Check patient collection
      const patientDoc = await getDoc(doc(db, 'patients', currentUser.uid));
      if (patientDoc.exists()) {
        setUserRole('patient');
        return;
      }

      // Check doctor collection
      const doctorDoc = await getDoc(doc(db, 'doctors', currentUser.uid));
      if (doctorDoc.exists()) {
        setUserRole('doctor');
        return;
      }
    };

    checkUserRole();
  }, [currentUser]);

  return { userRole };
}; 