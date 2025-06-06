import { createContext } from 'preact';
import { useContext, useState, useEffect } from 'preact/hooks';
import type { Conversation } from '../types/conversation';
import { useAuth } from './AuthContext';

interface ConversationContextType {
  conversations: Conversation[];
  loading: boolean;
  error: string | null;
  refreshConversations: () => void;
}

const ConversationContext = createContext<ConversationContextType | undefined>(undefined);

export const useConversation = () => {
  const context = useContext(ConversationContext);
  if (context === undefined) {
    throw new Error('useConversation must be used within ConversationProvider');
  }
  return context;
};

interface ConversationProviderProps {
  children: preact.ComponentChildren;
}

export const ConversationProvider = ({ children }: ConversationProviderProps) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const refreshConversations = () => {
    if (!user) {
      setConversations([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Check if we're on ChatGPT page and ask content script for conversations
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      if (currentTab && currentTab.url?.includes('chatgpt.com')) {
        chrome.tabs.sendMessage(
          currentTab.id!,
          { action: 'extractChatGPTConversation' },
          (response) => {
            if (chrome.runtime.lastError) {
              console.error(chrome.runtime.lastError);
              setLoading(false);
              return;
            }
            
            if (response && response.conversations) {
              setConversations(response.conversations);
            }
            setLoading(false);
          }
        );
      } else {
        // Not on ChatGPT page
        setConversations([]);
        setLoading(false);
      }
    });
  };

  // Set up message listener
  useEffect(() => {
    const messageListener = (message: any) => {
      if (message.action === 'newChatGPTConversation') {
        setConversations(message.data);
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);
    
    // Initial fetch
    refreshConversations();

    // Cleanup
    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);  // Empty dependency array, only run on mount

  const value = {
    conversations,
    loading,
    error,
    refreshConversations,
  };

  return (
    <ConversationContext.Provider value={value}>
      {children}
    </ConversationContext.Provider>
  );
};