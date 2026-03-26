import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const prompt = body.prompt || body.messages?.[0]?.content;

    if (!prompt) {
      return NextResponse.json(
        { message: "Prompt is required" },
        { status: 400 },
      );
    }

    // ✅ Debug: check API key
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      console.error("❌ Missing GOOGLE_GENERATIVE_AI_API_KEY");
      return NextResponse.json(
        { message: "API key not configured" },
        { status: 500 },
      );
    }

    console.log("✅ Prompt received:", prompt);

    const result = await generateText({
      model: google("gemini-2.5-flash"),
      prompt,
    });

    // ✅ Extra safety
    if (!result || !result.text) {
      console.error("❌ Empty response from Gemini:", result);
      return NextResponse.json(
        { message: "Empty response from AI" },
        { status: 500 },
      );
    }

    console.log("✅ Gemini response:", result.text);

    return NextResponse.json({ text: result.text });
  } catch (error: any) {
    // ✅ FULL DEBUG (this is the key part)
    console.error("🔥 FULL ERROR:", error);
    console.error("🔥 MESSAGE:", error?.message);
    console.error("🔥 STACK:", error?.stack);

    return NextResponse.json(
      { message: error?.message || "Error Connecting with AI" },
      { status: 500 },
    );
  }
}
