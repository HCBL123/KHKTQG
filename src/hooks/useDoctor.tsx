import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../config/firebase';

export const useDoctor = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [doctorData, setDoctorData] = useState<any>(null);

  useEffect(() => {
    if (!auth.currentUser) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, 'doctors', auth.currentUser.uid),
      (doc) => {
        if (doc.exists()) {
          setDoctorData({ id: doc.id, ...doc.data() });
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching doctor data:', error);
        setError('Failed to fetch doctor data');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { loading, error, doctorData };
};

export default useDoctor; 