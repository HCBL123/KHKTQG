// src/hooks/usePatient.ts
import { useState, useEffect } from 'react';
import { doc, collection, query, onSnapshot, where, orderBy, limit, Timestamp } from 'firebase/firestore';
import { db, auth } from '../config/firebase';

export const usePatient = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [patientData, setPatientData] = useState<any>(null);
  const [exerciseHistory, setExerciseHistory] = useState<any[]>([]);
  const [upcomingExercises, setUpcomingExercises] = useState<any[]>([]);

  useEffect(() => {
    if (!auth.currentUser) {
      setLoading(false);
      return;
    }

    const patientId = auth.currentUser.uid;

    // Subscribe to patient data
    const unsubscribePatient = onSnapshot(
      doc(db, 'patients', patientId),
      (doc) => {
        if (doc.exists()) {
          setPatientData({ id: doc.id, ...doc.data() });
        } else {
          setError('Patient data not found');
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching patient data:', error);
        setError('Failed to fetch patient data');
        setLoading(false);
      }
    );

    // Subscribe to upcoming exercises
    const unsubscribeExercises = onSnapshot(
      query(
        collection(db, 'patients', patientId, 'exercises'),
        where('nextSession', '>=', Timestamp.now()),
        orderBy('nextSession'),
        limit(10)
      ),
      (snapshot) => {
        const exercises = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          nextSession: doc.data().nextSession?.toDate() || new Date(),
          createdAt: doc.data().createdAt?.toDate() || new Date()
        }));
        setUpcomingExercises(exercises);
      },
      (error) => {
        console.error('Error fetching exercises:', error);
      }
    );

    // Subscribe to exercise history
    const unsubscribeHistory = onSnapshot(
      collection(db, 'patients', patientId, 'exerciseHistory'),
      (snapshot) => {
        const history = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date?.toDate() || new Date(),
          completedAt: doc.data().completedAt?.toDate() || new Date()
        }));
        setExerciseHistory(history);
      },
      (error) => {
        console.error('Error fetching exercise history:', error);
      }
    );

    return () => {
      unsubscribePatient();
      unsubscribeExercises();
      unsubscribeHistory();
    };
  }, []);

  return { loading, error, patientData, exerciseHistory, upcomingExercises };
};

export default usePatient;
