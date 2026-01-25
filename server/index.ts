import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from server/.env
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.raw({ type: 'application/json' })); // For webhook signature verification

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'StudyClub24 Payment Server Running' });
});

// Create Razorpay Order
app.post('/api/create-order', async (req: Request, res: Response) => {
  try {
    const { amount, planId, userId } = req.body;

    console.log('Create order request:', { amount, planId, userId });

    // Validate input
    if (!amount || !planId || !userId) {
      return res.status(400).json({ 
        error: 'Missing required fields: amount, planId, userId' 
      });
    }

    // Create Razorpay order
    // Receipt must be max 40 chars, so use timestamp + short user ID
    const shortUserId = userId.substring(0, 8);
    const timestamp = Date.now().toString();
    const receipt = `rcpt_${timestamp}_${shortUserId}`.substring(0, 40);
    
    const options = {
      amount: amount , //* 100, // Convert to paise
      currency: 'INR',
      receipt: receipt,
      notes: {
        planId,
        userId,
      },
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
    console.error('Error details:', JSON.stringify(error, null, 2));
    res.status(500).json({ 
      error: 'Failed to create order',
      message: error.message,
      details: error.error || error.description
    });
  }
});

// Verify Payment Signature
app.post('/api/verify-payment', async (req: Request, res: Response) => {
  try {
    const { orderId, paymentId, signature } = req.body;

    // Validate input
    if (!orderId || !paymentId || !signature) {
      return res.status(400).json({ 
        error: 'Missing required fields: orderId, paymentId, signature' 
      });
    }

    // Generate signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    // Verify signature
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

// Razorpay Webhook Handler
app.post('/api/razorpay-webhook', async (req: Request, res: Response) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers['x-razorpay-signature'] as string;

    // Verify webhook signature
    if (webhookSecret) {
      const generatedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(JSON.stringify(req.body))
        .digest('hex');

      if (generatedSignature !== signature) {
        return res.status(400).json({ error: 'Invalid webhook signature' });
      }
    }

    const event = req.body.event;
    const payload = req.body.payload;

    console.log('Webhook Event:', event);

    // Handle different webhook events
    switch (event) {
      case 'payment.captured':
        console.log('Payment captured:', payload.payment.entity.id);
        // Here you would update your Firestore database
        // with the payment confirmation
        break;

      case 'payment.failed':
        console.log('Payment failed:', payload.payment.entity.id);
        break;

      case 'order.paid':
        console.log('Order paid:', payload.order.entity.id);
        break;

      default:
        console.log('Unhandled event:', event);
    }

    res.json({ status: 'ok' });
  } catch (error: any) {
    console.error('Webhook error:', error);
    res.status(500).json({ 
      error: 'Webhook processing failed',
      message: error.message 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 StudyClub24 Payment Server`);
  console.log(`📡 Server running on http://localhost:${PORT}`);
  console.log(`💳 Razorpay Key: ${process.env.RAZORPAY_KEY_ID?.substring(0, 15)}...`);
  console.log(`\n✅ Endpoints:`);
  console.log(`   - GET  /api/health`);
  console.log(`   - POST /api/create-order`);
  console.log(`   - POST /api/verify-payment`);
  console.log(`   - POST /api/razorpay-webhook\n`);
});
