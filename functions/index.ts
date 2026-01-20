/**
 * Firebase Cloud Functions for StudyClub24
 * 
 * To deploy:
 * 1. Install Firebase CLI: npm install -g firebase-tools
 * 2. Login: firebase login
 * 3. Deploy: firebase deploy --only functions
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as crypto from 'crypto';

// Initialize Firebase Admin
admin.initializeApp();
const db = admin.firestore();

// Load environment variables
import * as dotenv from 'dotenv';
dotenv.config();

// Razorpay configuration
const getRazorpayConfig = () => ({
  key_id: process.env.RAZORPAY_KEY_ID || functions.config().razorpay?.key_id || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || functions.config().razorpay?.key_secret || '',
});

/**
 * Scheduled function to check for expired subscriptions
 * Runs every day at midnight UTC
 */
export const checkExpiredSubscriptions = functions.pubsub
  .schedule('0 0 * * *') // Every day at midnight UTC
  .timeZone('UTC')
  .onRun(async (context) => {
    const now = new Date();
    
    try {
      // Query all active subscriptions
      const subscriptionsRef = db.collection('subscriptions');
      const snapshot = await subscriptionsRef
        .where('status', '==', 'active')
        .get();

      if (snapshot.empty) {
        console.log('No active subscriptions found');
        return null;
      }

      const batch = db.batch();
      let expiredCount = 0;

      snapshot.forEach((doc) => {
        const subscription = doc.data();
        const expiryDate = new Date(subscription.expiryDate);

        // Check if subscription has expired
        if (expiryDate <= now) {
          console.log(`Expiring subscription for user: ${doc.id}`);
          
          // Update subscription status to expired
          batch.update(doc.ref, {
            status: 'expired',
            updatedAt: now.toISOString()
          });
          
          expiredCount++;
        }
      });

      // Commit all updates
      if (expiredCount > 0) {
        await batch.commit();
        console.log(`Successfully expired ${expiredCount} subscriptions`);
      } else {
        console.log('No subscriptions to expire');
      }

      return null;
    } catch (error) {
      console.error('Error checking expired subscriptions:', error);
      throw error;
    }
  });

/**
 * HTTP function to manually trigger expiry check
 * For testing purposes
 */
export const manualCheckExpiredSubscriptions = functions.https.onRequest(
  async (req, res) => {
    const now = new Date();
    
    try {
      const subscriptionsRef = db.collection('subscriptions');
      const snapshot = await subscriptionsRef
        .where('status', '==', 'active')
        .get();

      if (snapshot.empty) {
        res.json({ message: 'No active subscriptions found', expired: 0 });
        return;
      }

      const batch = db.batch();
      let expiredCount = 0;

      snapshot.forEach((doc) => {
        const subscription = doc.data();
        const expiryDate = new Date(subscription.expiryDate);

        if (expiryDate <= now) {
          batch.update(doc.ref, {
            status: 'expired',
            updatedAt: now.toISOString()
          });
          expiredCount++;
        }
      });

      if (expiredCount > 0) {
        await batch.commit();
      }

      res.json({
        message: `Successfully expired ${expiredCount} subscriptions`,
        expired: expiredCount,
        checked: snapshot.size
      });
    } catch (error: any) {
      console.error('Error:', error);
      res.status(500).json({ error: error.message });
    }
  }
);

/**
 * Function triggered when a new subscription is created
 * Can be used for sending confirmation emails, analytics, etc.
 */
export const onSubscriptionCreated = functions.firestore
  .document('subscriptions/{userId}')
  .onCreate(async (snapshot, context) => {
    const subscription = snapshot.data();
    const userId = context.params.userId;

    console.log(`New subscription created for user ${userId}:`, {
      planId: subscription.planId,
      expiryDate: subscription.expiryDate
    });

    // TODO: Send confirmation email
    // TODO: Track analytics event
    // TODO: Update user profile with plan details

    return null;
  });

/**
 * HTTP Function: Create Razorpay Order
 */
export const createOrder = functions.https.onRequest(async (req, res) => {
  // Set CORS headers for all origins
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.set('Access-Control-Max-Age', '3600');
  
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { amount, planId, userId } = req.body;

    console.log('Create order request:', { amount, planId, userId });

    if (!amount || !planId || !userId) {
      res.status(400).json({
        error: 'Missing required fields: amount, planId, userId'
      });
      return;
    }

    const Razorpay = require('razorpay');
    const razorpay = new Razorpay(getRazorpayConfig());

    const shortUserId = userId.substring(0, 8);
    const timestamp = Date.now().toString();
    const receipt = `rcpt_${timestamp}_${shortUserId}`.substring(0, 40);

    const options = {
      amount: amount ,//* 100,
      currency: 'INR',
      receipt: receipt,
      notes: { planId, userId },
    };

    console.log('Creating Razorpay order with options:', options);
    const order = await razorpay.orders.create(options);
    console.log('Order created successfully:', order.id);

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error: any) {
    console.error('Error creating order:', error);
    res.status(500).json({
      error: 'Failed to create order',
      message: error.message,
    });
  }
});

/**
 * HTTP Function: Verify Razorpay Payment
 */
export const verifyPayment = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.set('Access-Control-Max-Age', '3600');
  
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { orderId, paymentId, signature } = req.body;

    if (!orderId || !paymentId || !signature) {
      res.status(400).json({
        error: 'Missing required fields: orderId, paymentId, signature'
      });
      return;
    }

    const generatedSignature = crypto
      .createHmac('sha256', getRazorpayConfig().key_secret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    if (generatedSignature === signature) {
      res.json({
        verified: true,
        message: 'Payment verified successfully'
      });
    } else {
      res.status(400).json({
        verified: false,
        error: 'Invalid signature'
      });
    }
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    res.status(500).json({
      error: 'Failed to verify payment',
      message: error.message
    });
  }
});

/**
 * HTTP Function: Health Check
 */
export const health = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'StudyClub24 API'
  });
});

/**
 * Function triggered when a subscription is updated
 * Can be used for monitoring status changes
 */
export const onSubscriptionUpdated = functions.firestore
  .document('subscriptions/{userId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();
    const userId = context.params.userId;

    // Check if status changed
    if (before.status !== after.status) {
      console.log(`Subscription status changed for user ${userId}:`, {
        from: before.status,
        to: after.status
      });

      // TODO: Send notification to user
      // TODO: Track analytics event
    }

    return null;
  });
