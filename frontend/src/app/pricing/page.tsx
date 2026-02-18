'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Check, Smartphone, Zap, Crown } from 'lucide-react';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-lg bg-white/5 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">Web2APK</span>
          </Link>
          <Link href="/login" className="btn-primary">Sign In</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold text-white mb-6"
          >
            Simple, Transparent Pricing
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-400"
          >
            Start free, upgrade when you need more builds
          </motion.p>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Free Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card relative"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                <Zap className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Free</h3>
                <p className="text-gray-400">Perfect to get started</p>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-white">$0</span>
                <span className="text-gray-400">/month</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              <Feature text="3 APK builds per month" />
              <Feature text="Basic features enabled" />
              <Feature text="App with watermark" />
              <Feature text="24-hour APK retention" />
              <Feature text="Community support" />
            </ul>

            <Link href="/register" className="btn-secondary w-full text-center">
              Get Started Free
            </Link>
          </motion.div>

          {/* Pro Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card relative border-2 border-purple-500"
          >
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium">
              Most Popular
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Pro</h3>
                <p className="text-gray-400">For serious creators</p>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-white">$9.99</span>
                <span className="text-gray-400">/month</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              <Feature text="Unlimited APK builds" highlight />
              <Feature text="All features enabled" highlight />
              <Feature text="No watermark" highlight />
              <Feature text="365-day APK retention" highlight />
              <Feature text="Priority build queue" highlight />
              <Feature text="Priority support" highlight />
              <Feature text="Custom domain support" highlight />
            </ul>

            <Link href="/register" className="btn-primary w-full text-center">
              Upgrade to Pro
            </Link>
          </motion.div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto mt-20">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <FAQItem
              question="Can I cancel anytime?"
              answer="Yes! You can cancel your subscription at any time from your dashboard. You'll retain access until the end of your billing period."
            />
            <FAQItem
              question="What happens when I reach my monthly limit on the free plan?"
              answer="You'll need to wait until next month or upgrade to Pro for unlimited builds. Your existing builds remain accessible."
            />
            <FAQItem
              question="Can I publish my APK to Google Play Store?"
              answer="Yes! All APKs are properly signed and can be published to the Play Store. You'll need a Google Play Developer account."
            />
            <FAQItem
              question="Do you offer refunds?"
              answer="We offer a 14-day money-back guarantee. If you're not satisfied, contact support for a full refund."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function Feature({ text, highlight }: { text: string; highlight?: boolean }) {
  return (
    <li className="flex items-start gap-3">
      <Check className={`w-5 h-5 mt-0.5 ${highlight ? 'text-purple-400' : 'text-green-400'}`} />
      <span className="text-gray-300">{text}</span>
    </li>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-white mb-2">{question}</h3>
      <p className="text-gray-400 leading-relaxed">{answer}</p>
    </div>
  );
}
