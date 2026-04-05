import { createGroq } from "@ai-sdk/groq";
import { streamText } from "ai";
import { NextRequest } from "next/server";

if (!process.env.GROQ_API_KEY) {
  throw new Error("GROQ_API_KEY is missing from enviornment variables");
}

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_PROMT = `Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. these questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing interaction. For example, your output should be structured like this: 'what's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?||What's a simple thing that makes you happy?. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational enviornment`;

export async function POST(req: NextRequest) {
  // steram response
  try {
    const result = await streamText({
      model: groq("llama-3.1-8b-instant"),
      prompt: "Generate three questions, each under 100 characters",
      system: SYSTEM_PROMT,
    });

    return result.toTextStreamResponse();
    // return Response.json({ success: true, questions: `&${text}&` }, { status: 200 });
  } catch (error) {
    console.error("Question_Generation_ERROR", error);
    return Response.json(
      {
        success: false,
        message: "AI Failed Generate Questions",
      },
      { status: 500 },
    );
  }
}
