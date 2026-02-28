'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Smartphone, Plus, Download, Trash2, Clock, CheckCircle2, 
  XCircle, Loader2, Settings, LogOut, CreditCard, BarChart3,
  Globe, Image, Palette, Zap, Upload, Menu, X, HelpCircle,
  Package, TrendingUp, Users, Activity, FileText, Mail, ExternalLink,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { buildAPI, userAPI, authAPI } from '@/lib/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'new' | 'apps' | 'analytics' | 'history' | 'settings' | 'support'>('new');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
    enabled: !!user,
  });

  const { data: builds, isLoading: buildsLoading } = useQuery({
    queryKey: ['builds'],
    queryFn: async () => {
      const res = await buildAPI.getAll(1, 50);
      return res.data.builds;
    },
    enabled: !!user,
    refetchInterval: (query) => {
      const hasActiveBuilds = query.state.data?.some((b: any) => 
        b.status === 'building' || b.status === 'queued'
      );
      return hasActiveBuilds ? 3000 : false;
    },
  });

  const handleLogout = () => {
    authAPI.logout();
    router.push('/');
  };

  if (!user) return null;

  const completedBuilds = builds?.filter((b: any) => b.status === 'completed') || [];
  const activeBuilds = builds?.filter((b: any) => b.status === 'building' || b.status === 'queued') || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 glass border-b border-white/10 z-40">
        <div className="h-full px-6 flex items-center justify-between max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition text-white"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white hidden sm:inline">Web2APK</span>
            </Link>
          </div>
          
          {/* Center Navigation */}
          <nav className="hidden md:flex items-center gap-6 absolute left-1/2 transform -translate-x-1/2">
            <Link href="/" className="text-gray-300 hover:text-white transition">Home</Link>
            <Link href="/pricing" className="text-gray-300 hover:text-white transition">Pricing</Link>
            <Link href="/#features" className="text-gray-300 hover:text-white transition">Features</Link>
            <Link href="/#contact" className="text-gray-300 hover:text-white transition">Contact</Link>
          </nav>

          {/* Right Side - Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`fixed left-0 top-16 bottom-0 ${sidebarCollapsed ? 'w-20' : 'w-64'} glass border-r border-white/10 p-6 transition-all duration-300 z-30 overflow-y-auto ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        {/* Collapse Toggle Button - More visible */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="hidden lg:flex absolute -right-4 top-6 w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg items-center justify-center text-white hover:scale-110 transition-transform z-50"
        >
          {sidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>

        <nav className="space-y-2">
          <NavButton icon={Plus} label="New Build" active={activeTab === 'new'} onClick={() => setActiveTab('new')} collapsed={sidebarCollapsed} />
          <NavButton icon={Package} label="Apps List" active={activeTab === 'apps'} onClick={() => setActiveTab('apps')} badge={completedBuilds.length} collapsed={sidebarCollapsed} />
          <NavButton icon={BarChart3} label="Analytics" active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} collapsed={sidebarCollapsed} />
          <NavButton icon={Clock} label="Build History" active={activeTab === 'history'} onClick={() => setActiveTab('history')} badge={builds?.length} collapsed={sidebarCollapsed} />
          <NavButton icon={Settings} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} collapsed={sidebarCollapsed} />
          <NavButton icon={HelpCircle} label="Support" active={activeTab === 'support'} onClick={() => setActiveTab('support')} collapsed={sidebarCollapsed} />
        </nav>

        {/* Large spacing before user card */}
        <div className="h-24"></div>

        <div className="absolute bottom-6 left-6 right-6">
          {!sidebarCollapsed && (
            <div className="card p-4 mb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {user.email?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-white truncate text-sm">{user.email?.split('@')[0] || 'User'}</div>
                  <div className="text-xs text-gray-400 truncate">{user.email}</div>
                </div>
              </div>
              {(!user.subscription || user.subscription?.plan === 'free') && (
                <Link 
                  href="/pricing"
                  className="block w-full px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium text-center hover:opacity-90 transition"
                >
                  Upgrade to Pro
                </Link>
              )}
            </div>
          )}
          {sidebarCollapsed && (
            <div className="flex justify-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                {user.email?.[0]?.toUpperCase() || 'U'}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className={`pt-16 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'} min-h-screen flex flex-col transition-all duration-300`}>
        <div className="flex-1 p-6 lg:p-8">
          {/* Active Build Progress Banner */}
          {activeBuilds.length > 0 && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
              {activeBuilds.map((build: any) => (
                <div key={build.buildId} className="card bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                      <div>
                        <h3 className="text-white font-semibold">{build.appConfig?.appName || build.appName}</h3>
                        <p className="text-sm text-gray-400">{build.currentStep || 'Processing...'}</p>
                      </div>
                    </div>
                    <span className="text-blue-400 font-bold">{build.progress || 0}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${build.progress || 0}%` }}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
            <StatCard icon={Zap} label="Builds This Month" value={stats?.usage.buildsThisMonth || 0} color="purple" onClick={() => setActiveTab('history')} clickable />
            <StatCard icon={CheckCircle2} label="Completed" value={stats?.usage.completedBuilds || 0} color="green" onClick={() => setActiveTab('apps')} clickable hint="Click to download apps" />
            <StatCard icon={Clock} label="Active Builds" value={activeBuilds.length} color="blue" onClick={() => setActiveTab('history')} clickable />
            <StatCard icon={Download} label="Remaining" value={stats?.usage.remainingBuilds || 0} color="pink" onClick={() => setActiveTab('analytics')} clickable />
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'new' && <NewBuildForm key="new" />}
            {activeTab === 'apps' && <AppsList key="apps" builds={completedBuilds} loading={buildsLoading} />}
            {activeTab === 'analytics' && <Analytics key="analytics" stats={stats} />}
            {activeTab === 'history' && <BuildHistory key="history" builds={builds} loading={buildsLoading} />}
            {activeTab === 'settings' && <SettingsPanel key="settings" user={user} />}
            {activeTab === 'support' && <Support key="support" />}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <footer className="border-t border-white/10 mt-12 py-6 px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
            <div>© 2026 Web2APK. Turning websites into apps since 2026.</div>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition">Terms of Service</Link>
              <Link href="/#contact" className="hover:text-white transition">Contact Us</Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

function NavButton({ icon: Icon, label, active, onClick, badge, collapsed }: any) {
  return (
    <button 
      onClick={onClick} 
      className={`w-full flex items-center ${collapsed ? 'justify-center' : 'justify-between'} px-4 py-3 rounded-xl transition ${active ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
      title={collapsed ? label : undefined}
    >
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5" />
        {!collapsed && <span className="font-medium">{label}</span>}
      </div>
      {!collapsed && badge !== undefined && badge > 0 && <span className="px-2 py-0.5 rounded-full bg-white/20 text-xs font-bold">{badge}</span>}
    </button>
  );
}

function StatCard({ icon: Icon, label, value, color, onClick, clickable, hint }: any) {
  const colors: Record<string, string> = {
    purple: 'from-purple-500/20 to-purple-600/20 border-purple-500/30',
    green: 'from-green-500/20 to-green-600/20 border-green-500/30',
    blue: 'from-blue-500/20 to-blue-600/20 border-blue-500/30',
    pink: 'from-pink-500/20 to-pink-600/20 border-pink-500/30',
  };
  const iconColors: Record<string, string> = {
    purple: 'text-purple-400',
    green: 'text-green-400',
    blue: 'text-blue-400',
    pink: 'text-pink-400',
  };

  return (
    <motion.div whileHover={clickable ? { scale: 1.02, y: -2 } : {}} onClick={clickable ? onClick : undefined} className={`card bg-gradient-to-br ${colors[color] || colors.purple} border ${clickable ? 'cursor-pointer' : ''} group relative`} title={hint}>
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl bg-white/10 ${iconColors[color] || iconColors.purple}`}>
          <Icon className="w-6 h-6" />
        </div>
        {clickable && <div className="opacity-0 group-hover:opacity-100 transition text-gray-400 text-xs">Click</div>}
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-gray-400">{label}</div>
    </motion.div>
  );
}

function NewBuildForm() {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
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
      toast.success('Build started successfully! Check Build History for progress.');
      queryClient.invalidateQueries({ queryKey: ['builds'] });
      queryClient.invalidateQueries({ queryKey: ['user-stats'] });
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
    formData.append('splashBackground', data.splashBackground || '#6366f1');
    if (data.appIcon?.[0]) formData.append('appIcon', data.appIcon[0]);
    if (data.splashImage?.[0]) formData.append('splashImage', data.splashImage[0]);
    formData.append('features', JSON.stringify(features));
    createBuildMutation.mutate(formData);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white">Create New APK</h2>
          <p className="text-gray-400 mt-1">Convert your website into a professional Android app</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="card max-w-3xl">
        <div className="space-y-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              <Globe className="w-4 h-4" />Website URL
            </label>
            <input {...register('websiteUrl', { required: 'Website URL is required', pattern: { value: /^https?:\/\/.+/, message: 'Must be a valid URL' } })} type="url" placeholder="https://example.com" className="input" />
            {errors.websiteUrl && <p className="mt-1 text-sm text-red-400">{errors.websiteUrl.message as string}</p>}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              <Smartphone className="w-4 h-4" />App Name
            </label>
            <input {...register('appName', { required: 'App name is required', minLength: { value: 2, message: 'Min 2 characters' } })} type="text" placeholder="My Awesome App" className="input" />
            {errors.appName && <p className="mt-1 text-sm text-red-400">{errors.appName.message as string}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">Package Name <span className="text-gray-500">(optional)</span></label>
            <input {...register('packageName')} type="text" placeholder="com.example.myapp" className="input" />
            <p className="mt-1 text-xs text-gray-500">Leave empty to auto-generate</p>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              <Image className="w-4 h-4" />App Icon <span className="text-gray-500">(PNG, max 5MB)</span>
            </label>
            <input {...register('appIcon')} type="file" accept="image/png,image/jpeg" className="input" />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              <Palette className="w-4 h-4" />Splash Background Color
            </label>
            <input {...register('splashBackground')} type="color" defaultValue="#6366f1" className="input h-12" />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300 mb-3 block">Features</label>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(features).map(([key, value]) => (
                <label key={key} className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition">
                  <input type="checkbox" checked={value} onChange={(e) => setFeatures({ ...features, [key]: e.target.checked })} className="w-5 h-5 rounded bg-white/10 border-white/20" />
                  <span className="text-white capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                </label>
              ))}
            </div>
          </div>

          <button type="submit" disabled={createBuildMutation.isPending} className="w-full btn-primary flex items-center justify-center gap-2 py-4">
            {createBuildMutation.isPending ? <><Loader2 className="w-5 h-5 animate-spin" />Creating APK...</> : <><Plus className="w-5 h-5" />Create APK</>}
          </button>
        </div>
      </form>
    </motion.div>
  );
}

function AppsList({ builds, loading }: any) {
  const downloadAPK = async (buildId: string, appName: string) => {
    try {
      console.log('=== DOWNLOAD DEBUG ===');
      console.log('Build ID:', buildId);
      
      // Fetch fresh build data from API (avoid cache issues)
      toast.loading('Fetching build data...', { id: 'download' });
      
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      
      const response = await fetch(`${apiUrl}/api/builds/${buildId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch build data');
      }
      
      const data = await response.json();
      console.log('Full API response:', data);
      console.log('Response keys:', Object.keys(data));
      
      // Try different possible response structures
      const build = data.data?.build || data.build || data.data || data;
      
      console.log('Extracted build:', build);
      console.log('Build keys:', Object.keys(build));
      console.log('Build output:', build?.output);
      console.log('Build.output keys:', build?.output ? Object.keys(build.output) : 'NO OUTPUT');
      console.log('APK Path:', build?.output?.apkPath);
      console.log('Build status:', build?.status);
      
      if (!build) {
        console.error('Build not found in response');
        toast.error('Build not found', { id: 'download' });
        return;
      }
      
      // Check if build has output
      if (!build.output || typeof build.output !== 'object') {
        console.error('Build has no output object. Full build:', JSON.stringify(build, null, 2));
        toast.error('Build incomplete - no output data. Database may not be updated yet. Try refreshing.', { id: 'download' });
        return;
      }
      
      if (!build.output.apkPath) {
        console.error('Build output has no apkPath. Output:', build.output);
        toast.error('APK path not found - build may have failed', { id: 'download' });
        return;
      }

      if (build.status !== 'completed') {
        console.warn('Build status is:', build.status);
        toast.error(`Build status: ${build.status}. Please wait for completion.`, { id: 'download' });
        return;
      }

      toast.loading('Starting download...', { id: 'download' });

      const cloudinaryUrl = build.output.apkPath;
      console.log('Cloudinary URL:', cloudinaryUrl);

      // Method 1: Try direct download with fetch
      try {
        console.log('Attempting fetch download...');
        const downloadResponse = await fetch(cloudinaryUrl);
        
        console.log('Fetch response status:', downloadResponse.status);
        console.log('Fetch response ok:', downloadResponse.ok);
        
        if (!downloadResponse.ok) {
          throw new Error(`Fetch failed with status ${downloadResponse.status}`);
        }

        const blob = await downloadResponse.blob();
        console.log('Blob created, size:', blob.size, 'type:', blob.type);
        
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${appName.replace(/[^a-z0-9]/gi, '_')}.apk`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        console.log('✅ Download successful via fetch');
        toast.success('APK downloaded successfully!', { id: 'download' });
      } catch (fetchError) {
        console.warn('Fetch method failed:', fetchError);
        console.log('Trying fallback: window.open...');
        
        // Method 2: Fallback to direct link (opens in new tab)
        window.open(cloudinaryUrl, '_blank');
        console.log('✅ Opened in new tab');
        toast.success('Download started in new tab!', { id: 'download' });
      }

    } catch (error: any) {
      console.error('=== DOWNLOAD ERROR ===');
      console.error('Error:', error);
      console.error('Stack:', error.stack);
      toast.error('Download failed. Check console for details.', { id: 'download' });
    }
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-purple-500" /></div>;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white">Your Apps</h2>
          <p className="text-gray-400 mt-1">{builds?.length || 0} completed app{builds?.length !== 1 ? 's' : ''} ready to download</p>
        </div>
      </div>

      {!builds || builds.length === 0 ? (
        <div className="card text-center py-12">
          <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No apps yet</h3>
          <p className="text-gray-400 mb-6">Create your first APK to see it here!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {builds.map((build: any) => (
            <motion.div key={build.id} whileHover={{ y: -4 }} className="card group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Smartphone className="w-6 h-6 text-white" />
                </div>
                <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-medium">Ready</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2 truncate">{build.appConfig?.appName || build.appName}</h3>
              <p className="text-sm text-gray-400 mb-1 truncate">{build.appConfig?.websiteUrl || build.websiteUrl}</p>
              <p className="text-xs text-gray-500 mb-4">{build.apkSizeFormatted || 'N/A'} • {new Date(build.createdAt).toLocaleDateString()}</p>
              <button onClick={() => downloadAPK(build.buildId, build.appConfig?.appName || build.appName)} className="w-full btn-primary flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />Download APK
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function BuildHistory({ builds, loading }: any) {
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
      console.log('=== DOWNLOAD DEBUG ===');
      console.log('Build ID:', buildId);
      
      // Fetch fresh build data from API (avoid cache issues)
      toast.loading('Fetching build data...', { id: 'download' });
      
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      
      const response = await fetch(`${apiUrl}/api/builds/${buildId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch build data');
      }
      
      const data = await response.json();
      const build = data.data?.build || data.build;
      
      console.log('Fresh build data:', build);
      console.log('Build output:', build?.output);
      console.log('APK Path:', build?.output?.apkPath);
      
      if (!build || !build.output || !build.output.apkPath) {
        toast.error('APK file not found. Try refreshing the page.', { id: 'download' });
        return;
      }

      toast.loading('Starting download...', { id: 'download' });

      const cloudinaryUrl = build.output.apkPath;
      console.log('Downloading from:', cloudinaryUrl);

      // Method 1: Try direct download with fetch
      try {
        const downloadResponse = await fetch(cloudinaryUrl);
        
        if (!downloadResponse.ok) {
          throw new Error('Fetch failed');
        }

        const blob = await downloadResponse.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${appName.replace(/[^a-z0-9]/gi, '_')}.apk`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        toast.success('APK downloaded successfully!', { id: 'download' });
      } catch (fetchError) {
        console.warn('Fetch method failed, trying direct link:', fetchError);
        
        // Method 2: Fallback to direct link (opens in new tab)
        window.open(cloudinaryUrl, '_blank');
        toast.success('Download started in new tab!', { id: 'download' });
      }

    } catch (error: any) {
      console.error('Download error:', error);
      toast.error('Download failed. Please try again.', { id: 'download' });
    }
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-purple-500" /></div>;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h2 className="text-3xl font-bold text-white mb-8">Build History</h2>
      <div className="space-y-4">
        {builds?.map((build: any) => (
          <div key={build.id} className="card flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold text-white">{build.appConfig?.appName || build.appName}</h3>
                <StatusBadge status={build.status} />
              </div>
              <p className="text-sm text-gray-400 mb-2">{build.appConfig?.websiteUrl || build.websiteUrl}</p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                <span>{new Date(build.createdAt).toLocaleDateString()}</span>
                {build.apkSizeFormatted && <span>{build.apkSizeFormatted}</span>}
                {build.durationFormatted && <span>{build.durationFormatted}</span>}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {build.status === 'completed' && (
                <button onClick={() => downloadAPK(build.buildId, build.appConfig?.appName || build.appName)} className="btn-secondary p-3" title="Download APK">
                  <Download className="w-5 h-5" />
                </button>
              )}
              <button onClick={() => deleteBuild.mutate(build.buildId)} className="p-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition" title="Delete Build">
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
  const Icon = config.icon;

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg bg-${config.color}-500/10 text-${config.color}-400`}>
      <Icon className={`w-4 h-4 ${status === 'building' ? 'animate-spin' : ''}`} />
      <span className="text-sm font-medium">{config.label}</span>
    </div>
  );
}

function Analytics({ stats }: any) {
  if (!stats) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-3xl font-bold text-white mb-8">Analytics</h2>
        <div className="card text-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500 mx-auto mb-4" />
          <p className="text-gray-400">Loading analytics...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h2 className="text-3xl font-bold text-white mb-8">Analytics</h2>
      
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-400" />
            Usage Statistics
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Total Builds</span>
              <span className="text-white font-semibold">{stats.usage?.totalBuilds || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Completed</span>
              <span className="text-green-400 font-semibold">{stats.usage?.completedBuilds || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Failed</span>
              <span className="text-red-400 font-semibold">{stats.usage?.failedBuilds || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Total Downloads</span>
              <span className="text-purple-400 font-semibold">{stats.usage?.totalDownloads || 0}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            Plan Limits
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Current Plan</span>
              <span className="text-white font-semibold capitalize">{stats.limits?.plan || 'Free'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Builds This Month</span>
              <span className="text-white font-semibold">{stats.usage?.buildsThisMonth || 0} / {stats.limits?.maxBuildsPerMonth || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Storage Used</span>
              <span className="text-white font-semibold">{stats.usage?.storageUsed || '0 MB'} / {stats.limits?.maxStorageMB || 0} MB</span>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Usage</span>
                <span>{Math.round((stats.usage?.buildsThisMonth || 0) / (stats.limits?.maxBuildsPerMonth || 1) * 100)}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{ width: `${Math.min((stats.usage?.buildsThisMonth || 0) / (stats.limits?.maxBuildsPerMonth || 1) * 100, 100)}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-4">Performance Insights</h3>
        <p className="text-gray-400">Detailed analytics and insights coming soon...</p>
      </div>
    </motion.div>
  );
}

function SettingsPanel({ user }: any) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h2 className="text-3xl font-bold text-white mb-8">Settings</h2>
      
      <div className="space-y-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4">Account Information</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 block mb-1">Email Address</label>
              <p className="text-white">{user.email}</p>
            </div>
            <div>
              <label className="text-sm text-gray-400 block mb-1">Subscription Plan</label>
              <p className="text-white capitalize">{user.subscription?.plan || 'Free'}</p>
            </div>
            <div>
              <label className="text-sm text-gray-400 block mb-1">Member Since</label>
              <p className="text-white">{user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Unknown'}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4">Subscription Management</h3>
          {(!user.subscription || user.subscription?.plan === 'free') ? (
            <div>
              <p className="text-gray-400 mb-4">Unlock unlimited builds, priority support, and advanced features with Pro!</p>
              <Link href="/pricing" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:opacity-90 transition">
                <CreditCard className="w-5 h-5" />
                Upgrade to Pro
              </Link>
            </div>
          ) : (
            <div>
              <p className="text-gray-400 mb-2">You're currently on the <span className="text-white font-semibold">Pro Plan</span></p>
              {user.subscription?.currentPeriodEnd && (
                <p className="text-sm text-gray-500 mb-4">Next billing: {new Date(user.subscription.currentPeriodEnd).toLocaleDateString()}</p>
              )}
              <button className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition">
                Manage Subscription
              </button>
            </div>
          )}
        </div>

        <div className="card border-red-500/20">
          <h3 className="text-lg font-semibold text-white mb-4">Danger Zone</h3>
          <p className="text-gray-400 text-sm mb-4">Once you delete your account, there is no going back. Please be certain.</p>
          <button className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition">
            Delete Account
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function Support() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h2 className="text-3xl font-bold text-white mb-8">Support & Help</h2>
      
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Link href="/#contact" className="card group hover:border-purple-500/50 transition">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
              <Mail className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-400 transition">Contact Us</h3>
              <p className="text-gray-400 text-sm">Get in touch with our support team</p>
            </div>
            <ExternalLink className="w-5 h-5 text-gray-500 group-hover:text-purple-400 transition" />
          </div>
        </Link>

        <a href="/#faq" className="card group hover:border-blue-500/50 transition">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition">FAQ</h3>
              <p className="text-gray-400 text-sm">Find answers to common questions</p>
            </div>
            <ExternalLink className="w-5 h-5 text-gray-500 group-hover:text-blue-400 transition" />
          </div>
        </a>

        <a href="/#features" className="card group hover:border-green-500/50 transition">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-green-500/10 text-green-400">
              <FileText className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-green-400 transition">Documentation</h3>
              <p className="text-gray-400 text-sm">Learn how to use Web2APK</p>
            </div>
            <ExternalLink className="w-5 h-5 text-gray-500 group-hover:text-green-400 transition" />
          </div>
        </a>

        <div className="card group hover:border-pink-500/50 transition cursor-pointer">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-pink-500/10 text-pink-400">
              <Users className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-pink-400 transition">Community</h3>
              <p className="text-gray-400 text-sm">Join our developer community</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Tips</h3>
        <ul className="space-y-3 text-gray-400">
          <li className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
            <span>Make sure your website is mobile-responsive for the best app experience</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
            <span>Use high-quality PNG icons (512x512) for best results</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
            <span>Test your APK on a physical Android device before publishing</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
            <span>Build times vary from 3-10 minutes depending on complexity</span>
          </li>
        </ul>
      </div>
    </motion.div>
  );
}
