import { ConversationItem } from './ConversationItem';
import type { ConversationListProps } from '../../types/conversation';

export const ConversationList = ({ conversations }: ConversationListProps) => {
  console.log("Rendering ConversationList with:", conversations);
  
  if (!conversations || conversations.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No conversations found</p>
        <p className="text-xs text-muted-foreground mt-2">
          Make sure you're on a ChatGPT page with active conversations
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {conversations.map((conversation, index) => (
        <ConversationItem key={conversation.id || index} conversation={conversation} />
      ))}
    </div>
  );
};