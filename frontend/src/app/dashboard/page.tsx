'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Smartphone, Plus, Download, Trash2, Clock, CheckCircle2, 
  XCircle, Loader2, Settings, LogOut, CreditCard, BarChart3,
  Globe, Image, Palette, Zap, Upload
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { buildAPI, userAPI, authAPI } from '@/lib/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export default function DashboardPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'new' | 'history' | 'analytics' | 'settings'>('new');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(userData));
  }, [router]);

  const { data: stats } = useQuery({
    queryKey: ['user-stats'],
    queryFn: async () => {
      const res = await userAPI.getStats();
      return res.data.stats;
    },
  });

  const { data: builds, isLoading: buildsLoading } = useQuery({
    queryKey: ['builds'],
    queryFn: async () => {
      const res = await buildAPI.getAll(1, 20);
      return res.data.builds;
    },
  });

  const handleLogout = () => {
    authAPI.logout();
    router.push('/');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 glass border-r border-white/10 p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Smartphone className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-white">Web2APK</span>
        </div>

        <nav className="space-y-2">
          <button
            onClick={() => setActiveTab('new')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
              activeTab === 'new'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'text-gray-400 hover:bg-white/5'
            }`}
          >
            <Plus className="w-5 h-5" />
            New Build
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
              activeTab === 'history'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'text-gray-400 hover:bg-white/5'
            }`}
          >
            <Clock className="w-5 h-5" />
            Build History
          </button>
          <button 
            onClick={() => setActiveTab('analytics')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
              activeTab === 'analytics'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'text-gray-400 hover:bg-white/5'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            Analytics
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
              activeTab === 'settings'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'text-gray-400 hover:bg-white/5'
            }`}
          >
            <Settings className="w-5 h-5" />
            Settings
          </button>
        </nav>

        <div className="absolute bottom-6 left-6 right-6 space-y-4">
          <div className="card p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                {user.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white font-medium truncate">{user.name}</div>
                <div className="text-xs text-gray-400 truncate">{user.email}</div>
              </div>
            </div>
            {user.subscription?.plan === 'free' && (
              <button className="w-full mt-3 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium">
                Upgrade to Pro
              </button>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 transition"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Zap}
            label="Builds This Month"
            value={stats?.usage.buildsThisMonth || 0}
            color="purple"
          />
          <StatCard
            icon={CheckCircle2}
            label="Completed"
            value={stats?.usage.completedBuilds || 0}
            color="green"
          />
          <StatCard
            icon={Clock}
            label="Active Builds"
            value={stats?.usage.activeBuilds || 0}
            color="blue"
          />
          <StatCard
            icon={Download}
            label="Remaining"
            value={stats?.usage.remainingBuilds || 0}
            color="pink"
          />
        </div>

        {/* Content */}
        {activeTab === 'new' && <NewBuildForm />}
        {activeTab === 'history' && <BuildHistory builds={builds} loading={buildsLoading} />}
        {activeTab === 'analytics' && <Analytics stats={stats} />}
        {activeTab === 'settings' && <SettingsPanel user={user} />}
      </main>
    </div>
  );
}

interface StatCardProps {
  icon: any;
  label: string;
  value: number;
  color: 'purple' | 'green' | 'blue' | 'pink';
}

function StatCard({ icon: Icon, label, value, color }: StatCardProps) {
  const colors: Record<'purple' | 'green' | 'blue' | 'pink', string> = {
    purple: 'from-purple-500/20 to-purple-500/5 border-purple-500/20 text-purple-400',
    green: 'from-green-500/20 to-green-500/5 border-green-500/20 text-green-400',
    blue: 'from-blue-500/20 to-blue-500/5 border-blue-500/20 text-blue-400',
    pink: 'from-pink-500/20 to-pink-500/5 border-pink-500/20 text-pink-400',
  };

  return (
    <div className={`card bg-gradient-to-br ${colors[color]}`}>
      <Icon className="w-8 h-8 mb-3" />
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-gray-400">{label}</div>
    </div>
  );
}

function NewBuildForm() {
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [features, setFeatures] = useState({
    pullToRefresh: true,
    progressBar: true,
    errorPage: true,
    fileUpload: false,
    deepLinking: false,
  });

  const createBuildMutation = useMutation({
    mutationFn: (formData: FormData) => buildAPI.create(formData),
    onSuccess: () => {
      toast.success('Build started successfully!');
      queryClient.invalidateQueries({ queryKey: ['builds'] });
      reset();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Build creation failed');
    },
  });

  const onSubmit = (data: any) => {
    const formData = new FormData();
    formData.append('websiteUrl', data.websiteUrl);
    formData.append('appName', data.appName);
    formData.append('packageName', data.packageName || '');
    formData.append('splashBackground', data.splashBackground || '#FFFFFF');

    if (data.appIcon?.[0]) formData.append('appIcon', data.appIcon[0]);
    if (data.splashImage?.[0]) formData.append('splashImage', data.splashImage[0]);

    formData.append('features', JSON.stringify(features));

    createBuildMutation.mutate(formData);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h2 className="text-3xl font-bold text-white mb-8">Create New APK</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="card max-w-3xl">
        <div className="space-y-6">
          {/* Website URL */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              <Globe className="w-4 h-4" />
              Website URL
            </label>
            <input
              {...register('websiteUrl', {
                required: 'Website URL is required',
                pattern: { value: /^https?:\/\/.+/, message: 'Must be a valid URL with http:// or https://' }
              })}
              type="url"
              placeholder="https://example.com"
              className="input"
            />
            {errors.websiteUrl && <p className="mt-1 text-sm text-red-400">{errors.websiteUrl.message as string}</p>}
          </div>

          {/* App Name */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              <Smartphone className="w-4 h-4" />
              App Name
            </label>
            <input
              {...register('appName', {
                required: 'App name is required',
                minLength: { value: 2, message: 'App name must be at least 2 characters' },
                maxLength: { value: 50, message: 'App name cannot exceed 50 characters' }
              })}
              type="text"
              placeholder="My Awesome App"
              className="input"
            />
            {errors.appName && <p className="mt-1 text-sm text-red-400">{errors.appName.message as string}</p>}
          </div>

          {/* Package Name */}
          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">
              Package Name <span className="text-gray-500">(optional)</span>
            </label>
            <input
              {...register('packageName')}
              type="text"
              placeholder="com.example.myapp"
              className="input"
            />
            <p className="mt-1 text-xs text-gray-500">Leave empty to auto-generate</p>
          </div>

          {/* App Icon */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              <Image className="w-4 h-4" />
              App Icon <span className="text-gray-500">(PNG, max 5MB)</span>
            </label>
            <input {...register('appIcon')} type="file" accept="image/png,image/jpeg" className="input" />
          </div>

          {/* Splash Background Color */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              <Palette className="w-4 h-4" />
              Splash Background Color
            </label>
            <input {...register('splashBackground')} type="color" defaultValue="#6366f1" className="input h-12" />
          </div>

          {/* Features */}
          <div>
            <label className="text-sm font-medium text-gray-300 mb-3 block">Features</label>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(features).map(([key, value]) => (
                <label key={key} className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => setFeatures({ ...features, [key]: e.target.checked })}
                    className="w-5 h-5 rounded bg-white/10 border-white/20"
                  />
                  <span className="text-white capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={createBuildMutation.isPending}
            className="w-full btn-primary flex items-center justify-center gap-2 py-4"
          >
            {createBuildMutation.isPending ? (
              <><Loader2 className="w-5 h-5 animate-spin" />Creating APK...</>
            ) : (
              <><Plus className="w-5 h-5" />Create APK</>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
}

interface Build {
  id: string;
  buildId: string;
  appName: string;
  packageName: string;
  websiteUrl: string;
  status: string;
  progress: number;
  downloadUrl?: string;
  apkSizeFormatted?: string;
  durationFormatted?: string;
  downloadCount: number;
  createdAt: string;
  completedAt?: string;
  expiresAt?: string;
  isExpired: boolean;
}

interface BuildHistoryProps {
  builds: Build[];
  loading: boolean;
}

function BuildHistory({ builds, loading }: BuildHistoryProps) {
  const queryClient = useQueryClient();

  const deleteBuild = useMutation({
    mutationFn: (buildId: string) => buildAPI.delete(buildId),
    onSuccess: () => {
      toast.success('Build deleted');
      queryClient.invalidateQueries({ queryKey: ['builds'] });
    },
  });

  const downloadAPK = async (buildId: string, appName: string) => {
    try {
      const response = await buildAPI.download(buildId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${appName}.apk`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('APK downloaded!');
    } catch (error) {
      toast.error('Download failed');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="spinner"></div></div>;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h2 className="text-3xl font-bold text-white mb-8">Build History</h2>

      <div className="space-y-4">
        {builds?.map((build: Build) => (
          <div key={build.id} className="card flex items-center gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-1">{build.appName}</h3>
              <p className="text-sm text-gray-400">{build.packageName}</p>
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                <span>{new Date(build.createdAt).toLocaleDateString()}</span>
                <span>{build.apkSizeFormatted}</span>
                <span>{build.durationFormatted}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={build.status} />
              {build.status === 'completed' && (
                <button onClick={() => downloadAPK(build.buildId, build.appName)} className="btn-secondary p-3">
                  <Download className="w-5 h-5" />
                </button>
              )}
              <button onClick={() => deleteBuild.mutate(build.buildId)} className="p-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config = {
    completed: { color: 'green', icon: CheckCircle2, label: 'Completed' },
    building: { color: 'blue', icon: Loader2, label: 'Building' },
    failed: { color: 'red', icon: XCircle, label: 'Failed' },
    queued: { color: 'yellow', icon: Clock, label: 'Queued' },
  }[status] || { color: 'gray', icon: Clock, label: status };

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg bg-${config.color}-500/10 text-${config.color}-400`}>
      <config.icon className="w-4 h-4" />
      <span className="text-sm font-medium">{config.label}</span>
    </div>
  );
}

function Analytics({ stats }: { stats: any }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h2 className="text-3xl font-bold text-white mb-8">Analytics</h2>
      
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4">Usage Statistics</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Total Builds</span>
              <span className="text-white font-semibold">{stats?.usage.totalBuilds || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Completed</span>
              <span className="text-green-400 font-semibold">{stats?.usage.completedBuilds || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Failed</span>
              <span className="text-red-400 font-semibold">{stats?.usage.failedBuilds || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Total Downloads</span>
              <span className="text-purple-400 font-semibold">{stats?.usage.totalDownloads || 0}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4">Plan Limits</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Plan</span>
              <span className="text-white font-semibold capitalize">{stats?.limits.plan || 'Free'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Builds This Month</span>
              <span className="text-white font-semibold">{stats?.usage.buildsThisMonth} / {stats?.limits.maxBuildsPerMonth}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Storage Used</span>
              <span className="text-white font-semibold">{stats?.usage.storageUsed || '0 MB'} / {stats?.limits.maxStorageMB} MB</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2 mt-4">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                style={{ width: `${(stats?.usage.buildsThisMonth / stats?.limits.maxBuildsPerMonth * 100) || 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
        <p className="text-gray-400">Build history and activity logs coming soon...</p>
      </div>
    </motion.div>
  );
}

function SettingsPanel({ user }: { user: any }) {
  const router = useRouter();
  
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h2 className="text-3xl font-bold text-white mb-8">Settings</h2>
      
      <div className="space-y-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4">Account Information</h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-400">Email</label>
              <p className="text-white">{user.email}</p>
            </div>
            <div>
              <label className="text-sm text-gray-400">Plan</label>
              <p className="text-white capitalize">{user.subscription?.plan || 'Free'}</p>
            </div>
            <div>
              <label className="text-sm text-gray-400">Member Since</label>
              <p className="text-white">{new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4">Subscription</h3>
          {user.subscription?.plan === 'free' ? (
            <div>
              <p className="text-gray-400 mb-4">Upgrade to Pro for unlimited builds and features!</p>
              <button 
                onClick={() => router.push('/pricing')}
                className="btn-primary"
              >
                <CreditCard className="w-5 h-5 inline mr-2" />
                Upgrade to Pro
              </button>
            </div>
          ) : (
            <div>
              <p className="text-gray-400 mb-2">You're on the Pro plan</p>
              <p className="text-sm text-gray-500">Next billing date: {user.subscription?.currentPeriodEnd ? new Date(user.subscription.currentPeriodEnd).toLocaleDateString() : 'N/A'}</p>
              <button className="mt-4 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition">
                Cancel Subscription
              </button>
            </div>
          )}
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4">Danger Zone</h3>
          <button className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition">
            Delete Account
          </button>
        </div>
      </div>
    </motion.div>
  );
}
