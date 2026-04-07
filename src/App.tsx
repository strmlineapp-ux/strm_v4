import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './context/user-context';
import { useAuth } from './hooks/use-auth';
import { Sidebar } from './components/layout/sidebar';
import { DynamicPageRenderer } from './components/layout/dynamic-page-renderer';
import Login from './pages/Login';

// Basic Auth Wrapper
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null; // Let UserProvider or Login handle loading
  if (!isAuthenticated) return <Navigate to="/login" />;
  return <>{children}</>;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} 
      />
      
      {/* Protected Layout Area encapsulating the new sidebar */}
      <Route 
        path="/dashboard/*" 
        element={
          <PrivateRoute>
             <div className="min-h-screen bg-transparent text-foreground flex">
               <Sidebar />
               {/* Placed adjacent to sidebar, allocating space via ml-16 */}
               <main className="flex-1 overflow-auto bg-transparent ml-16">
                  <Routes>
                      {/* Base fallback */}
                      <Route path="" element={<Navigate to="overview" />} />
                      {/* Dynamic mapping wildcard block */}
                      <Route path=":pagePath" element={<DynamicPageRenderer />} />
                  </Routes>
               </main>
             </div>
          </PrivateRoute>
        } 
      />
      
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

function App() {
  return (
    <UserProvider>
      <Router>
        <AppRoutes />
      </Router>
    </UserProvider>
  );
}

export default App;
