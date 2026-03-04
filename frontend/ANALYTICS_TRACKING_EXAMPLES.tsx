/**
 * Google Analytics Event Tracking Examples
 * 
 * Copy these snippets into your components to track important user actions
 */

import { trackEvent } from '@/components/GoogleAnalytics';

// ========================================
// EXAMPLE 1: Track Build Creation
// ========================================
// Add to: frontend/src/app/dashboard/page.tsx
// In the handleSubmit or createBuild function

const handleCreateBuild = async (data) => {
  try {
    const response = await buildAPI.create(data);
    
    // Track successful build creation
    trackEvent('build_created', {
      app_name: data.appName,
      website_url: data.websiteUrl,
      has_custom_icon: !!data.appIcon,
      has_splash_image: !!data.splashImage,
      user_plan: user.subscription.plan // 'free' or 'pro'
    });
    
    toast.success('Build created successfully!');
  } catch (error) {
    toast.error('Failed to create build');
  }
};

// ========================================
// EXAMPLE 2: Track APK Download
// ========================================
// Add to: frontend/src/app/dashboard/page.tsx
// In the downloadAPK function

const downloadAPK = async (buildId: string, appName: string) => {
  try {
    // ... download logic ...
    
    // Track successful download
    trackEvent('apk_download', {
      build_id: buildId,
      app_name: appName,
      file_size_mb: (build.output.apkSize / (1024 * 1024)).toFixed(2)
    });
    
    toast.success('APK downloaded successfully!');
  } catch (error) {
    toast.error('Download failed');
  }
};

// ========================================
// EXAMPLE 3: Track User Signup
// ========================================
// Add to: frontend/src/app/signup/page.tsx

const handleSignup = async (data) => {
  try {
    const response = await authAPI.signup(data);
    
    // Track signup
    trackEvent('sign_up', {
      method: 'email',
      timestamp: new Date().toISOString()
    });
    
    router.push('/dashboard');
  } catch (error) {
    toast.error('Signup failed');
  }
};

// ========================================
// EXAMPLE 4: Track Login
// ========================================
// Add to: frontend/src/app/login/page.tsx

const handleLogin = async (data) => {
  try {
    const response = await authAPI.login(data);
    
    // Track login
    trackEvent('login', {
      method: 'email'
    });
    
    router.push('/dashboard');
  } catch (error) {
    toast.error('Login failed');
  }
};

// ========================================
// EXAMPLE 5: Track Upgrade to Pro
// ========================================
// Add to: frontend/src/app/pricing/page.tsx or wherever upgrade happens

const handleUpgrade = async () => {
  try {
    // ... payment processing ...
    
    // Track successful upgrade (conversion!)
    trackEvent('purchase', {
      transaction_id: paymentId,
      value: 29.99,
      currency: 'USD',
      items: [{
        item_id: 'pro_plan_monthly',
        item_name: 'Pro Plan - Monthly',
        price: 29.99,
        quantity: 1
      }]
    });
    
    toast.success('Upgraded to Pro!');
  } catch (error) {
    toast.error('Upgrade failed');
  }
};

// ========================================
// EXAMPLE 6: Track Build Completion
// ========================================
// Add to: frontend/src/app/dashboard/page.tsx
// In polling or WebSocket handler when build completes

const onBuildComplete = (build) => {
  trackEvent('build_completed', {
    build_id: build.buildId,
    app_name: build.appConfig.appName,
    build_duration_seconds: build.buildTime.duration,
    apk_size_mb: (build.output.apkSize / (1024 * 1024)).toFixed(2),
    success: true
  });
  
  toast.success('Build completed!');
};

// ========================================
// EXAMPLE 7: Track Build Failure
// ========================================

const onBuildFailed = (build) => {
  trackEvent('build_failed', {
    build_id: build.buildId,
    app_name: build.appConfig.appName,
    error_message: build.error.message,
    build_duration_seconds: build.buildTime.duration
  });
  
  toast.error('Build failed');
};

// ========================================
// EXAMPLE 8: Track File Upload
// ========================================
// When user uploads app icon or splash image

const handleIconUpload = (file) => {
  trackEvent('file_upload', {
    file_type: 'app_icon',
    file_size_kb: (file.size / 1024).toFixed(2),
    file_format: file.type
  });
};

// ========================================
// EXAMPLE 9: Track Page Views (Specific Pages)
// ========================================
// Add to important pages like pricing, features

useEffect(() => {
  trackEvent('page_view', {
    page_path: window.location.pathname,
    page_title: document.title
  });
}, []);

// ========================================
// EXAMPLE 10: Track Search (if you add search)
// ========================================

const handleSearch = (query) => {
  trackEvent('search', {
    search_term: query,
    search_location: 'dashboard'
  });
};

// ========================================
// EXAMPLE 11: Track Button Clicks
// ========================================

<button 
  onClick={() => {
    trackEvent('button_click', {
      button_name: 'view_pricing',
      button_location: 'dashboard_header'
    });
    router.push('/pricing');
  }}
>
  View Pricing
</button>

// ========================================
// EXAMPLE 12: Track Errors
// ========================================

try {
  // ... some operation ...
} catch (error) {
  trackEvent('error', {
    error_message: error.message,
    error_location: 'build_creation',
    user_id: user.id
  });
  
  toast.error('An error occurred');
}

// ========================================
// STANDARD GOOGLE ANALYTICS EVENTS
// ========================================
// Use these standard event names when possible:

// E-commerce events:
// - 'add_to_cart'
// - 'begin_checkout'
// - 'purchase'
// - 'refund'

// Engagement events:
// - 'page_view'
// - 'scroll'
// - 'search'
// - 'share'
// - 'sign_up'
// - 'login'

// Custom events (your app-specific):
// - 'build_created'
// - 'build_completed'
// - 'build_failed'
// - 'apk_download'
// - 'file_upload'
