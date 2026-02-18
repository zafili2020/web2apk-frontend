'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Smartphone, Zap, Shield, Code2, Download, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-lg bg-white/5 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">Web2APK</span>
          </motion.div>
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-gray-300 hover:text-white transition">Features</Link>
            <Link href="#pricing" className="text-gray-300 hover:text-white transition">Pricing</Link>
            <Link href="/about" className="text-gray-300 hover:text-white transition">About</Link>
            <Link href="/login" className="text-gray-300 hover:text-white transition">Login</Link>
            <Link 
              href="/register" 
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:shadow-lg hover:shadow-purple-500/50 transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-purple-300">No coding required</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                Turn Any Website Into An{' '}
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Android App
                </span>
              </h1>
              
              <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                Convert your website into a professional Android APK in minutes. 
                No coding skills needed. Just enter your URL and get a fully functional mobile app.
              </p>
              
              <div className="flex flex-wrap gap-4 mb-12">
                <Link 
                  href="/register"
                  className="group px-8 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:shadow-2xl hover:shadow-purple-500/50 transition flex items-center gap-2"
                >
                  Create Your App Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                </Link>
                <Link 
                  href="#demo"
                  className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition"
                >
                  Watch Demo
                </Link>
              </div>
              
              <div className="flex items-center gap-8 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <span>Free plan available</span>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Animated Preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10 bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
                <div className="bg-slate-900 rounded-2xl p-6 shadow-2xl">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="h-12 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg animate-pulse"></div>
                    <div className="h-12 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg animate-pulse delay-100"></div>
                    <div className="h-12 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg animate-pulse delay-200"></div>
                    
                    <button className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold flex items-center justify-center gap-2">
                      <Download className="w-5 h-5" />
                      Generate APK
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-3xl opacity-50"
              ></motion.div>
              <motion.div
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -bottom-8 -left-8 w-40 h-40 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full blur-3xl opacity-50"
              ></motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Professional features to create stunning Android apps from your website
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 hover:border-purple-500/50 transition-all hover:shadow-xl hover:shadow-purple-500/10"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-6 group-hover:scale-110 transition">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl rounded-3xl p-12 border border-white/10"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Build Your App?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join thousands of creators who have already converted their websites into apps
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition"
          >
            Start Building Now
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">Web2APK</span>
              </div>
              <p className="text-gray-400 text-sm">
                Convert websites to Android apps in minutes
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#features" className="hover:text-white transition">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-white transition">Pricing</Link></li>
                <li><Link href="/dashboard" className="hover:text-white transition">Dashboard</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/about" className="hover:text-white transition">About</Link></li>
                <li><Link href="#" className="hover:text-white transition">Blog</Link></li>
                <li><Link href="#" className="hover:text-white transition">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#" className="hover:text-white transition">Privacy</Link></li>
                <li><Link href="#" className="hover:text-white transition">Terms</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 text-center text-sm text-gray-400">
            © 2024 Web2APK. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Get your APK in just 2-5 minutes. Our optimized build process ensures quick turnaround times.'
  },
  {
    icon: Shield,
    title: 'Secure & Signed',
    description: 'All APKs are properly signed with secure keystores and follow Android best practices.'
  },
  {
    icon: Code2,
    title: 'No Coding Required',
    description: 'Simply enter your website URL. Our system handles all the technical complexity.'
  },
  {
    icon: Smartphone,
    title: 'Custom Branding',
    description: 'Add your own app icon, splash screen, and colors to match your brand identity.'
  },
  {
    icon: Download,
    title: 'Instant Download',
    description: 'Download your APK immediately after build completes. Share it or publish to Play Store.'
  },
  {
    icon: Sparkles,
    title: 'Advanced Features',
    description: 'Enable pull-to-refresh, file uploads, geolocation, and more with simple toggles.'
  }
];

const stats = [
  { value: '10K+', label: 'Apps Created' },
  { value: '5K+', label: 'Happy Users' },
  { value: '2-5min', label: 'Avg Build Time' },
  { value: '99.9%', label: 'Success Rate' }
];
