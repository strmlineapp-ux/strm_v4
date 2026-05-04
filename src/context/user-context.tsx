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
  theme: 'light' | 'dark' | 'system';
  primaryColor?: string;
  fontWeight?: number;
  iconGrade?: number;
  iconOpticalSize?: number;
  iconFill?: number;
  defaultCalendarView?: 'day' | 'week' | 'month' | 'agenda';
  easyBooking?: boolean;
  modifierKey?: string;
  timeFormat?: '12h' | '24h';
  highContrast?: boolean;
  radius?: number;
  createdAt: number;
  approvedBy: string;
  workspaceId: string;
}

export interface PreApprovedEmail {
  id?: string;
  email: string;
  invitedBy: string;
  workspaceId: string;
  createdAt: number;
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
  updatePreference: (key: string, value: any) => Promise<void>;
  loading: boolean;
  appSettings: AppSettings;
  users: StrmUser[]; // Required for the admin 'View As' dropdown list
  preApprovedEmails: PreApprovedEmail[];
  updateUser: (userId: string, data: Partial<StrmUser>) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  addPreApprovedEmail: (email: string) => Promise<void>;
  removePreApprovedEmail: (email: string) => Promise<void>;
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
  updatePreference: async () => {},
  loading: true, 
  appSettings: defaultAppSettings,
  users: [],
  preApprovedEmails: [],
  updateUser: async () => {},
  deleteUser: async () => {},
  addPreApprovedEmail: async () => {},
  removePreApprovedEmail: async () => {}
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<StrmUser | null>(null);
  const [viewAsUserId, setViewAsUserId] = useState<string | null>(null);
  const [users, setUsers] = useState<StrmUser[]>([]); // We would fetch all users in a real implementation
  const [preApprovedEmails, setPreApprovedEmails] = useState<PreApprovedEmail[]>([]);
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
            theme: 'system',
            fontWeight: 300,
            iconGrade: 0,
            iconOpticalSize: 20,
            iconFill: 0,
            defaultCalendarView: 'day',
            easyBooking: true,
            modifierKey: 'meta',
            timeFormat: '12h',
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

  // Fetch all users in workspace when currentUser changes
  useEffect(() => {
    if (!currentUser || !workspaceId) return;
    
    const fetchWorkspaceData = async () => {
      const usersQ = query(collection(db, 'users'), where('workspaceId', '==', workspaceId));
      const usersSnap = await getDocs(usersQ);
      setUsers(usersSnap.docs.map(doc => doc.data() as StrmUser));

      if (currentUser.isAdmin) {
        const emailsQ = query(collection(db, 'pre-approved-emails'), where('workspaceId', '==', workspaceId));
        const emailsSnap = await getDocs(emailsQ);
        setPreApprovedEmails(emailsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as PreApprovedEmail)));
      }
    };
    
