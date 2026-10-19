import { NextRequest, NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/validations/contact";
import { sendContactEmail } from "@/lib/email/contact-email-service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = contactFormSchema.safeParse(body);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0] as string] = issue.message;
        }
      });

      return NextResponse.json(
        {
          success: false,
          error: "Please correct the highlighted errors in the form.",
          fieldErrors,
        },
        { status: 400 }
      );
    }

    const { fullName, email, phone, inquiryType, subject, message } = result.data;

    // Send real email to Samartha Trust official inquiries address
    const emailResult = await sendContactEmail({
      fullName,
      email,
      phone: phone || undefined,
      inquiryType: inquiryType || undefined,
      subject,
      message,
    });

    if (!emailResult.success) {
      return NextResponse.json(
        {
          success: false,
          error:
            emailResult.error ||
            "Unable to deliver your message at this time. Please contact us directly at info@samarthatrust.org or +91 97409 19104.",
        },
        { status: 502 }
      );
    }

    // Log the successful contact submission
    console.info("[Contact Submission Delivered]", {
      referenceId: emailResult.referenceId,
      inquiryType: inquiryType || "General",
      messageLength: message.length,
      receivedAt: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: true,
        referenceId: emailResult.referenceId,
        message:
          "Thank you for reaching out! We have received your inquiry and our coordinator will get in touch with you shortly.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Contact API Error]:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          "An unexpected error occurred while processing your message. Please try again or reach us at info@samarthatrust.org.",
      },
      { status: 500 }
    );
  }
}
