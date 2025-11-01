import { useState } from 'react';
import { motion } from 'framer-motion';
import { Code2, Mail, Lock, User } from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, just call onLogin - in production, this would handle authentication
    onLogin();
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center px-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-accent-teal/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent-cyan/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo and Title */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-accent-teal to-accent-cyan rounded-2xl mb-4 shadow-glow">
            <Code2 className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-text-primary mb-2">ABCode</h1>
          <p className="text-text-secondary">AI-Powered Code Analysis</p>
        </motion.div>

        {/* Login/Signup Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-dark-surface border border-dark-border rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Tab Switcher */}
          <div className="flex border-b border-dark-border">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-4 text-sm font-semibold transition-all ${
                isLogin
                  ? 'text-accent-teal border-b-2 border-accent-teal bg-dark-elevated'
                  : 'text-text-tertiary hover:text-text-secondary'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-4 text-sm font-semibold transition-all ${
                !isLogin
                  ? 'text-accent-teal border-b-2 border-accent-teal bg-dark-elevated'
                  : 'text-text-tertiary hover:text-text-secondary'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8">
            <motion.div
              key={isLogin ? 'login' : 'signup'}
              initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full bg-dark-elevated border border-dark-border rounded-lg pl-12 pr-4 py-3 text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent-teal focus:ring-2 focus:ring-accent-teal/20 transition-all"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full bg-dark-elevated border border-dark-border rounded-lg pl-12 pr-4 py-3 text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent-teal focus:ring-2 focus:ring-accent-teal/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-dark-elevated border border-dark-border rounded-lg pl-12 pr-4 py-3 text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent-teal focus:ring-2 focus:ring-accent-teal/20 transition-all"
                  />
                </div>
              </div>

              {isLogin && (
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-dark-border bg-dark-elevated text-accent-teal focus:ring-2 focus:ring-accent-teal/20"
                    />
                    <span className="text-text-secondary">Remember me</span>
                  </label>
                  <button type="button" className="text-accent-teal hover:text-accent-cyan transition-colors">
                    Forgot password?
                  </button>
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(77, 184, 168, 0.25)' }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-gradient-to-r from-accent-teal to-accent-cyan text-white font-semibold py-3 rounded-lg shadow-glow transition-all"
              >
                {isLogin ? 'Sign In' : 'Create Account'}
              </motion.button>
            </motion.div>
          </form>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-6 text-text-tertiary text-sm"
        >
          By continuing, you agree to our Terms of Service and Privacy Policy
        </motion.p>
      </motion.div>
    </div>
  );
}
