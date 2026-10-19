import crypto from "crypto";
import Razorpay from "razorpay";

export interface RazorpayConfig {
  keyId: string;
  keySecret: string;
  webhookSecret?: string;
}

/**
 * Validates and retrieves server-side Razorpay configuration.
 * Throws a clean, safe configuration error if credentials are not configured.
 * Never exposes secrets in logs or error messages.
 */
export function getRazorpayConfig(): RazorpayConfig {
  const keyId = process.env.RAZORPAY_KEY_ID?.trim();
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET?.trim();

  if (!keyId || !keySecret) {
    throw new Error(
      "Payment gateway configuration error: RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is not configured on the server."
    );
  }

  return {
    keyId,
    keySecret,
    webhookSecret,
  };
}

/**
 * Retrieves the public Razorpay Key ID for client Checkout invocation.
 */
export function getPublicRazorpayKeyId(): string {
  const { keyId } = getRazorpayConfig();
  return keyId;
}

/**
 * Initializes and returns an official Razorpay instance using validated server credentials.
 */
export function getRazorpayClient(): Razorpay {
  const { keyId, keySecret } = getRazorpayConfig();
  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
}

/**
 * Independently verifies the Razorpay payment checkout signature using constant-time comparison.
 * Razorpay generates signature as: HMAC-SHA256(order_id + "|" + payment_id, secret)
 */
export function verifyPaymentSignature(params: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  try {
    const { keySecret } = getRazorpayConfig();
    const payload = `${params.orderId}|${params.paymentId}`;
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(payload)
      .digest("hex");

    const expectedBuffer = Buffer.from(expectedSignature, "utf8");
    const providedBuffer = Buffer.from(params.signature, "utf8");

    if (expectedBuffer.length !== providedBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(expectedBuffer, providedBuffer);
  } catch {
    return false;
  }
}

/**
 * Independently verifies a Razorpay webhook raw-body signature using constant-time comparison.
 * Signature header: x-razorpay-signature
 * HMAC-SHA256(raw_request_body, webhook_secret)
 */
export function verifyWebhookSignature(
  rawBody: string,
  signature: string,
  customSecret?: string
): boolean {
  try {
    const webhookSecret =
      customSecret || process.env.RAZORPAY_WEBHOOK_SECRET?.trim();
    if (!webhookSecret) {
      console.error(
        "Razorpay Webhook Error: RAZORPAY_WEBHOOK_SECRET is not configured on the server."
      );
      return false;
    }

    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    const expectedBuffer = Buffer.from(expectedSignature, "utf8");
    const providedBuffer = Buffer.from(signature, "utf8");

    if (expectedBuffer.length !== providedBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(expectedBuffer, providedBuffer);
  } catch {
    return false;
  }
}
