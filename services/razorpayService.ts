import { SubscriptionPlan } from '../types';
import { db, auth } from '../firebaseConfig';
import CryptoJS from 'crypto-js';

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id?: string;
  prefill: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme: {
    color: string;
  };
  handler: (response: RazorpayResponse) => void;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface SubscriptionData {
  userId: string;
  planId: string;
  planName: string;
  paymentId: string;
  orderId: string;
  signature: string;
  purchaseDate: string;
  expiryDate: string;
  status: 'active' | 'expired' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

declare global {
  interface Window {
    Razorpay: any;
    showNotification?: (type: 'success' | 'error' | 'warning', title: string, message: string) => void;
  }
}

class RazorpayService {
  private key: string;
  private keySecret: string;

  constructor() {
    // Add your Razorpay Key ID here
    // For testing, you can use test key: rzp_test_xxxxx
    // For production, use live key: rzp_live_xxxxx
    this.key = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_xxxxx';
    
    // NOTE: In production, signature verification MUST be done on backend
    // This is for demo purposes only - never expose key_secret in frontend
    this.keySecret = import.meta.env.VITE_RAZORPAY_KEY_SECRET || '';
  }

  private showNotification(type: 'success' | 'error' | 'warning', title: string, message: string) {
    if (window.showNotification) {
      window.showNotification(type, title, message);
    } else {
      // Fallback to alert if notification system not loaded
      alert(`${title}\n\n${message}`);
    }
  }

  // Load Razorpay script dynamically
  loadScript(): Promise<boolean> {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  // Convert price string to paise (Razorpay uses smallest currency unit)
  getPriceInPaise(priceString: string): number {
    // Remove ₹ symbol and convert to number
    const price = parseFloat(priceString.replace('₹', '').replace(',', ''));
    return Math.round(price * 100); // Convert to paise
  }

  // Initialize payment
  async initiatePayment(
    plan: SubscriptionPlan,
    userDetails: { name?: string; email?: string; phone?: string } = {}
  ): Promise<void> {
    // Load Razorpay script
    const scriptLoaded = await this.loadScript();
    
    if (!scriptLoaded) {
      this.showNotification('error', 'Connection Error', 'Failed to load Razorpay SDK. Please check your internet connection.');
      return;
    }

    // Skip payment for free plan
    if (plan.id === 'free') {
      this.handlePaymentSuccess(
        { 
          razorpay_payment_id: 'free_plan', 
          razorpay_order_id: 'free_order', 
          razorpay_signature: 'free_signature' 
        }, 
        plan
      );
      return;
    }

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        this.showNotification('warning', 'Login Required', 'Please log in to continue with payment.');
        return;
      }

      const amount = this.getPriceInPaise(plan.price);

      // Create order on backend
      const API_URL = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:3001' : window.location.origin);
      const orderResponse = await fetch(`${API_URL}/api/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount / 100, // Convert back to rupees
          planId: plan.id,
          userId: currentUser.uid,
        }),
      });

      if (!orderResponse.ok) {
        throw new Error('Failed to create order');
      }

      const orderData = await orderResponse.json();

      const options: RazorpayOptions = {
        key: this.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'StudyClub24',
        description: `${plan.name} - ${plan.period}`,
        order_id: orderData.orderId,
        prefill: {
          name: userDetails.name || '',
          email: userDetails.email || '',
          contact: userDetails.phone || '',
        },
        theme: {
          color: '#6366f1', // Indigo color
        },
        handler: async (response: RazorpayResponse) => {
          // Verify payment on backend before processing
          await this.verifyPaymentOnBackend(response);
          this.handlePaymentSuccess(response, plan);
        },
      };

      const razorpay = new window.Razorpay(options);
      
      razorpay.on('payment.failed', (response: any) => {
        this.handlePaymentFailure(response);
      });

      razorpay.open();
    } catch (error: any) {
      this.showNotification('error', 'Payment Error', `Error initializing payment: ${error.message}`);
    }
  }

  // Verify payment on backend
  private async verifyPaymentOnBackend(response: RazorpayResponse): Promise<boolean> {
    try {
      console.log('Verifying payment on backend...');
      const API_URL = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:3001' : window.location.origin);
      console.log('API URL:', API_URL);
      
      const verifyResponse = await fetch(`${API_URL}/api/verify-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: response.razorpay_order_id,
          paymentId: response.razorpay_payment_id,
          signature: response.razorpay_signature,
        }),
      });

      const result = await verifyResponse.json();
      console.log('Backend verification result:', result);
      return result.verified === true;
    } catch (error) {
      console.error('Backend verification failed:', error);
      return false;
    }
  }

  // Verify Razorpay signature
  private verifySignature(orderId: string, paymentId: string, signature: string): boolean {
    // Skip frontend verification - rely on backend only
    console.log('Skipping frontend signature verification');
    return true;
  }

  // Handle successful payment
  private async handlePaymentSuccess(response: RazorpayResponse, plan: SubscriptionPlan) {
    try {
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        this.showNotification('error', 'Authentication Error', 'Please log in and try again.');
        return;
      }

      // Verify payment on backend first
      const isBackendVerified = await this.verifyPaymentOnBackend(response);

      if (!isBackendVerified && plan.id !== 'free') {
        console.error('Backend verification failed');
        this.showNotification('error', 'Verification Failed', 'Payment verification failed. Please contact support.');
        return;
      }

      console.log('Payment verified successfully');

      // Prepare subscription data
      const subscriptionData: SubscriptionData = {
        userId: currentUser.uid,
        planId: plan.id,
        planName: plan.name,
        paymentId: response.razorpay_payment_id,
        orderId: response.razorpay_order_id,
        signature: response.razorpay_signature,
        purchaseDate: new Date().toISOString(),
        expiryDate: this.calculateExpiryDate(plan.id),
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Store subscription in Firestore
      await db.collection('subscriptions').doc(currentUser.uid).set(subscriptionData);

      // Keep a copy in localStorage for quick access (not as source of truth)
      localStorage.setItem('subscriptionPlanId', plan.id);

      // Show success message
      this.showNotification('success', 'Payment Successful! 🎉', `Your ${plan.name} is now active.`);
      
      // Reload page after a delay to show the notification
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error: any) {
      console.error('Error saving subscription:', error);
      this.showNotification('error', 'Subscription Error', `Failed to save subscription: ${error.message || 'Unknown error'}. Please contact support.`);
    }
  }

  // Handle payment failure
  private handlePaymentFailure(response: any) {
    const errorMsg = response.error?.description || 'Payment failed. Please try again.';
    this.showNotification('error', 'Payment Failed', errorMsg);
  }

  // Calculate expiry date based on plan
  private calculateExpiryDate(planId: string): string {
    const now = new Date();
    
    switch (planId) {
      case 'crash-course':
      case 'instant-help':
      case 'focused-prep':
      case 'study-pro':
        now.setMonth(now.getMonth() + 1); // All plans are monthly
        break;
      default:
        // Free plan - never expires
        now.setFullYear(now.getFullYear() + 100);
    }
    
    return now.toISOString();
  }

  // Check if subscription is active
  async isSubscriptionActive(): Promise<boolean> {
    try {
      const currentUser = auth.currentUser;
      
      if (!currentUser) return false;

      const subscriptionDoc = await db.collection('subscriptions').doc(currentUser.uid).get();
      
      if (!subscriptionDoc.exists) return false;
      
      const subscription = subscriptionDoc.data() as SubscriptionData;
      const expiryDate = new Date(subscription.expiryDate);
      const now = new Date();
      
      return subscription.status === 'active' && expiryDate > now;
    } catch (error) {
      return false;
    }
  }

  // Get current subscription plan
  async getCurrentPlan(): Promise<string> {
    try {
      const currentUser = auth.currentUser;
      
      if (!currentUser) return 'free';

      const subscriptionDoc = await db.collection('subscriptions').doc(currentUser.uid).get();
      
      if (!subscriptionDoc.exists) return 'free';
      
      const subscription = subscriptionDoc.data() as SubscriptionData;
      
      // Check if expired
      const expiryDate = new Date(subscription.expiryDate);
      const now = new Date();
      
      if (subscription.status === 'active' && expiryDate > now) {
        return subscription.planId;
      }
      
      return 'free';
    } catch (error) {
      return 'free';
    }
  }

  // Get subscription details
  async getSubscriptionDetails(): Promise<SubscriptionData | null> {
    try {
      const currentUser = auth.currentUser;
      
      if (!currentUser) return null;

      const subscriptionDoc = await db.collection('subscriptions').doc(currentUser.uid).get();
      
      if (!subscriptionDoc.exists) return null;
      
      return subscriptionDoc.data() as SubscriptionData;
    } catch (error) {
      return null;
    }
  }

  // Cancel subscription
  async cancelSubscription(): Promise<void> {
    try {
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        this.showNotification('error', 'Authentication Error', 'User not authenticated.');
        return;
      }

      await db.collection('subscriptions').doc(currentUser.uid).update({
        status: 'cancelled',
        updatedAt: new Date().toISOString()
      });

      localStorage.removeItem('subscriptionPlanId');
      this.showNotification('success', 'Subscription Cancelled', 'You are now on the free plan.');
      window.location.reload();
    } catch (error) {
      this.showNotification('error', 'Cancellation Failed', 'Failed to cancel subscription. Please try again.');
    }
  }
}

export default new RazorpayService();
