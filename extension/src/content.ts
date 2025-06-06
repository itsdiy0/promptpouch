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
      // Add a timeout to ensure IDs are added even if other methods fail
      setTimeout(() => this.addIdsToConversationTurns(), 3000);
    }
  
    private init() {
      console.log('ChatGPT Content Script initialized');
      try {
        // Set up message listener
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
          console.log('Content script received message:', message);
          if (message.action === 'extractChatGPTConversation') {
            this.addIdsToConversationTurns(); // Add IDs when popup requests data
            const conversations = this.extractConversations();
            console.log('Sending response with conversations:', conversations);
            sendResponse({ conversations });
          } else if (message.action === 'addIdsToConversations') {
            // Add a specific message type that can be triggered from popup
            this.addIdsToConversationTurns();
            sendResponse({ success: true });
          }
          return true; // Keep the message channel open for async response
        });
  
        // Monitor for new messages
        this.startObserving();
        
        // Initial checks
        setTimeout(() => {
          this.checkForNewConversations();
          this.addIdsToConversationTurns();
        }, 2000);
        
        setTimeout(() => {
          this.addIdsToConversationTurns();
        }, 5000);
      } catch (error) {
        console.error('Error initializing ChatGPT extractor:', error);
      }
    }
  
    private startObserving() {
      this.observer = new MutationObserver(() => {
        this.checkForNewConversations();
        this.addIdsToConversationTurns(); // Add IDs when DOM changes
      });
      
      const chatContainer = document.querySelector('main');
      if (chatContainer) {
        this.observer.observe(chatContainer, { childList: true, subtree: true });
        console.log('Started observing chat container');
      } else {
        console.warn('Chat container not found for observation');
      }
    }
  
    private checkForNewConversations() {
      const conversations = this.extractConversations();
      const currentCount = conversations.length;
      
      if (currentCount !== this.lastConversationCount) {
        this.lastConversationCount = currentCount;
        this.addIdsToConversationTurns();
        
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
        // This selector is confirmed to be working from your logs.
        const conversationTurns = document.querySelectorAll('[data-testid^="conversation-turn-"]');
        
        if (conversationTurns.length === 0) {
          console.log('No conversation turns found');
          return conversations;
        }
  
        console.log(`Found ${conversationTurns.length} conversation turns`);
  
        const messages = this.extractMessages(conversationTurns);
        const conversationPairs = this.groupMessagesIntoPairs(messages);
  
        conversationPairs.forEach((pair, index) => {
            if (pair.userMessage && pair.assistantMessage) {
              // The userMessage.id from our extraction is "conversation-turn-N"
              // We use this to construct the DOM ID ("pN") that we can link to.
              const turnMatch = pair.userMessage.id.match(/conversation-turn-(\d+)/);
              const domId = turnMatch ? `p${turnMatch[1]}` : `chatgpt-${Date.now()}-${index}`;
  
              conversations.push({
                id: domId, // Use the actual DOM ID for navigation
                prompt: pair.userMessage.content,
                response: pair.assistantMessage.content,
                timestamp: pair.userMessage.timestamp,
                source: 'ChatGPT'
              });
            }
          });
  
        console.log(`Extracted ${conversationPairs.length} conversation pairs`);
        
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
            const isUser = turnNumber % 2 === 1; 
            
            const content = this.extractTextFromTurn(turn);
            
            if (content.trim()) {
              messages.push({
                id: testId,
                content: content.trim(),
                sender: isUser ? 'user' : 'assistant',
                timestamp: new Date().toISOString()
              });
            }
          } catch (error) {
            console.error('Error extracting message from turn:', error);
          }
        });
    
        return messages;
      }
    
      private extractTextFromTurn(turn: Element): string {
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
    
        const allText = turn.textContent || '';
        return this.cleanExtractedText(allText);
      }
    
      private cleanExtractedText(text: string): string {
        return text
          .replace(/\s+/g, ' ')
          .replace(/^\d+\s*\/\s*\d+\s*/, '')
          .replace(/^Copy code\s*/, '')
          .replace(/\s*Copy\s*$/, '')
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
            if (currentPair.userMessage && currentPair.assistantMessage) {
              pairs.push(currentPair);
              currentPair = {};
            }
            currentPair.userMessage = message;
          } else if (message.sender === 'assistant') {
            currentPair.assistantMessage = message;
          }
        });
    
        if (currentPair.userMessage) {
          pairs.push(currentPair);
        }
    
        return pairs;
      }
  
    // ====================================================================
    // THIS FUNCTION HAS BEEN CORRECTED
    // ====================================================================
    private addIdsToConversationTurns() {
      // This log will now appear since we know the function is being called.
      console.log('>>> Running addIdsToConversationTurns...');
      
      try {
        // CHANGE: Use the general selector that is confirmed to work,
        // instead of the overly specific 'article' selector.
        const conversationTurns = document.querySelectorAll(
            '[data-testid^="conversation-turn-"], [data-test-id^="conversation-turn-"]'
        );
        
        if (conversationTurns.length === 0) {
            // This message should not appear if conversations are being found elsewhere.
            console.log("ID INJECTION: No conversation turns found.");
            return;
        }

        let idsAdded = 0;
        conversationTurns.forEach((turn) => {
          // Skip elements that already have the ID to avoid extra work
          if (turn.id && turn.id.startsWith('p')) {
            return;
          }

          const testId = turn.getAttribute('data-testid') || turn.getAttribute('data-test-id');
          
          const match = testId?.match(/conversation-turn-(\d+)/);
          if (match && match[1]) {
            const turnNumber = match[1];
            const idToAdd = `p${turnNumber}`;
            
            turn.setAttribute('id', idToAdd);
            idsAdded++;
          }
        });

        if (idsAdded > 0) {
            console.log(`SUCCESS: Injected ${idsAdded} new ID(s).`);
        }
        
      } catch (error) {
        console.error('Error in addIdsToConversationTurns:', error);
      }
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
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      extractor = new ChatGPTExtractor();
    });
  } else {
    extractor = new ChatGPTExtractor();
  }
  
  window.addEventListener('beforeunload', () => {
    if (extractor) {
      extractor.destroy();
    }
  });