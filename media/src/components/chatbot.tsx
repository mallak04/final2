import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, Bot } from 'lucide-react';

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your ABCode assistant. Ask me anything about your code errors!",
      sender: 'bot',
    },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: input,
      sender: 'user',
    };

    setMessages([...messages, userMessage]);

    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: "I've analyzed your question. This error typically occurs when brackets are mismatched. Make sure every opening bracket has a corresponding closing bracket.",
        sender: 'bot',
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);

    setInput('');
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="bg-white rounded shadow-lg border border-gray-200 overflow-hidden flex flex-col"
      style={{ height: '400px' }}
    >
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-3 flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-white" />
        <h2 className="text-lg font-semibold text-white">Ask ABCode</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-800'
                }`}
              >
                {message.sender === 'bot' && (
                  <div className="flex items-center gap-2 mb-1">
                    <img
                      src="/chatbot-logo.png"
                      alt="ABCode AI"
                      className="w-4 h-4 object-contain"
                      onError={(e) => {
                        // Fallback to Bot icon if image not found
                        e.currentTarget.style.display = 'none';
                        const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'block';
                      }}
                    />
                    <Bot className="w-4 h-4 text-purple-600" style={{ display: 'none' }} />
                    <span className="text-xs font-semibold text-purple-600">ABCode AI</span>
                  </div>
                )}
                <p className="text-sm leading-relaxed">{message.text}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask a question about your code..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg flex items-center gap-2 hover:shadow-lg transition-shadow"
          >
            <Send className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
