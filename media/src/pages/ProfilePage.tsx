import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Calendar, Award, Settings, LogOut, X, Camera, Eye, EyeOff, Crown, ArrowUpCircle, Check, Zap, Shield, TrendingUp } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useState, useRef, useEffect } from 'react';
import { fetchUserStats } from '../services/apiService';

export default function ProfilePage() {
  const { theme, toggleTheme } = useTheme();
  const [isEditMode, setIsEditMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // TODO: Replace with actual user ID from authentication
  const userId = "test-user";

  const [userStats, setUserStats] = useState({
    name: 'Developer',
    email: 'developer@abcode.com',
    joinDate: 'January 2025',
    totalAnalyses: 0,
    errorsSolved: 0,
    streak: 0,
  });

  useEffect(() => {
    const loadUserStats = async () => {
      setLoading(true);
      try {
        const stats = await fetchUserStats(userId);
        if (stats) {
          setUserStats(prev => ({
            ...prev,
            totalAnalyses: stats.total_analyses,
            errorsSolved: stats.errors_fixed,
            streak: stats.day_streak,
          }));
        }
      } catch (error) {
        console.error('Error loading user stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserStats();
  }, [userId]);

  const [editForm, setEditForm] = useState({
    name: userStats.name,
    email: userStats.email,
    password: '',
    confirmPassword: '',
    profilePicture: null as string | null,
  });

  const handleEditClick = () => {
    setEditForm({
      name: userStats.name,
      email: userStats.email,
      password: '',
      confirmPassword: '',
      profilePicture: null,
    });
    setIsEditMode(true);
  };

  const handleSave = () => {
    // Validate passwords match if changing password
    if (editForm.password && editForm.password !== editForm.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    // Update user stats
    setUserStats({
      ...userStats,
      name: editForm.name,
      email: editForm.email,
    });

    setIsEditMode(false);
    alert('Profile updated successfully!');
  };

  const handleCancel = () => {
    setIsEditMode(false);
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm({ ...editForm, profilePicture: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg pb-24 px-4 pt-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-2xl overflow-hidden mb-6 shadow-lg"
        >
          <div className="bg-accent-teal h-32" />
          <div className="px-8 pb-8">
            <div className="flex items-end justify-between -mt-16 mb-6">
              <div className="flex items-end gap-4">
                <div
                  className="w-28 h-28 bg-accent-teal rounded-2xl border-4 border-light-surface dark:border-dark-surface flex items-center justify-center cursor-pointer"
                >
                  <User className="w-14 h-14 text-white" />
                </div>
                <div className="pb-2">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-text-primary mb-1">{userStats.name}</h1>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-text-secondary">
                    <Mail className="w-4 h-4" />
                    <span>{userStats.email}</span>
                  </div>
                </div>
              </div>
              <motion.button
                onClick={handleEditClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mb-2 px-6 py-2.5 bg-light-elevated dark:bg-dark-elevated border-2 border-light-border dark:border-dark-border rounded-lg text-gray-900 dark:text-text-primary font-medium hover:border-accent-teal transition-all flex items-center gap-2"
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
                whileHover={{ scale: 1.05, y: -3 }}
                className="bg-light-elevated dark:bg-dark-elevated border-2 border-light-border dark:border-dark-border rounded-xl p-4 hover:border-accent-teal transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-accent-teal/10 rounded-lg flex items-center justify-center">
                    <img src="/analysisprof.svg" alt="Analysis" className="w-7 h-7" />
                  </div>
                  <div>
                    {loading ? (
                      <div className="h-8 w-16 bg-light-border dark:bg-dark-border animate-pulse rounded"></div>
                    ) : (
                      <p className="text-2xl font-bold text-gray-900 dark:text-text-primary">{userStats.totalAnalyses}</p>
                    )}
                    <p className="text-sm text-gray-600 dark:text-text-secondary">Analyses</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.05, y: -3 }}
                className="bg-light-elevated dark:bg-dark-elevated border-2 border-light-border dark:border-dark-border rounded-xl p-4 hover:border-accent-cyan transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-accent-cyan/10 rounded-lg flex items-center justify-center">
                    <Award className="w-5 h-5 text-accent-cyan" />
                  </div>
                  <div>
                    {loading ? (
                      <div className="h-8 w-16 bg-light-border dark:bg-dark-border animate-pulse rounded"></div>
                    ) : (
                      <p className="text-2xl font-bold text-gray-900 dark:text-text-primary">{userStats.errorsSolved}</p>
                    )}
                    <p className="text-sm text-gray-600 dark:text-text-secondary">Errors Fixed</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.05, y: -3 }}
                className="bg-light-elevated dark:bg-dark-elevated border-2 border-light-border dark:border-dark-border rounded-xl p-4 hover:border-accent-green transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-accent-green/10 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-accent-green" />
                  </div>
                  <div>
                    {loading ? (
                      <div className="h-8 w-16 bg-light-border dark:bg-dark-border animate-pulse rounded"></div>
                    ) : (
                      <p className="text-2xl font-bold text-gray-900 dark:text-text-primary">{userStats.streak}</p>
                    )}
                    <p className="text-sm text-gray-600 dark:text-text-secondary">Day Streak</p>
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
          <div className="bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-light-border dark:border-dark-border">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-text-primary">Preferences</h2>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between py-3">
                <div>
                  <h3 className="text-gray-900 dark:text-text-primary font-medium mb-1">Dark mode</h3>
                  <p className="text-sm text-gray-600 dark:text-text-secondary">Use dark theme for better eye comfort</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={theme === 'dark'}
                    onChange={toggleTheme}
                  />
                  <div className="w-11 h-6 bg-light-elevated dark:bg-dark-elevated border border-light-border dark:border-dark-border rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-400 dark:after:bg-text-tertiary after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-teal peer-checked:border-accent-teal"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-light-border dark:border-dark-border">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-text-primary">Account Information</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between py-3">
                <div>
                  <h3 className="text-gray-600 dark:text-text-secondary text-sm mb-1">Member since</h3>
                  <p className="text-gray-900 dark:text-text-primary font-medium">{userStats.joinDate}</p>
                </div>
              </div>
              <div className="flex items-center justify-between py-3 border-t border-light-border dark:border-dark-border">
                <div className="flex items-center gap-3">
                  <div>
                    <h3 className="text-gray-600 dark:text-text-secondary text-sm mb-1">Account Type</h3>
                    <div className="flex items-center gap-2">
                      <p className="text-gray-900 dark:text-text-primary font-medium">Basic</p>
                      <span className="px-2.5 py-0.5 bg-gray-400/20 text-gray-600 dark:text-text-secondary text-xs font-semibold rounded-full">
                        FREE
                      </span>
                    </div>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowUpgradeModal(true)}
                  className="px-4 py-2 bg-gradient-to-r from-accent-teal to-accent-cyan text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-accent-teal/30 transition-all flex items-center gap-2"
                >
                  <Crown className="w-4 h-4" />
                  Upgrade to Pro
                </motion.button>
              </div>
            </div>
          </div>

          {/* Sign Out */}
          <div className="bg-light-surface dark:bg-dark-surface border border-red-500/30 dark:border-red-900/30 rounded-2xl overflow-hidden">
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

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditMode && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCancel}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto"
            >
              <div className="bg-light-surface dark:bg-dark-surface border-2 border-light-border dark:border-dark-border rounded-2xl shadow-2xl max-w-2xl w-full mt-8 mb-32">
                {/* Modal Header */}
                <div className="sticky top-0 bg-light-surface dark:bg-dark-surface border-b border-light-border dark:border-dark-border px-6 py-4 flex items-center justify-between z-10">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-text-primary">Edit Profile</h2>
                  <button
                    onClick={handleCancel}
                    className="p-2 hover:bg-light-elevated dark:hover:bg-dark-elevated rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600 dark:text-text-secondary" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-6">
                  {/* Profile Picture */}
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                      <div className="w-32 h-32 bg-accent-teal rounded-2xl flex items-center justify-center overflow-hidden">
                        {editForm.profilePicture ? (
                          <img src={editForm.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-16 h-16 text-white" />
                        )}
                      </div>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-0 right-0 p-2 bg-accent-teal text-white rounded-full shadow-lg hover:bg-accent-cyan transition-colors"
                      >
                        <Camera className="w-4 h-4" />
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePictureChange}
                        className="hidden"
                      />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-text-secondary">Click the camera icon to upload a new profile picture</p>
                  </div>

                  {/* Name Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-text-primary mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full px-4 py-3 bg-light-elevated dark:bg-dark-elevated border-2 border-light-border dark:border-dark-border rounded-lg text-gray-900 dark:text-text-primary focus:outline-none focus:border-accent-teal transition-colors"
                      placeholder="Enter your name"
                    />
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-text-primary mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="w-full px-4 py-3 bg-light-elevated dark:bg-dark-elevated border-2 border-light-border dark:border-dark-border rounded-lg text-gray-900 dark:text-text-primary focus:outline-none focus:border-accent-teal transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>

                  {/* Password Section */}
                  <div className="pt-4 border-t border-light-border dark:border-dark-border">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-text-primary mb-4">Change Password (Optional)</h3>

                    {/* New Password */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-900 dark:text-text-primary mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={editForm.password}
                          onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                          className="w-full px-4 py-3 pr-12 bg-light-elevated dark:bg-dark-elevated border-2 border-light-border dark:border-dark-border rounded-lg text-gray-900 dark:text-text-primary focus:outline-none focus:border-accent-teal transition-colors"
                          placeholder="Enter new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 dark:text-text-secondary hover:text-accent-teal transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-900 dark:text-text-primary mb-2">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={editForm.confirmPassword}
                          onChange={(e) => setEditForm({ ...editForm, confirmPassword: e.target.value })}
                          className="w-full px-4 py-3 pr-12 bg-light-elevated dark:bg-dark-elevated border-2 border-light-border dark:border-dark-border rounded-lg text-gray-900 dark:text-text-primary focus:outline-none focus:border-accent-teal transition-colors"
                          placeholder="Confirm new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 dark:text-text-secondary hover:text-accent-teal transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="sticky bottom-0 bg-light-surface dark:bg-dark-surface border-t border-light-border dark:border-dark-border px-6 py-4 flex gap-3 justify-end">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCancel}
                    className="px-6 py-2.5 bg-light-elevated dark:bg-dark-elevated border-2 border-light-border dark:border-dark-border rounded-lg text-gray-900 dark:text-text-primary font-medium hover:border-red-500 hover:text-red-500 transition-all"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    className="px-6 py-2.5 bg-accent-teal text-white font-medium rounded-lg hover:bg-accent-cyan transition-all"
                  >
                    Save Changes
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Upgrade Modal */}
      <AnimatePresence>
        {showUpgradeModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowUpgradeModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto"
            >
              <div className="bg-light-surface dark:bg-dark-surface border-2 border-light-border dark:border-dark-border rounded-2xl shadow-2xl max-w-4xl w-full mt-8 mb-32">
                {/* Modal Header */}
                <div className="sticky top-0 bg-gradient-to-r from-accent-teal to-accent-cyan px-6 py-6 flex items-center justify-between z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <Crown className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Upgrade to Pro</h2>
                      <p className="text-white/80 text-sm">Unlock premium features and boost your coding</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowUpgradeModal(false)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-8">
                  {/* Pricing Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Basic Plan (Current) */}
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="bg-light-elevated dark:bg-dark-elevated border-2 border-light-border dark:border-dark-border rounded-xl p-6"
                    >
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-text-primary mb-2">Basic</h3>
                        <div className="flex items-baseline gap-2 mb-2">
                          <span className="text-3xl font-bold text-gray-900 dark:text-text-primary">$0</span>
                          <span className="text-gray-600 dark:text-text-secondary">/month</span>
                        </div>
                        <span className="px-2.5 py-1 bg-gray-400/20 text-gray-600 dark:text-text-secondary text-xs font-semibold rounded-full">
                          CURRENT PLAN
                        </span>
                      </div>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-600 dark:text-text-secondary">10 code analyses per month</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-600 dark:text-text-secondary">Basic error detection</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-600 dark:text-text-secondary">Progress tracking</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-600 dark:text-text-secondary">Community support</span>
                        </li>
                      </ul>
                    </motion.div>

                    {/* Pro Plan */}
                    <motion.div
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="bg-gradient-to-br from-accent-teal/10 to-accent-cyan/10 border-2 border-accent-teal rounded-xl p-6 relative overflow-hidden"
                    >
                      {/* Recommended Badge */}
                      <div className="absolute top-4 right-4">
                        <span className="px-3 py-1 bg-accent-teal text-white text-xs font-bold rounded-full shadow-lg">
                          RECOMMENDED
                        </span>
                      </div>

                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Crown className="w-6 h-6 text-accent-teal" />
                          <h3 className="text-xl font-bold text-gray-900 dark:text-text-primary">Pro</h3>
                        </div>
                        <div className="flex items-baseline gap-2 mb-2">
                          <span className="text-3xl font-bold text-accent-teal">$9.99</span>
                          <span className="text-gray-600 dark:text-text-secondary">/month</span>
                        </div>
                      </div>
                      <ul className="space-y-3 mb-6">
                        <li className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-accent-teal mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-900 dark:text-text-primary font-medium">Unlimited code analyses</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-accent-teal mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-900 dark:text-text-primary font-medium">Advanced AI error detection</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-accent-teal mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-900 dark:text-text-primary font-medium">Real-time code suggestions</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-accent-teal mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-900 dark:text-text-primary font-medium">Priority support</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-accent-teal mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-900 dark:text-text-primary font-medium">Detailed analytics & insights</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-accent-teal mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-900 dark:text-text-primary font-medium">Export reports</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-accent-teal mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-900 dark:text-text-primary font-medium">Custom code patterns</span>
                        </li>
                      </ul>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full px-6 py-3 bg-gradient-to-r from-accent-teal to-accent-cyan text-white font-bold rounded-lg hover:shadow-xl hover:shadow-accent-teal/30 transition-all flex items-center justify-center gap-2"
                      >
                        <Zap className="w-5 h-5" />
                        Upgrade Now
                      </motion.button>
                    </motion.div>
                  </div>

                  {/* Features Highlight */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-light-elevated dark:bg-dark-elevated border border-light-border dark:border-dark-border rounded-xl p-6"
                  >
                    <h3 className="text-lg font-bold text-gray-900 dark:text-text-primary mb-4 text-center">Why Upgrade to Pro?</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-accent-teal/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                          <Zap className="w-6 h-6 text-accent-teal" />
                        </div>
                        <h4 className="font-semibold text-gray-900 dark:text-text-primary mb-2">Faster Learning</h4>
                        <p className="text-sm text-gray-600 dark:text-text-secondary">Get instant feedback and improve your code quality faster</p>
                      </div>
                      <div className="text-center">
                        <div className="w-12 h-12 bg-accent-cyan/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                          <TrendingUp className="w-6 h-6 text-accent-cyan" />
                        </div>
                        <h4 className="font-semibold text-gray-900 dark:text-text-primary mb-2">Better Insights</h4>
                        <p className="text-sm text-gray-600 dark:text-text-secondary">Advanced analytics to track your coding progress</p>
                      </div>
                      <div className="text-center">
                        <div className="w-12 h-12 bg-accent-green/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                          <Shield className="w-6 h-6 text-accent-green" />
                        </div>
                        <h4 className="font-semibold text-gray-900 dark:text-text-primary mb-2">Priority Support</h4>
                        <p className="text-sm text-gray-600 dark:text-text-secondary">Get help when you need it with dedicated support</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
