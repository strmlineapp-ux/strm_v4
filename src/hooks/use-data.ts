import { useState, useEffect, useMemo } from 'react';
import { collection, query, where, onSnapshot, doc, updateDoc, setDoc, deleteDoc, QuerySnapshot, DocumentData } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './use-auth';

// Extremely basic TS schemas targeting V4 
export interface V4Project {
  id: string;
  name: string;
  workspaceId: string;
  icon?: string;
  color?: string;
}

export interface V4Team {
  id: string;
  name: string;
  workspaceId: string;
}

export function useData() {
  const { viewAsUser, isAuthenticated } = useAuth();
  
  const [projects, setProjects] = useState<V4Project[]>([]);
  const [teams, setTeams] = useState<V4Team[]>([]);
  const [loading, setLoading] = useState(true);

  // Derive the active restriction ID based on who the user currently is or is impersonating
  const activeWorkspaceId = viewAsUser?.workspaceId;

  useEffect(() => {
    // SECURITY: Do not open listeners if user has zero credentials, no workspace
    if (!activeWorkspaceId || !isAuthenticated) {
      setProjects([]);
      setTeams([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    // Snapshot Listeners mapped specifically to logical workspace domains
    // These auto-destruct when activeWorkspaceId changes!

    const qProjects = query(collection(db, 'projects'), where("workspaceId", "==", activeWorkspaceId));
    const unsubProjects = onSnapshot(qProjects, (snapshot: QuerySnapshot<DocumentData>) => {
      setProjects(snapshot.docs.map((d: any) => ({ id: d.id, ...d.data() } as V4Project)));
    }, (error: any) => {
      console.warn("Project sync failed:", error); // Handled silently
    });

    const qTeams = query(collection(db, 'teams'), where("workspaceId", "==", activeWorkspaceId));
    const unsubTeams = onSnapshot(qTeams, (snapshot: QuerySnapshot<DocumentData>) => {
      setTeams(snapshot.docs.map((d: any) => ({ id: d.id, ...d.data() } as V4Team)));
      setLoading(false); // Can resolve loading once main sets arrive
    }, (error: any) => {
      console.warn("Teams sync failed:", error);
      setLoading(false);
    });

    return () => {
      unsubProjects();
      unsubTeams();
    };
  }, [activeWorkspaceId, isAuthenticated]);


  // Helper methods utilizing Real-time reactivity (no immediate local overrides needed)
  const updateProjectName = async (projectId: string, newName: string) => {
    if(!isAuthenticated) return;
    try {
      await updateDoc(doc(db, 'projects', projectId), { name: newName });
    } catch(err) {
      console.error("Update failed", err);
    }
  }

  return {
    loading,
    projects,
    teams,
    updateProjectName
  };
}
