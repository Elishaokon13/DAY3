import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

// Simple in-memory rate limiting
const rateLimit = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 5; // 5 requests per minute

// Validate card details
const validateCardDetails = (cardNumber: string, expiryDate: string, cvv: string) => {
  // Basic validation
  if (!cardNumber || !expiryDate || !cvv) {
    return false;
  }

  // Card number length validation
  const cleanCardNumber = cardNumber.replace(/\s+/g, '');
  if (cleanCardNumber.length < 13 || cleanCardNumber.length > 19) {
    return false;
  }

  // CVV length validation
  if (cvv.length < 3 || cvv.length > 4) {
    return false;
  }

  // Expiry date format validation
  const [month, year] = expiryDate.split('/');
  if (!month || !year || month.length !== 2 || year.length !== 2) {
    return false;
  }

  return true;
};

// Check rate limit
const checkRateLimit = (ip: string) => {
  const now = Date.now();
  const userLimit = rateLimit.get(ip);

  if (!userLimit) {
    rateLimit.set(ip, { count: 1, timestamp: now });
    return true;
  }

  if (now - userLimit.timestamp > RATE_LIMIT_WINDOW) {
    rateLimit.set(ip, { count: 1, timestamp: now });
    return true;
  }

  if (userLimit.count >= MAX_REQUESTS) {
    return false;
  }

  userLimit.count++;
  return true;
};

export async function POST(request: Request) {
  try {
    // Get client IP
    const headersList = headers();
    const ip = headersList.get('x-forwarded-for') || 'unknown';

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { amount, cardNumber, expiryDate, cvv, cardType } = body;

    // Validate amount
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    // Validate card details
    if (!validateCardDetails(cardNumber, expiryDate, cvv)) {
      return NextResponse.json(
        { error: 'Invalid card details' },
        { status: 400 }
      );
    }

    // TODO: Implement actual payment processing with a payment gateway
    // This is a mock implementation
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate successful payment
    const transactionId = `tx_${Math.random().toString(36).substring(7)}`;
    const timestamp = new Date().toISOString();

    // Log transaction (in a real app, this would go to a database)
    console.log('Transaction processed:', {
      transactionId,
      amount,
      cardType,
      timestamp,
      ip,
    });

    return NextResponse.json({
      success: true,
      transactionId,
      amount,
      timestamp,
    });
  } catch (error) {
    console.error('Payment processing error:', error);
    return NextResponse.json(
      { error: 'Payment processing failed' },
      { status: 500 }
    );
  }
} 