import React, { ReactNode, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import Navigation from '../Navigation';
import DoctorNavigation from '../DoctorNavigation';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { currentUser } = useAuth();
  const [userRole, setUserRole] = useState<'doctor' | 'patient' | null>(null);
  const hideNavigation = ['/login', '/register', '/'].includes(location.pathname);

  useEffect(() => {
    const getUserRole = async () => {
      if (currentUser) {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        setUserRole(userDoc.data()?.role);
      }
    };
    getUserRole();
  }, [currentUser]);

    return (
    <>
      {!hideNavigation && (userRole === 'doctor' ? <DoctorNavigation /> : <Navigation />)}
      {children}
    </>
  );
};

export default Layout;
