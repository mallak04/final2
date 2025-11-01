import { motion } from 'framer-motion';
import { User, Mail, Code2, Calendar, Award, Settings, LogOut } from 'lucide-react';

export default function ProfilePage() {
  const userStats = {
    name: 'Developer',
    email: 'developer@abcode.com',
    joinDate: 'January 2025',
    totalAnalyses: 47,
    errorsSolved: 132,
    streak: 12,
  };

  return (
    <div className="min-h-screen bg-dark-bg pb-24 px-4 pt-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-dark-surface border border-dark-border rounded-2xl overflow-hidden mb-6 shadow-lg"
        >
          <div className="bg-gradient-to-r from-accent-teal to-accent-cyan h-32" />
          <div className="px-8 pb-8">
            <div className="flex items-end justify-between -mt-16 mb-6">
              <div className="flex items-end gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="w-28 h-28 bg-gradient-to-br from-accent-purple to-accent-teal rounded-2xl border-4 border-dark-surface shadow-glowHover flex items-center justify-center"
                >
                  <User className="w-14 h-14 text-white" />
                </motion.div>
                <div className="pb-2">
                  <h1 className="text-3xl font-bold text-text-primary mb-1">{userStats.name}</h1>
                  <div className="flex items-center gap-2 text-text-secondary">
                    <Mail className="w-4 h-4" />
                    <span>{userStats.email}</span>
                  </div>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mb-2 px-6 py-2.5 bg-dark-elevated border border-dark-border rounded-lg text-text-primary font-medium hover:border-accent-teal hover:shadow-glow transition-all flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Edit Profile
              </motion.button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-dark-elevated border border-dark-border rounded-xl p-4 hover:border-accent-teal transition-all"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-accent-teal/10 rounded-lg flex items-center justify-center">
                    <Code2 className="w-5 h-5 text-accent-teal" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-text-primary">{userStats.totalAnalyses}</p>
                    <p className="text-sm text-text-secondary">Analyses</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-dark-elevated border border-dark-border rounded-xl p-4 hover:border-accent-cyan transition-all"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-accent-cyan/10 rounded-lg flex items-center justify-center">
                    <Award className="w-5 h-5 text-accent-cyan" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-text-primary">{userStats.errorsSolved}</p>
                    <p className="text-sm text-text-secondary">Errors Fixed</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-dark-elevated border border-dark-border rounded-xl p-4 hover:border-accent-green transition-all"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-accent-green/10 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-accent-green" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-text-primary">{userStats.streak}</p>
                    <p className="text-sm text-text-secondary">Day Streak</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Settings Sections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {/* Preferences */}
          <div className="bg-dark-surface border border-dark-border rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-dark-border">
              <h2 className="text-xl font-semibold text-text-primary">Preferences</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between py-3">
                <div>
                  <h3 className="text-text-primary font-medium mb-1">Auto-analyze on save</h3>
                  <p className="text-sm text-text-secondary">Automatically analyze code when files are saved</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-dark-elevated border border-dark-border rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-text-tertiary after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-teal peer-checked:border-accent-teal"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <h3 className="text-text-primary font-medium mb-1">Show inline suggestions</h3>
                  <p className="text-sm text-text-secondary">Display AI suggestions directly in the editor</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-dark-elevated border border-dark-border rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-text-tertiary after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-teal peer-checked:border-accent-teal"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <h3 className="text-text-primary font-medium mb-1">Dark mode</h3>
                  <p className="text-sm text-text-secondary">Use dark theme for better eye comfort</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-dark-elevated border border-dark-border rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-text-tertiary after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-teal peer-checked:border-accent-teal"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="bg-dark-surface border border-dark-border rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-dark-border">
              <h2 className="text-xl font-semibold text-text-primary">Account Information</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between py-3">
                <div>
                  <h3 className="text-text-secondary text-sm mb-1">Member since</h3>
                  <p className="text-text-primary font-medium">{userStats.joinDate}</p>
                </div>
              </div>
              <div className="flex items-center justify-between py-3 border-t border-dark-border">
                <div>
                  <h3 className="text-text-secondary text-sm mb-1">Account Type</h3>
                  <p className="text-text-primary font-medium">Premium Developer</p>
                </div>
                <span className="px-3 py-1 bg-gradient-to-r from-accent-teal to-accent-cyan text-white text-xs font-semibold rounded-full">
                  PRO
                </span>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-dark-surface border border-red-900/30 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-red-900/30">
              <h2 className="text-xl font-semibold text-red-400">Danger Zone</h2>
            </div>
            <div className="p-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-6 py-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 font-medium hover:bg-red-500/20 transition-all flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
