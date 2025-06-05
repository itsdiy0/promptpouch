import { Provider } from 'urql';
import { AuthProvider,useAuth } from './contexts/AuthContext';
import { AuthGuard } from './components/auth/AuthGaurd';
import client from './lib/client';

// Your main app content
const MainApp = () => {
  const { user, logout } = useAuth();

  return (
    <div className="p-4" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="flex justify-between items-center mb-4">
        <h1>Welcome, {user?.username}!</h1>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
      {/* Your app content here */}
    </div>
  );
};

export const App = () => {
  return (
    <Provider value={client}>
      <AuthProvider>
        <AuthGuard>
          <MainApp />
        </AuthGuard>
      </AuthProvider>
    </Provider>
  );
};