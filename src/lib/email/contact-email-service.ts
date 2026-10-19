import { CONTACT_EMAIL } from "@/components/customer/contact/contact-constants";

export interface ContactEmailPayload {
  fullName: string;
  email: string;
  phone?: string;
  inquiryType?: string;
  subject: string;
  message: string;
}

export interface SendEmailResult {
  success: boolean;
  referenceId?: string;
  messageId?: string;
  error?: string;
}

/**
 * Escapes user input to prevent HTML injection in emails.
 */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Generates an inquiry reference ID.
 */
export function generateInquiryReference(): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ST-INQ-${dateStr}-${randomSuffix}`;
}

/**
 * Builds the subject line formatted as:
 * [Samartha Trust Contact] {Inquiry Type}: {Subject}
 */
export function buildEmailSubject(
  inquiryType?: string,
  userSubject?: string
): string {
  const type = inquiryType?.trim() || "General Inquiry";
  const sub = userSubject?.trim() || `Inquiry regarding ${type}`;
  return `[Samartha Trust Contact] ${type}: ${sub}`;
}

/**
 * Builds a professional, mobile-friendly HTML email layout.
 */
export function buildContactEmailHtml(
  data: ContactEmailPayload,
  referenceId: string,
  submissionDate: string
): string {
  const safeName = escapeHtml(data.fullName.trim());
  const safeEmail = escapeHtml(data.email.trim());
  const safePhone = data.phone?.trim() ? escapeHtml(data.phone.trim()) : "Not provided";
  const safeType = escapeHtml(data.inquiryType?.trim() || "General Inquiry");
  const safeSubject = escapeHtml(data.subject.trim());
  const safeMessage = escapeHtml(data.message.trim()).replace(/\n/g, "<br/>");
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://samarthatrust.org";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Website Inquiry - Samartha Trust</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F8F5F0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #492A22; line-height: 1.6;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F8F5F0; padding: 30px 15px;">
    <tr>
      <td align="center">
        <!-- Main Email Container -->
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; border: 1px solid #EADCCB; box-shadow: 0 4px 12px rgba(73, 42, 34, 0.05);" cellspacing="0" cellpadding="0">
          
          <!-- Top Header Strip -->
          <tr>
            <td style="background: linear-gradient(135deg, #F52232 0%, #FF6B16 50%, #FF8A00 100%); padding: 28px 30px; text-align: left;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <span style="display: inline-block; background-color: rgba(255, 255, 255, 0.2); color: #FFFFFF; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding: 4px 10px; border-radius: 20px; margin-bottom: 8px;">
                      Official Website Inquiry
                    </span>
                    <h1 style="margin: 0; color: #FFFFFF; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">
                      Samartha Trust
                    </h1>
                    <p style="margin: 4px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 13px;">
                      We Believe in Abilities • Registered NGO, Bangalore
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Reference & Metadata Banner -->
          <tr>
            <td style="background-color: #FFF9F2; border-bottom: 1px solid #EADCCB; padding: 14px 30px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="font-size: 12px; color: #78685D;">
                    <strong>Reference ID:</strong> <span style="font-family: monospace; color: #F52232; font-weight: bold;">${referenceId}</span>
                  </td>
                  <td align="right" style="font-size: 12px; color: #78685D;">
                    ${submissionDate}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 30px;">
              <h2 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 700; color: #492A22;">
                Inquiry Details
              </h2>

              <!-- Details Table -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border: 1px solid #F0E6DD; border-radius: 10px; overflow: hidden; margin-bottom: 24px; background-color: #FFFCF9;">
                <tr>
                  <td style="padding: 10px 16px; border-bottom: 1px solid #F0E6DD; font-size: 13px; font-weight: 600; color: #78685D; width: 35%;">
                    Sender Name:
                  </td>
                  <td style="padding: 10px 16px; border-bottom: 1px solid #F0E6DD; font-size: 14px; font-weight: 700; color: #492A22;">
                    ${safeName}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 16px; border-bottom: 1px solid #F0E6DD; font-size: 13px; font-weight: 600; color: #78685D;">
                    Email Address:
                  </td>
                  <td style="padding: 10px 16px; border-bottom: 1px solid #F0E6DD; font-size: 14px; font-weight: 700; color: #F52232;">
                    <a href="mailto:${safeEmail}" style="color: #F52232; text-decoration: none;">${safeEmail}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 16px; border-bottom: 1px solid #F0E6DD; font-size: 13px; font-weight: 600; color: #78685D;">
                    Mobile Number:
                  </td>
                  <td style="padding: 10px 16px; border-bottom: 1px solid #F0E6DD; font-size: 14px; color: #492A22;">
                    ${safePhone !== "Not provided" ? `<a href="tel:${safePhone}" style="color: #492A22; text-decoration: none; font-weight: 600;">${safePhone}</a>` : safePhone}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 16px; border-bottom: 1px solid #F0E6DD; font-size: 13px; font-weight: 600; color: #78685D;">
                    Inquiry Type:
                  </td>
                  <td style="padding: 10px 16px; border-bottom: 1px solid #F0E6DD; font-size: 13px; font-weight: 700; color: #FF8A00;">
                    ${safeType}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 16px; font-size: 13px; font-weight: 600; color: #78685D;">
                    Subject / Topic:
                  </td>
                  <td style="padding: 10px 16px; font-size: 14px; font-weight: 600; color: #492A22;">
                    ${safeSubject}
                  </td>
                </tr>
              </table>

              <!-- Message Section -->
              <h3 style="margin: 0 0 10px 0; font-size: 15px; font-weight: 700; color: #492A22;">
                Message Content:
              </h3>
              <div style="background-color: #FFFFFF; border: 1px solid #EADCCB; border-left: 4px solid #F52232; border-radius: 8px; padding: 18px; font-size: 14px; color: #492A22; line-height: 1.7; margin-bottom: 24px;">
                ${safeMessage}
              </div>

              <!-- Reply Action Banner -->
              <div style="background-color: #FFF5E6; border: 1px dashed #FF8A00; border-radius: 10px; padding: 14px 18px; margin-bottom: 10px;">
                <p style="margin: 0; font-size: 13px; color: #492A22; line-height: 1.5;">
                  <strong>Reply-To Instruction:</strong> Simply click <em>Reply</em> in your email client to respond directly to <strong>${safeName}</strong> at <strong>${safeEmail}</strong>.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #F8F4EC; border-top: 1px solid #EADCCB; padding: 20px 30px; text-align: center; font-size: 12px; color: #78685D;">
              <p style="margin: 0 0 6px 0;">
                <strong>Samartha Trust</strong> • No. 9, 6th Cross, B.K. Nagar, Yeshwanthpur, Bengaluru - 560022
              </p>
              <p style="margin: 0;">
                Website: <a href="${appUrl}" style="color: #F52232; text-decoration: none; font-weight: 600;">${appUrl}</a> • Central Helpline: +91 97409 19104
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Builds a plain-text version for email clients that do not support HTML.
 */
export function buildContactEmailText(
  data: ContactEmailPayload,
  referenceId: string,
  submissionDate: string
): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://samarthatrust.org";

  return `=====================================================
