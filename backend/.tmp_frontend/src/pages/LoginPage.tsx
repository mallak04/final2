import { useState } from 'react';
import { Mail, Lock, User, Bot } from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, just call onLogin - in production, this would handle authentication
    onLogin();
  };

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg transition-colors duration-300 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-20 left-20 w-96 h-96 bg-accent-teal/10 rounded-full blur-3xl"
        />
        <div
          className="absolute bottom-20 right-20 w-96 h-96 bg-accent-cyan/10 rounded-full blur-3xl"
        />
        <div
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-accent-purple/5 rounded-full blur-3xl"
        />
      </div>

      <div
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo and Title */}
        <div
          className="text-center mb-8"
        >
          <div
            className="inline-flex items-center justify-center mb-4"
          >
            {/* Try to load custom logo, fallback to Bot icon if not found */}
            <img
              src="/logo.svg"
              alt="ABCode Logo"
              className="w-48 h-48 object-contain"
              onError={(e) => {
                // If logo.png doesn't exist, hide image and show Bot icon instead
                e.currentTarget.style.display = 'none';
                const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
            <div className="flex items-center justify-center" style={{ display: 'none' }}>
              <Bot className="w-24 h-24 text-accent-teal" />
            </div>
          </div>
        </div>

        {/* Login/Signup Card */}
        <div
          className="bg-light-surface dark:bg-dark-surface border-2 border-light-border dark:border-dark-border rounded-lg shadow-2xl overflow-hidden hover:border-accent-teal/30 transition-all"
        >
          {/* Tab Switcher */}
          <div className="flex border-b border-light-border dark:border-dark-border">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-4 text-sm font-semibold transition-all ${
                isLogin
                  ? 'text-accent-teal border-b-2 border-accent-teal bg-light-elevated dark:bg-dark-elevated'
                  : 'text-gray-500 dark:text-text-tertiary hover:text-gray-600 dark:text-text-secondary'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-4 text-sm font-semibold transition-all ${
                !isLogin
                  ? 'text-accent-teal border-b-2 border-accent-teal bg-light-elevated dark:bg-dark-elevated'
                  : 'text-gray-500 dark:text-text-tertiary hover:text-gray-600 dark:text-text-secondary'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8">
            <div
              key={isLogin ? 'login' : 'signup'}
              className="space-y-5"
            >
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-text-secondary mb-2">
                    Full Name
                  </label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-text-tertiary group-focus-within:text-accent-teal transition-colors" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full bg-light-elevated dark:bg-dark-elevated border-2 border-light-border dark:border-dark-border rounded-lg pl-12 pr-4 py-3 text-gray-900 dark:text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent-teal transition-all"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-text-secondary mb-2">
                  Username
                </label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-text-tertiary group-focus-within:text-accent-teal transition-colors" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="w-full bg-light-elevated dark:bg-dark-elevated border-2 border-light-border dark:border-dark-border rounded-lg pl-12 pr-4 py-3 text-gray-900 dark:text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent-teal transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-text-secondary mb-2">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-text-tertiary group-focus-within:text-accent-teal transition-colors" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full bg-light-elevated dark:bg-dark-elevated border-2 border-light-border dark:border-dark-border rounded-lg pl-12 pr-4 py-3 text-gray-900 dark:text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent-teal transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-text-secondary mb-2">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-text-tertiary group-focus-within:text-accent-teal transition-colors" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-light-elevated dark:bg-dark-elevated border-2 border-light-border dark:border-dark-border rounded-lg pl-12 pr-4 py-3 text-gray-900 dark:text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent-teal transition-all"
                  />
                </div>
              </div>

              {isLogin && (
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-light-border dark:border-dark-border bg-light-elevated dark:bg-dark-elevated text-accent-teal focus:ring-2 focus:ring-accent-teal/20"
                    />
                    <span className="text-gray-600 dark:text-text-secondary">Remember me</span>
                  </label>
                  <button type="button" className="text-accent-teal hover:text-accent-cyan transition-colors">
                    Forgot password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-accent-teal text-white font-semibold py-3 rounded-lg shadow-glowTeal transition-all hover:bg-accent-cyan"
              >
                {isLogin ? 'Sign In' : 'Create Account'}
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <p
          className="text-center mt-6 text-gray-500 dark:text-text-tertiary text-sm"
        >
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
