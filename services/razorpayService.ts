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
  private isProcessingPayment: boolean = false;
  private currentOrderId: string | null = null;

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

  // Convert price string to paise and calculate monthly amount with GST
  getPriceInPaise(priceString: string, period: string): number {
    // Remove ₹ symbol and convert to number
    const dailyPrice = parseFloat(priceString.replace('₹', '').replace(',', ''));

    // If it's a daily rate, multiply by 30 days for monthly billing
    let monthlyPrice = dailyPrice;
    if (period.toLowerCase().includes('day')) {
      monthlyPrice = dailyPrice * 30;
    }

    // Add 18% GST
    const priceWithGST = monthlyPrice * 1.18 * 100;

    return Math.round(priceWithGST); // Convert to paise
  }

  // Initialize payment
  async initiatePayment(
    plan: SubscriptionPlan,
    userDetails: { name?: string; email?: string; phone?: string } = {}
  ): Promise<void> {
    console.log('🔵 Initiating payment for plan:', plan.id);

    // Reset payment processing flag and order ID for new payment
    this.isProcessingPayment = false;
    this.currentOrderId = null;

    // Load Razorpay script
    console.log('🔵 Loading Razorpay script...');
    const scriptLoaded = await this.loadScript();

    if (!scriptLoaded) {
      console.error('❌ Failed to load Razorpay script');
      this.showNotification('error', 'Connection Error', 'Failed to load Razorpay SDK. Please check your internet connection.');
      return;
    }
    console.log('✅ Razorpay script loaded successfully');

    // Skip payment for free plan
    if (plan.id === 'free') {
      console.log('🔵 Free plan selected, skipping payment');
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
        console.error('❌ User not logged in');
        this.showNotification('warning', 'Login Required', 'Please log in to continue with payment.');
        return;
      }
      console.log('🔵 User logged in:', currentUser.uid);

      const amount = this.getPriceInPaise(plan.price, plan.period);

      // Create order on backend - Use Firebase Functions URL
      // Use the Cloud Function URL directly for both dev and production to avoid routing issues
      const API_URL = 'https://us-central1-my-website-map-470209.cloudfunctions.net';
      console.log('🔵 API URL:', API_URL);
      console.log('🔵 Creating order...');

      const orderResponse = await fetch(`${API_URL}/createOrder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount, // Send paise directly
          planId: plan.id,
          userId: currentUser.uid,
        }),
      });

      console.log('🔵 Order response status:', orderResponse.status);
      if (!orderResponse.ok) {
        const errorText = await orderResponse.text();
        console.error('❌ Order creation failed:', errorText);
        throw new Error(`Failed to create order: ${errorText}`);
      }

      const orderData = await orderResponse.json();
      console.log('✅ Order created:', orderData);

      // Store current order ID to track this payment instance
      this.currentOrderId = orderData.orderId;

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
          // Only process if we have a valid response and it's for the current order
          if (response.razorpay_payment_id && response.razorpay_order_id === this.currentOrderId) {
            this.handlePaymentSuccess(response, plan);
          }
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on('payment.failed', (response: any) => {
        // Only process failure if it's for the current order
        if (response.error?.metadata?.order_id === this.currentOrderId) {
          this.handlePaymentFailure(response);
        }
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
      const API_URL = 'https://us-central1-my-website-map-470209.cloudfunctions.net';
      console.log('API URL:', API_URL);

      const verifyResponse = await fetch(`${API_URL}/verifyPayment`, {
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
    // Prevent double processing
    if (this.isProcessingPayment) {
      console.log('Payment already being processed, skipping...');
      return;
    }

    this.isProcessingPayment = true;

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

      // Update user profile with new plan
      const expiryDate = new Date(subscriptionData.expiryDate);
      const expiryStr = expiryDate.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      await db.collection('users').doc(currentUser.uid).update({
        subscriptionPlanId: plan.id,
        planExpiry: expiryStr,
        'stats.lastActiveDate': Date.now()
      });

      // Keep a copy in localStorage for quick access (not as source of truth)
      localStorage.setItem('subscriptionPlanId', plan.id);

      // Show success message
      this.showNotification('success', 'Payment Successful! 🎉', `Your ${plan.name} is now active.`);

      // Clear current order ID after successful processing
      this.currentOrderId = null;

      // No page reload - let Firestore listener update the UI automatically
    } catch (error: any) {
      console.error('Error saving subscription:', error);
      this.showNotification('error', 'Subscription Error', `Failed to save subscription: ${error.message || 'Unknown error'}. Please contact support.`);
    } finally {
      // Reset flag after processing is complete or failed
      this.isProcessingPayment = false;
      this.isProcessingPayment = false;
    }
  }

  // Handle payment failure
  private handlePaymentFailure(response: any) {
    // Only show failure if not already processing a successful payment
    if (this.isProcessingPayment) {
      console.log('Success already being processed, skipping failure notification');
      return;
    }

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
