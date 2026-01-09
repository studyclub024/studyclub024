/**
 * Firebase Cloud Function to check and update expired subscriptions
 * Runs daily at midnight UTC
 * 
 * To deploy:
 * 1. Install Firebase CLI: npm install -g firebase-tools
 * 2. Login: firebase login
 * 3. Initialize functions: firebase init functions
 * 4. Deploy: firebase deploy --only functions
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin
admin.initializeApp();
const db = admin.firestore();

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