    fetchWorkspaceData();
  }, [currentUser, workspaceId]);

  // Secure Preference Updater hitting backend
  const updatePreference = async (key: string, value: any) => {
     if (!currentUser) return;
     // Optimistically update local state so UI is instant
     setCurrentUser(prev => prev ? { ...prev, [key]: value } as StrmUser : null);

     try {
       await setDoc(doc(db, 'users', currentUser.userId), { [key]: value }, { merge: true });
     } catch (err) {
       console.error("Failed to update preference:", err);
     }
  };

  // Admin updateUser capability
  const updateUser = async (userId: string, data: Partial<StrmUser>) => {
    if (!currentUser?.isAdmin) return;
    
    // Optimistic update
    setUsers(prev => prev.map(u => u.userId === userId ? { ...u, ...data } as StrmUser : u));
    
    try {
      await setDoc(doc(db, 'users', userId), data, { merge: true });
    } catch (err) {
      console.error("Failed to update user:", err);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!currentUser?.isAdmin) return;
    
    // Optimistic update
    setUsers(prev => prev.filter(u => u.userId !== userId));
    
    try {
      // Note: we can't delete their auth token directly from the client without admin SDK,
      // but deleting the user doc will log them out next session check
      await setDoc(doc(db, 'users', userId), { accountType: 'Rejected' }, { merge: true }); // We soft delete or just delete the doc.
      // Let's actually delete the doc:
      const { deleteDoc } = await import('firebase/firestore');
      await deleteDoc(doc(db, 'users', userId));
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };

  const addPreApprovedEmail = async (email: string) => {
    if (!currentUser?.isAdmin || !workspaceId) return;
    try {
      const newEmail: PreApprovedEmail = {
        email,
        invitedBy: currentUser.userId,
        workspaceId,
        createdAt: Date.now()
      };
      // For simplicity, we use the email itself as the doc ID to enforce uniqueness
      await setDoc(doc(db, 'pre-approved-emails', email), newEmail);
      setPreApprovedEmails(prev => [...prev, { id: email, ...newEmail }]);
    } catch (err) {
      console.error("Failed to add pre-approved email:", err);
    }
  };

  const removePreApprovedEmail = async (email: string) => {
    if (!currentUser?.isAdmin) return;
    try {
      const targetDoc = preApprovedEmails.find(e => e.email === email);
      if (targetDoc?.id) {
         await setDoc(doc(db, 'pre-approved-emails', targetDoc.id), { deleted: true }, { merge: true }); // Soft delete or actual delete
         setPreApprovedEmails(prev => prev.filter(e => e.email !== email));
      }
    } catch (err) {
      console.error("Failed to remove pre-approved email:", err);
    }
  };

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

  // Bind settings to HTML/CSS custom properties
  useEffect(() => {
    const targetUser = viewAsUser || currentUser;
    if (!targetUser) return;
    
    const applyTheme = () => {
      const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const isDark = targetUser.theme === 'dark' || (targetUser.theme === 'system' && isSystemDark);
      document.documentElement.classList.toggle('dark', isDark);
    };

    applyTheme();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => { if (targetUser.theme === 'system') applyTheme(); };
    mediaQuery.addEventListener('change', handleChange);
    
    if (targetUser.primaryColor) {
      // Tailwind needs raw H S L values (e.g. "210 70% 50%") instead of "hsl(210, 70%, 50%)"
      const match = targetUser.primaryColor.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
      if (match) {
         document.documentElement.style.setProperty('--primary', `${match[1]} ${match[2]}% ${match[3]}%`);
      } else {
         document.documentElement.style.setProperty('--primary', targetUser.primaryColor);
      }
    } else {
      document.documentElement.style.removeProperty('--primary');
    }
    
    const w = targetUser.fontWeight ?? 100;
    const g = targetUser.iconGrade ?? 0;
    const opsz = targetUser.iconOpticalSize ?? 24;
    const fill = targetUser.iconFill ?? 0;
    document.documentElement.style.setProperty('--global-icon-weight', String(w));
    document.documentElement.style.setProperty('--global-icon-grade', String(g));
    document.documentElement.style.setProperty('--global-icon-optical-size', String(opsz));
    document.documentElement.style.setProperty('--global-icon-fill', String(fill));

    if (w >= 500) {
      document.body.classList.add('bold-emphasis');
    } else {
      document.body.classList.remove('bold-emphasis');
    }

    const radius = targetUser.radius ?? 0.5;
    document.documentElement.style.setProperty('--radius', `${radius}rem`);

    if (targetUser.highContrast) {
      document.documentElement.classList.add('high-contrast');
      document.body.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
      document.body.classList.remove('high-contrast');
    }

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [currentUser, viewAsUser]);

  return (
    <AuthContext.Provider value={{ currentUser, viewAsUser, setViewAsUserId: handleSetViewAsUser, updatePreference, updateUser, deleteUser, addPreApprovedEmail, removePreApprovedEmail, loading, appSettings: defaultAppSettings, users, preApprovedEmails }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useUserContext = () => useContext(AuthContext);
