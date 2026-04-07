import { useUserContext } from '../context/user-context';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';

export function useAuth() {
  const { currentUser, viewAsUser, setViewAsUserId, loading, appSettings, users } = useUserContext();

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/calendar.events.readonly');
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Authentication Error:", error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign out Error:", error);
    }
  };

  return {
    currentUser,
    viewAsUser, // Components should rely on this instead of currentUser for displaying context
    setViewAsUserId,
    appSettings,
    users,
    loading,
    loginWithGoogle,
    logout,
    isAuthenticated: !!currentUser && currentUser.accountType === 'Full',
    isPending: !!currentUser && currentUser.accountType === 'Viewer',
    isAdmin: !!currentUser?.isAdmin,
    isImpersonating: currentUser?.userId !== viewAsUser?.userId
  };
}
