'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Smartphone, Mail, Lock, User, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { authAPI } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  
  const password = watch('password');

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const response = await authAPI.register(data.name, data.email, data.password);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      toast.success('Account created successfully!');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center px-6 py-12">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Smartphone className="w-7 h-7 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">Web2APK</span>
        </Link>

        <div className="glass rounded-3xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-gray-400">Start building Android apps today</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  {...register('name', { 
                    required: 'Name is required',
                    minLength: { value: 2, message: 'Name must be at least 2 characters' }
                  })}
                  type="text"
                  placeholder="John Doe"
                  className="input pl-12"
                />
              </div>
              {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name.message as string}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email' }
                  })}
                  type="email"
                  placeholder="you@example.com"
                  className="input pl-12"
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email.message as string}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                      message: 'Password must contain uppercase, lowercase, and number'
                    }
                  })}
                  type="password"
                  placeholder="••••••••"
                  className="input pl-12"
                />
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password.message as string}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  {...register('confirmPassword', { 
                    required: 'Please confirm password',
                    validate: value => value === password || 'Passwords do not match'
                  })}
                  type="password"
                  placeholder="••••••••"
                  className="input pl-12"
                />
              </div>
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-400">{errors.confirmPassword.message as string}</p>}
            </div>

            <button type="submit" disabled={loading} className="w-full btn-primary flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" />Creating account...</> : 'Create Account'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
