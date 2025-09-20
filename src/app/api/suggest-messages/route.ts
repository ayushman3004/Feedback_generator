// import { createOpenAI } from "@ai-sdk/openai";
import { google } from '@ai-sdk/google';
import { streamText } from "ai";
import { NextResponse } from "next/server";
import { createGoogleGenerativeAI } from '@ai-sdk/google';

const google1 = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
});

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    
const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.Create EXACTLY three questions separated strictly by '||'. Do not add any explanations, markdown, or extra text.";


    const response = await streamText({
      model: google("gemini-2.5-pro"), // ✅ use real model
      messages: [{ role: "user", content: prompt }],
    });
    // console.log("AI response:", response);

    return response.toTextStreamResponse();
  } catch (error) {
    console.error("suggest-messages error:", error);
    return NextResponse.json({ message: "Error Connecting with AI" }, { status: 500 });
  }
}
