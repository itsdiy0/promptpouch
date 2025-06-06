export interface Conversation {
    id?: string;
    prompt: string;
    response: string;
    timestamp: string;
    source: 'chatgpt' | 'claude' | 'grok';
    userId?: number;
  }
  
  export interface ConversationListProps {
    conversations: Conversation[];
  }