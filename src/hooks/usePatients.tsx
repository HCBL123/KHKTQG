// src/hooks/usePatient.ts
import { useState, useEffect } from 'react';
import {
  onSnapshot,
  doc,
  collection,
  query,
  where,
  orderBy,
  limit,
  Timestamp
} from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { PatientData, Exercise, ExerciseHistory } from '../types/patient';

interface UsePatientReturn {
  loading: boolean;
  error: string | null;
  patientData: PatientData | null;
  upcomingExercises: Exercise[];
  exerciseHistory: ExerciseHistory[];
  refreshData: () => void;
}

export const usePatient = (): UsePatientReturn => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [upcomingExercises, setUpcomingExercises] = useState<Exercise[]>([]);
  const [exerciseHistory, setExerciseHistory] = useState<ExerciseHistory[]>([]);

  useEffect(() => {
    if (!auth.currentUser) {
      setLoading(false);
      return;
    }

    // Subscribe to patient data
    const patientUnsubscribe = onSnapshot(
      doc(db, 'patients', auth.currentUser.uid),
      (doc) => {
        if (doc.exists()) {
          setPatientData({
            id: doc.id,
            ...doc.data()
          } as PatientData);
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
    const exercisesUnsubscribe = onSnapshot(
      query(
        collection(db, 'patients', auth.currentUser.uid, 'exercises'),
        where('nextSession', '>=', Timestamp.now()),
        orderBy('nextSession'),
        limit(10)
      ),
      (snapshot) => {
        const exercises = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Exercise[];
        setUpcomingExercises(exercises);
      },
      (error) => {
        console.error('Error fetching exercises:', error);
      }
    );

    // Subscribe to exercise history
    const historyUnsubscribe = onSnapshot(
      query(
        collection(db, 'patients', auth.currentUser.uid, 'exerciseHistory'),
        orderBy('date', 'desc'),
        limit(10)
      ),
      (snapshot) => {
        const history = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: (doc.data().date as Timestamp).toDate()
        })) as ExerciseHistory[];
        setExerciseHistory(history);
      },
      (error) => {
        console.error('Error fetching exercise history:', error);
      }
    );

    // Cleanup subscriptions
    return () => {
      patientUnsubscribe();
      exercisesUnsubscribe();
      historyUnsubscribe();
    };
  }, []);

  const refreshData = () => {
    setLoading(true);
    // The onSnapshot listeners will automatically refresh the data
  };

  return {
    loading,
    error,
    patientData,
    upcomingExercises,
    exerciseHistory,
    refreshData
  };
};

export default usePatient;
