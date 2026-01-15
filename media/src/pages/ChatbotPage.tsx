import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Trash2 } from 'lucide-react';
import { sendChatMessage, clearChatHistory, getChatHistory, ConversationMessage } from '../services/chatbotService';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load conversation history on mount
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const history = await getChatHistory();

        if (history.length === 0) {
          // Show welcome message if no history
          setMessages([
            {
              id: 1,
              text: "Hi! I'm ABCode AI, your intelligent coding assistant. I can help you understand errors, explain code, suggest improvements, and answer any questions about your projects. How can I assist you today?",
              sender: 'bot',
              timestamp: new Date(),
            },
          ]);
        } else {
          // Convert history to message format
          const loadedMessages: Message[] = [];
          let messageId = 1;

          history.forEach((conv: ConversationMessage) => {
            if (conv.role === 'user' && conv.message) {
              loadedMessages.push({
                id: messageId++,
                text: conv.message,
                sender: 'user',
                timestamp: new Date(conv.created_at),
              });
            }
            if (conv.role === 'assistant' && conv.response) {
              loadedMessages.push({
                id: messageId++,
                text: conv.response,
                sender: 'bot',
                timestamp: new Date(conv.created_at),
              });
            }
          });

          setMessages(loadedMessages);
        }
      } catch (error) {
        console.error('Error loading chat history:', error);
        // Show welcome message on error
        setMessages([
          {
            id: 1,
            text: "Hi! I'm ABCode AI, your intelligent coding assistant. I can help you understand errors, explain code, suggest improvements, and answer any questions about your projects. How can I assist you today?",
            sender: 'bot',
            timestamp: new Date(),
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // Get AI response from backend
      const response = await sendChatMessage(userMessage.text);

      const botResponse: Message = {
        id: messages.length + 2,
        text: response,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error('Error getting bot response:', error);
      const errorMessage: Message = {
        id: messages.length + 2,
        text: "I'm sorry, I encountered an error processing your message. Please try again.",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearHistory = async () => {
    if (!confirm('Are you sure you want to clear the conversation history?')) {
      return;
    }

    try {
      await clearChatHistory();
      setMessages([
        {
          id: 1,
          text: "Hi! I'm ABCode AI, your intelligent coding assistant. I can help you understand errors, explain code, suggest improvements, and answer any questions about your projects. How can I assist you today?",
          sender: 'bot',
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error('Error clearing history:', error);
      alert('Failed to clear conversation history. Please try again.');
    }
  };

  // Show loading spinner while fetching history
  if (loading) {
    return (
      <div className="min-h-screen bg-light-bg dark:bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent-teal border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-text-secondary">Loading conversation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg transition-colors duration-300 pb-24 flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-light-surface dark:bg-dark-surface border-b border-light-border dark:border-dark-border px-6 py-4 shadow-lg"
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 bg-accent-teal rounded flex items-center justify-center shadow-glow">
                <Bot className="w-7 h-7 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-accent-green rounded-full border-2 border-dark-surface"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-text-primary">ABCode AI Assistant</h1>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClearHistory}
            className="flex items-center gap-2 px-4 py-2 bg-light-elevated dark:bg-dark-elevated border border-light-border dark:border-dark-border rounded-lg text-sm text-text-secondary hover:text-accent-red hover:border-accent-red transition-colors"
            title="Clear conversation history"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear History</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-3 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Avatar */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded flex items-center justify-center ${
                    message.sender === 'bot'
                      ? 'bg-accent-teal shadow-glow'
                      : 'bg-light-elevated dark:bg-dark-elevated border border-light-border dark:border-dark-border'
                  }`}>
                    {message.sender === 'bot' ? (
                      <Bot className="w-5 h-5 text-white" />
                    ) : (
                      <User className="w-5 h-5 text-accent-teal" />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div className={`flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className={`rounded-2xl px-5 py-3 ${
                        message.sender === 'user'
                          ? 'bg-accent-teal text-white shadow-glow'
                          : 'bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border text-gray-900 dark:text-text-primary'
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-line">{message.text}</p>
                    </motion.div>
                    <span className="text-xs text-text-tertiary mt-1 px-2">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex gap-3"
            >
              <div className="w-10 h-10 rounded bg-accent-teal flex items-center justify-center shadow-glow">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-2xl px-5 py-3">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 bg-accent-teal rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-accent-teal rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-accent-teal rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface px-4 py-4 shadow-2xl">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3 items-end">
            <div className="flex-1 bg-light-elevated dark:bg-dark-elevated border border-light-border dark:border-dark-border rounded-2xl overflow-hidden focus-within:border-accent-teal focus-within:ring-2 focus-within:ring-accent-teal/20 transition-all">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask me anything about your code..."
                rows={1}
                className="w-full px-5 py-4 bg-transparent text-gray-900 dark:text-text-primary placeholder-text-tertiary resize-none focus:outline-none"
                style={{ maxHeight: '150px' }}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(77, 184, 168, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSend}
              disabled={!input.trim()}
              className="w-14 h-14 bg-accent-teal rounded-2xl flex items-center justify-center shadow-glow disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Send className="w-5 h-5 text-white" />
            </motion.button>
          </div>

          <p className="text-xs text-text-tertiary text-center mt-3">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}
