// src/services/patientService.ts
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  Timestamp,
  orderBy,
  limit
} from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { PatientData, Exercise, ExerciseHistory } from '../types/patient';

export const getPatientData = async (): Promise<PatientData | null> => {
  try {
    if (!auth.currentUser) return null;

    const patientRef = doc(db, 'patients', auth.currentUser.uid);
    const patientSnap = await getDoc(patientRef);

    if (!patientSnap.exists()) return null;

    return {
      id: patientSnap.id,
      ...patientSnap.data()
    } as PatientData;
  } catch (error) {
    console.error('Error fetching patient data:', error);
    throw error;
  }
};

export const updatePatientData = async (data: Partial<PatientData>): Promise<void> => {
  try {
    if (!auth.currentUser) throw new Error('No authenticated user');

    const patientRef = doc(db, 'patients', auth.currentUser.uid);
    await updateDoc(patientRef, {
      ...data,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating patient data:', error);
    throw error;
  }
};

export const getUpcomingExercises = async (): Promise<Exercise[]> => {
  try {
    if (!auth.currentUser) return [];

    const exercisesRef = collection(db, 'patients', auth.currentUser.uid, 'exercises');
    const q = query(
      exercisesRef,
      where('nextSession', '>=', Timestamp.now()),
      orderBy('nextSession'),
      limit(10)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Exercise[];
  } catch (error) {
    console.error('Error fetching upcoming exercises:', error);
    throw error;
  }
};

export const getExerciseHistory = async (): Promise<ExerciseHistory[]> => {
  try {
    if (!auth.currentUser) return [];

    const historyRef = collection(db, 'patients', auth.currentUser.uid, 'exerciseHistory');
    const q = query(
      historyRef,
      orderBy('date', 'desc'),
      limit(10)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: (doc.data().date as Timestamp).toDate()
    })) as ExerciseHistory[];
  } catch (error) {
    console.error('Error fetching exercise history:', error);
    throw error;
  }
};

// Helper function to initialize patient data after registration
export const initializePatientData = async (uid: string, email: string): Promise<void> => {
  try {
    const patientRef = doc(db, 'patients', uid);
    await setDoc(patientRef, {
      email,
      firstName: '',
      lastName: '',
      memberSince: Timestamp.now(),
      exercisesCompleted: 0,
      weeklyGoal: 10,
      totalMinutes: 0,
      averageScore: 0,
      currentStreak: 0,
      healthScore: 0,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error initializing patient data:', error);
    throw error;
  }
};
