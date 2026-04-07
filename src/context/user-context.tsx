import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { useWorkspace } from '../hooks/use-workspace';

export type UserAccountType = 'Full' | 'Viewer';

export interface StrmUser {
  userId: string;
  displayName: string;
  email: string;
  isAdmin: boolean;
  accountType: UserAccountType;
  title?: string;
  avatarUrl?: string;
  googleCalendarLinked: boolean;
  memberOfTeamIds?: string[];
  theme: 'light' | 'dark';
  primaryColor?: string;
  defaultCalendarView: string;
  easyBooking: boolean;
  timeFormat?: string;
  modifierKey: string;
  createdAt: number;
  approvedBy: string;
  workspaceId: string;
}

export interface AppPage {
  id: string;
  path: string;
  name: string;
  icon: string;
  associatedTabs: string[];
}

export interface AppSettings {
  pages: AppPage[];
}

interface AuthContextType {
  currentUser: StrmUser | null;
  viewAsUser: StrmUser | null;
  setViewAsUserId: (id: string | null) => void;
  loading: boolean;
  appSettings: AppSettings;
  users: StrmUser[]; // Required for the admin 'View As' dropdown list
}

const defaultAppSettings: AppSettings = {
  pages: [
    { id: 'page-overview', path: '/dashboard/overview', name: 'Overview', icon: 'dashboard', associatedTabs: ['overview-tab'] },
    { id: 'page-calendar', path: '/dashboard/calendar', name: 'Calendar', icon: 'calendar_month', associatedTabs: ['calendar-tab'] },
    { id: 'page-tasks', path: '/dashboard/tasks', name: 'Tasks', icon: 'check_circle', associatedTabs: ['tasks-tab'] },
    { id: 'page-admin-management', path: '/dashboard/admin', name: 'Admin', icon: 'shield_person', associatedTabs: [] }
  ]
}

const AuthContext = createContext<AuthContextType>({ 
  currentUser: null, 
  viewAsUser: null, 
  setViewAsUserId: () => {}, 
  loading: true, 
  appSettings: defaultAppSettings,
  users: []
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<StrmUser | null>(null);
  const [viewAsUserId, setViewAsUserId] = useState<string | null>(null);
  const [users, setUsers] = useState<StrmUser[]>([]); // We would fetch all users in a real implementation
  const [loading, setLoading] = useState(true);
  const { workspaceId } = useWorkspace(); 

  useEffect(() => {
    if (!workspaceId) return;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser?.email) {
        const userRef = doc(db, 'users', firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data() as StrmUser;
          if (userData.workspaceId === workspaceId) {
            setCurrentUser(userData);
          } else {
            setCurrentUser(null); 
          }
        } else {
          // --- Method A/B/C Flow Routing ---
          let accountType: UserAccountType = 'Viewer';
          let isAdmin = false;
          let approvedBy = 'pending';

          const allUsersRef = collection(db, 'users');
          const workspaceUsersQuery = query(allUsersRef, where('workspaceId', '==', workspaceId));
          const usersSnapshot = await getDocs(workspaceUsersQuery);

          if (usersSnapshot.empty) {
            accountType = 'Full';
            isAdmin = true;
            approvedBy = 'system';
          } else {
             const approvedEmailsRef = collection(db, 'pre-approved-emails');
             const approvedQuery = query(approvedEmailsRef, where('workspaceId', '==', workspaceId), where('email', '==', firebaseUser.email));
             const approvedSnapshot = await getDocs(approvedQuery);

             if (!approvedSnapshot.empty) {
               accountType = 'Full';
               approvedBy = 'system-invite';
             }
          }

          const newUserProfile: StrmUser = {
            userId: firebaseUser.uid,
            displayName: firebaseUser.displayName || 'Unnamed User',
            email: firebaseUser.email,
            isAdmin,
            accountType,
            avatarUrl: firebaseUser.photoURL || undefined,
            googleCalendarLinked: false,
            theme: 'light',
            defaultCalendarView: 'day',
            easyBooking: true,
            modifierKey: 'shift',
            createdAt: Date.now(),
            approvedBy,
            workspaceId
          };

          await setDoc(userRef, newUserProfile);
          setCurrentUser(newUserProfile);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [workspaceId]);

  // Derived View Context
  const viewAsUser = useMemo(() => {
    if (!viewAsUserId || !currentUser?.isAdmin) return currentUser;
    // Fallback to searching the users array for the targeted persona
    return users.find((u: StrmUser) => u.userId === viewAsUserId) || currentUser;
  }, [currentUser, viewAsUserId, users]);

  // Secure setter that enforces Administrative access
  const handleSetViewAsUser = (id: string | null) => {
    if (currentUser?.isAdmin) {
      if (id === currentUser.userId) {
         setViewAsUserId(null); // Reset back to true self
      } else {
         setViewAsUserId(id);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, viewAsUser, setViewAsUserId: handleSetViewAsUser, loading, appSettings: defaultAppSettings, users }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useUserContext = () => useContext(AuthContext);
