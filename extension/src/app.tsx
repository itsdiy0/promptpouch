import { Provider } from 'urql';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ConversationProvider, useConversation } from './contexts/ConversationContext';
import { AuthGuard } from './components/auth/AuthGaurd';
import { ConversationList } from './components/conversation/ConversationList';
import client from './lib/client';
import { Button } from './components/ui/button';

// Your main app content
const MainApp = () => {
  const { user, logout } = useAuth();
  const { conversations, loading, refreshConversations } = useConversation();

  return (
    <div className="p-4" style={{ width: '100%', maxHeight: '800px', overflowY: 'auto' }}>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Welcome, {user?.username}!</h1>
        <button
          onClick={logout}
          className="bg-destructive text-destructive-foreground px-3 py-1 rounded text-sm hover:bg-destructive/90"
        >
          Logout
        </button>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">ChatGPT Conversations</h2>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={refreshConversations}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Refresh'}
          </Button>
        </div>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">Loading conversations...</p>
          </div>
        ) : (
          <ConversationList conversations={conversations} />
        )}
      </div>
    </div>
  );
};

export const App = () => {
  return (
    <Provider value={client}>
      <AuthProvider>
        <AuthGuard>
          <ConversationProvider>
            <MainApp />
          </ConversationProvider>
        </AuthGuard>
      </AuthProvider>
    </Provider>
  );
};