SAMARTHA TRUST - NEW WEBSITE CONTACT INQUIRY
=====================================================

Reference ID: ${referenceId}
Date:         ${submissionDate}
Website:      ${appUrl}

SENDER INFORMATION:
-------------------
Full Name:    ${data.fullName.trim()}
Email:        ${data.email.trim()}
Phone:        ${data.phone?.trim() || "Not provided"}
Inquiry Type: ${data.inquiryType?.trim() || "General Inquiry"}
Subject:      ${data.subject.trim()}

MESSAGE:
--------
${data.message.trim()}

=====================================================
REPLY-TO INSTRUCTIONS:
This notification was sent with Reply-To set directly to:
${data.fullName.trim()} <${data.email.trim()}>.
Simply hit "Reply" in your email client to respond to the visitor.
=====================================================
`;
}

// In-memory mock store for testing and verification
export const mockSentEmails: Array<{
  referenceId: string;
  to: string;
  replyTo: string;
  subject: string;
  payload: ContactEmailPayload;
  timestamp: string;
}> = [];

/**
 * Sends the contact inquiry email to info@samarthatrust.org using Brevo or configured provider.
 */
export async function sendContactEmail(
  payload: ContactEmailPayload
): Promise<SendEmailResult> {
  const referenceId = generateInquiryReference();
  const submissionDate = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "full",
    timeStyle: "medium",
  });

  const subjectLine = buildEmailSubject(payload.inquiryType, payload.subject);
  const htmlContent = buildContactEmailHtml(payload, referenceId, submissionDate);
  const textContent = buildContactEmailText(payload, referenceId, submissionDate);

  const recipientEmail =
    process.env.CONTACT_RECIPIENT_EMAIL?.trim() || CONTACT_EMAIL;
  const senderEmail =
    process.env.CONTACT_SENDER_EMAIL?.trim() ||
    process.env.BREVO_SENDER_EMAIL?.trim() ||
    "notifications@samarthatrust.org";
  const senderName =
    process.env.CONTACT_SENDER_NAME?.trim() || "Samartha Trust Inquiries";

  const isTest = process.env.NODE_ENV === "test";
  const isMockEnabled = process.env.MOCK_EMAIL_DELIVERY === "true";
  const brevoApiKey = process.env.BREVO_API_KEY?.trim();
  const resendApiKey = process.env.RESEND_API_KEY?.trim();

  // 1. Mock / Test mode handler
  if (isMockEnabled || (isTest && !brevoApiKey && !resendApiKey)) {
    const mockId = `mock-email-${Date.now()}`;
    mockSentEmails.push({
      referenceId,
      to: recipientEmail,
      replyTo: payload.email,
      subject: subjectLine,
      payload,
      timestamp: new Date().toISOString(),
    });

    console.info(`[Email Service: Mock Delivery] Sent inquiry ${referenceId} to ${recipientEmail}`);
    return {
      success: true,
      referenceId,
      messageId: mockId,
    };
  }

  // 2. Brevo (Sendinblue) API Delivery
  if (brevoApiKey) {
    try {
      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          accept: "application/json",
          "api-key": brevoApiKey,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          sender: {
            name: senderName,
            email: senderEmail,
          },
          to: [
            {
              email: recipientEmail,
              name: "Samartha Trust Administration",
            },
          ],
          replyTo: {
            email: payload.email.trim(),
            name: payload.fullName.trim(),
          },
          subject: subjectLine,
          htmlContent,
          textContent,
        }),
      });

      const responseData = await response.json().catch(() => ({}));

      if (!response.ok) {
        const errorMsg =
          responseData?.message ||
          responseData?.error ||
          `Brevo API failed with status ${response.status}`;
        console.error("[Email Service Error - Brevo]:", errorMsg);
        return {
          success: false,
          error: "Email delivery service rejected the request. Please contact us directly.",
        };
      }

      console.info(
        `[Email Service: Brevo] Delivered inquiry ${referenceId} (MessageId: ${responseData?.messageId})`
      );

      return {
        success: true,
        referenceId,
        messageId: responseData?.messageId,
      };
    } catch (err) {
      console.error("[Email Service Network Error - Brevo]:", err);
      return {
        success: false,
        error: "Unable to reach the email delivery provider. Please contact us directly.",
      };
    }
  }

  // 3. Resend API Delivery (Alternative provider fallback)
  if (resendApiKey) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: `${senderName} <${senderEmail}>`,
          to: [recipientEmail],
          reply_to: payload.email.trim(),
          subject: subjectLine,
          html: htmlContent,
          text: textContent,
        }),
      });

      const responseData = await response.json().catch(() => ({}));

      if (!response.ok) {
        const errorMsg =
          responseData?.message ||
          responseData?.error ||
          `Resend API failed with status ${response.status}`;
        console.error("[Email Service Error - Resend]:", errorMsg);
        return {
          success: false,
          error: "Email delivery service rejected the request. Please contact us directly.",
        };
      }

      return {
        success: true,
        referenceId,
        messageId: responseData?.id,
      };
    } catch (err) {
      console.error("[Email Service Network Error - Resend]:", err);
      return {
        success: false,
        error: "Unable to reach the email delivery provider. Please contact us directly.",
      };
    }
  }

  // 4. No email provider configured
  console.warn(
    "[Email Service Warning]: No email provider API key configured (BREVO_API_KEY or RESEND_API_KEY) and MOCK_EMAIL_DELIVERY is not set."
  );

  return {
    success: false,
    error:
      "Email delivery service is currently not configured on this server. Please contact us directly at info@samarthatrust.org or +91 97409 19104.",
  };
}
