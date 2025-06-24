import type { Conversation } from '../../types/conversation';
import { Button } from '../ui/button';
import { Save, Share2 } from 'lucide-react';

interface ConversationItemProps {
  conversation: Conversation;
}

export const ConversationItem = ({ conversation }: ConversationItemProps) => {
  // Function to truncate text with ellipsis
  const truncateText = (text: string, limit: number = 100) => {
    if (text.length <= limit) return text;
    return text.slice(0, limit) + '...';
  };
  
  // Function to navigate to the conversation in the main page
  const navigateToConversation = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'navigateToConversation',
          conversationId: conversation.id
        });
      }
    });
  };
  
  return (
    <div className="group rounded-lg p-2 mb-3 bg-card hover:bg-brand-600 transition-colors">
      <div className="flex justify-between items-start gap-3">
        <div 
          onClick={navigateToConversation}
          className="flex-1 cursor-pointer hover:text-primary transition-colors" 
          title="Click to navigate to this conversation"
        >
          <p className="text-sm leading-relaxed">{truncateText(conversation.prompt)}</p>
        </div>
        
        <div className="flex space-x-2 shrink-0">
          <Button size="icon" variant="ghost" className="size-8 text-muted-foreground hover:text-primary" title="Save prompt">
            <Save className="size-4" />
          </Button>
          <Button size="icon" variant="ghost" className="size-8 text-muted-foreground hover:text-primary" title="Share prompt">
            <Share2 className="size-4" />
          </Button>
        </div>
      </div>
      
      <div className="absolute top-0 left-0 w-1 h-full bg-primary/70 rounded-l-lg"></div>
    </div>
  );
};