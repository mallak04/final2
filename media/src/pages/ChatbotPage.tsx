import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, Sparkles, Code2 } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi! I'm ABCode AI, your intelligent coding assistant. I can help you understand errors, explain code, suggest improvements, and answer any questions about your projects. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
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

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        text: "I understand your question. Based on the code analysis, I can see that this is a common pattern in software development. Here's what I recommend:\n\n1. Check your variable declarations\n2. Ensure proper error handling\n3. Consider refactoring for better readability\n\nWould you like me to provide a specific code example?",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-dark-bg pb-24 flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-dark-surface border-b border-dark-border px-6 py-4 shadow-lg"
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-accent-teal to-accent-cyan rounded-xl flex items-center justify-center shadow-glow">
                <Bot className="w-7 h-7 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-accent-green rounded-full border-2 border-dark-surface"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-text-primary">ABCode AI Assistant</h1>
              <p className="text-sm text-text-secondary flex items-center gap-1">
                <span className="w-2 h-2 bg-accent-green rounded-full animate-pulse"></span>
                Online & Ready
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-dark-elevated rounded-lg border border-dark-border">
            <Sparkles className="w-4 h-4 text-accent-purple" />
            <span className="text-sm text-text-secondary">AI-Powered</span>
          </div>
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
                  <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                    message.sender === 'bot'
                      ? 'bg-gradient-to-br from-accent-teal to-accent-cyan shadow-glow'
                      : 'bg-dark-elevated border border-dark-border'
                  }`}>
                    {message.sender === 'bot' ? (
                      <Bot className="w-5 h-5 text-white" />
                    ) : (
                      <Code2 className="w-5 h-5 text-accent-teal" />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div className={`flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className={`rounded-2xl px-5 py-3 ${
                        message.sender === 'user'
                          ? 'bg-gradient-to-br from-accent-teal to-accent-cyan text-white shadow-glow'
                          : 'bg-dark-surface border border-dark-border text-text-primary'
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
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-teal to-accent-cyan flex items-center justify-center shadow-glow">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-dark-surface border border-dark-border rounded-2xl px-5 py-3">
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
      <div className="border-t border-dark-border bg-dark-surface px-4 py-4 shadow-2xl">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3 items-end">
            <div className="flex-1 bg-dark-elevated border border-dark-border rounded-2xl overflow-hidden focus-within:border-accent-teal focus-within:ring-2 focus-within:ring-accent-teal/20 transition-all">
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
                className="w-full px-5 py-4 bg-transparent text-text-primary placeholder-text-tertiary resize-none focus:outline-none"
                style={{ maxHeight: '150px' }}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(77, 184, 168, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSend}
              disabled={!input.trim()}
              className="w-14 h-14 bg-gradient-to-br from-accent-teal to-accent-cyan rounded-2xl flex items-center justify-center shadow-glow disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
