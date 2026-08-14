import { NextResponse } from "next/server";

// Destination email is kept secure on the server side and never exposed to the client
const DEST_EMAIL = "eslidaniel16@gmail.com";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { category, email, subject, message } = body;

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: "Message content is required." },
        { status: 400 }
      );
    }

    const payload = {
      to: DEST_EMAIL,
      category: category || "General Feedback",
      senderEmail: email ? email.trim() : "Anonymous User",
      subject: subject ? subject.trim() : `[Explosive Feedback] ${category}`,
      message: message.trim(),
      timestamp: new Date().toISOString(),
    };

    // Forwarding to secure email dispatch (Web3Forms API endpoint)
    // Access key / backend dispatch keeps the recipient email completely hidden from the client
    try {
      await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "6268f705-728b-4fc8-a25e-a6111f1ec7ae", // fallback public portal access
          subject: payload.subject,
          from_name: `Explosive Tools (${payload.category})`,
          reply_to: payload.senderEmail !== "Anonymous User" ? payload.senderEmail : undefined,
          message: `Category: ${payload.category}\nSender: ${payload.senderEmail}\nDate: ${payload.timestamp}\n\nMessage:\n${payload.message}`,
        }),
      });
    } catch (dispatchErr) {
      console.warn("External dispatch failed, logged server-side:", dispatchErr);
    }

    // Always log on server console
    console.log("=== USER FEEDBACK RECEIVED ===", payload);

    return NextResponse.json({
      success: true,
      message: "Feedback submitted successfully.",
    });
  } catch (error) {
    console.error("Feedback route error:", error);
    return NextResponse.json(
      { error: "Failed to process submission." },
      { status: 500 }
    );
  }
}
