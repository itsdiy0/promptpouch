// content.ts
interface ExtractedMessage {
    id: string;
    content: string;
    sender: 'user' | 'assistant';
    timestamp: string;
  }
  
  interface ExtractedConversation {
    id: string;
    prompt: string;
    response: string;
    timestamp: string;
    source: string;
  }
  
  class ChatGPTExtractor {
    private observer: MutationObserver | null = null;
    private lastConversationCount = 0;
  
    constructor() {
      this.init();
    }
  
    private init() {
      // Only run on ChatGPT pages
      if (!window.location.hostname.includes('chatgpt.com')) {
        return;
      }
  
      console.log('ChatGPT Content Script initialized');
      
      // Set up message listener
      chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === 'extractChatGPTConversation') {
          const conversations = this.extractConversations();
          sendResponse({ conversations });
        }
      });
  
      // Monitor for new messages
      this.startObserving();
      
      // Initial extraction after a short delay to ensure page is loaded
      setTimeout(() => {
        this.checkForNewConversations();
        this.addIdsToConversationTurns(); // Add this line
      }, 2000);
    }
  
    private startObserving() {
      // Observe changes to detect new messages
      this.observer = new MutationObserver((mutations) => {
        let shouldCheck = false;
        
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                const element = node as Element;
                // Check if new conversation turn was added
                if (element.querySelector?.('[data-testid^="conversation-turn-"]') || 
                    element.matches?.('[data-testid^="conversation-turn-"]')) {
                  shouldCheck = true;
                }
              }
            });
          }
        });
  
        if (shouldCheck) {
          // Debounce the check to avoid excessive calls
          setTimeout(() => {
            this.checkForNewConversations();
          }, 1000);
        }
      });
  
      // Start observing the document
      this.observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    }
  
    private checkForNewConversations() {
      const conversations = this.extractConversations();
      const currentCount = conversations.length;
      
      if (currentCount !== this.lastConversationCount) {
        this.lastConversationCount = currentCount;
        this.addIdsToConversationTurns(); // Add this line
        
        // Send to popup if it's listening
        chrome.runtime.sendMessage({
          action: 'newChatGPTConversation',
          data: conversations
        }).catch(() => {
          // Popup might not be open, that's okay
        });
      }
    }
  
    private extractConversations(): ExtractedConversation[] {
      const conversations: ExtractedConversation[] = [];
      
      try {
        // Find all conversation turn elements
        const conversationTurns = document.querySelectorAll('[data-testid^="conversation-turn-"]');
        
        if (conversationTurns.length === 0) {
          console.log('No conversation turns found');
          return conversations;
        }
  
        console.log(`Found ${conversationTurns.length} conversation turns`);
  
        // Group messages into conversation pairs (user prompt + AI response)
        const messages = this.extractMessages(conversationTurns);
        const conversationPairs = this.groupMessagesIntoPairs(messages);
  
        conversationPairs.forEach((pair, index) => {
          if (pair.userMessage && pair.assistantMessage) {
            conversations.push({
              id: `chatgpt-${Date.now()}-${index}`,
              prompt: pair.userMessage.content,
              response: pair.assistantMessage.content,
              timestamp: pair.userMessage.timestamp,
              source: 'ChatGPT'
            });
          }
        });
  
        console.log(`Extracted ${conversations.length} conversation pairs`);
        
      } catch (error) {
        console.error('Error extracting ChatGPT conversations:', error);
      }
  
      return conversations;
    }
  
    private extractMessages(conversationTurns: NodeListOf<Element>): ExtractedMessage[] {
      const messages: ExtractedMessage[] = [];
  
      conversationTurns.forEach((turn) => {
        try {
          const testId = turn.getAttribute('data-testid');
          if (!testId) return;
  
          const turnNumber = parseInt(testId.replace('conversation-turn-', ''));
          const isUser = turnNumber % 2 === 1; // Odd numbers are user messages
          
          // Extract text content from the turn
          const content = this.extractTextFromTurn(turn);
          
          if (content.trim()) {
            messages.push({
              id: testId,
              content: content.trim(),
              sender: isUser ? 'user' : 'assistant',
              timestamp: new Date().toISOString() // ChatGPT doesn't expose timestamps easily
            });
          }
        } catch (error) {
          console.error('Error extracting message from turn:', error);
        }
      });
  
      return messages;
    }
  
    private extractTextFromTurn(turn: Element): string {
      // Try different selectors that ChatGPT might use for message content
      const possibleSelectors = [
        '[data-message-author-role] .markdown',
        '[data-message-author-role] p',
        '.markdown p',
        '.prose p',
        'p',
        '.whitespace-pre-wrap'
      ];
  
      for (const selector of possibleSelectors) {
        const elements = turn.querySelectorAll(selector);
        if (elements.length > 0) {
          const text = Array.from(elements)
            .map(el => el.textContent?.trim())
            .filter(text => text && text.length > 0)
            .join('\n\n');
          
          if (text) {
            return text;
          }
        }
      }
  
      // Fallback: get all text content but clean it up
      const allText = turn.textContent || '';
      return this.cleanExtractedText(allText);
    }
  
    private cleanExtractedText(text: string): string {
      return text
        .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
        .replace(/^\d+\s*\/\s*\d+\s*/, '') // Remove message counters like "1 / 2"
        .replace(/^Copy code\s*/, '') // Remove "Copy code" buttons
        .replace(/\s*Copy\s*$/, '') // Remove trailing "Copy" text
        .trim();
    }
  
    private groupMessagesIntoPairs(messages: ExtractedMessage[]): Array<{
      userMessage?: ExtractedMessage;
      assistantMessage?: ExtractedMessage;
    }> {
      const pairs: Array<{
        userMessage?: ExtractedMessage;
        assistantMessage?: ExtractedMessage;
      }> = [];
  
      let currentPair: {
        userMessage?: ExtractedMessage;
        assistantMessage?: ExtractedMessage;
      } = {};
  
      messages.forEach((message) => {
        if (message.sender === 'user') {
          // Start a new pair if we have a complete previous pair
          if (currentPair.userMessage && currentPair.assistantMessage) {
            pairs.push(currentPair);
            currentPair = {};
          }
          currentPair.userMessage = message;
        } else if (message.sender === 'assistant') {
          currentPair.assistantMessage = message;
        }
      });
  
      // Add the last pair if it has at least a user message
      if (currentPair.userMessage) {
        pairs.push(currentPair);
      }
  
      return pairs;
    }
  
    private addIdsToConversationTurns() {
      const conversationTurns = document.querySelectorAll('[data-testid^="conversation-turn-"]');
      
      conversationTurns.forEach((turn) => {
        const testId = turn.getAttribute('data-testid');
        if (!testId) return;
        
        const turnNumber = testId.replace('conversation-turn-', '');
        const idToAdd = `p${turnNumber}`;
        
        // Only add if not already present
        if (!turn.id) {
          turn.id = idToAdd;
        }
      });
      
      console.log('Added IDs to conversation turns');
    }
  
    public destroy() {
      if (this.observer) {
        this.observer.disconnect();
        this.observer = null;
      }
    }
  }
  
  // Initialize the extractor
  let extractor: ChatGPTExtractor | null = null;
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      extractor = new ChatGPTExtractor();
    });
  } else {
    extractor = new ChatGPTExtractor();
  }
  
  // Clean up on page unload
  window.addEventListener('beforeunload', () => {
    if (extractor) {
      extractor.destroy();
    }
  });