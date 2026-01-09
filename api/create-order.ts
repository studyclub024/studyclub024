import type { VercelRequest, VercelResponse } from '@vercel/node';
import Razorpay from 'razorpay';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { amount, planId, userId } = req.body;

    console.log('Create order request:', { amount, planId, userId });

    // Validate input
    if (!amount || !planId || !userId) {
      return res.status(400).json({
        error: 'Missing required fields: amount, planId, userId'
      });
    }

    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || '',
      key_secret: process.env.RAZORPAY_KEY_SECRET || '',
    });

    // Create receipt (max 40 chars)
    const shortUserId = userId.substring(0, 8);
    const timestamp = Date.now().toString();
    const receipt = `rcpt_${timestamp}_${shortUserId}`.substring(0, 40);

    // Create Razorpay order
    const options = {
      amount: amount * 100, // Convert to paise
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

    return res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error: any) {
    console.error('Error creating order:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    return res.status(500).json({
      error: 'Failed to create order',
      message: error.message,
      details: error.error || error.description
    });
  }
}
