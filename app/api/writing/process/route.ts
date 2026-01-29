import { NextResponse } from "next/server";
import OpenAI from "openai";
import { buildPrompt } from "@/lib/promptBuilder";
import { getUserProfile, saveSession } from "@/lib/database";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { input, mode, contentType, userId } = await request.json();

    // Validate input
    if (!input || typeof input !== "string") {
      return NextResponse.json(
        { error: "Input text is required" },
        { status: 400 }
      );
    }

    if (!mode || !["professional", "casual"].includes(mode)) {
      return NextResponse.json(
        { error: "Valid mode (professional or casual) is required" },
        { status: 400 }
      );
    }

    if (!contentType || !["email", "text", "note"].includes(contentType)) {
      return NextResponse.json(
        { error: "Valid content type (email, text, or note) is required" },
        { status: 400 }
      );
    }

    // Check for API key
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    const startTime = Date.now();

    // Fetch user profile from database
    const actualUserId = userId || "user_chris"; // Default to Chris for now
    const dbProfile = await getUserProfile(actualUserId);

    const userProfile = dbProfile
      ? {
          name: dbProfile.name,
          communicationStyle: dbProfile.communication_style,
          formalityLevel: dbProfile.formality_level,
          roleContext: dbProfile.role_context,
          signatureStyle: dbProfile.signature_style,
        }
      : {
          name: "Chris O'Connell",
          communicationStyle: "Direct & Concise",
          formalityLevel: "Professional but Friendly",
          roleContext: "Product Manager",
          signatureStyle: "Cheers,\nChris O'Connell\n(potential job title)",
        };

    // Build the prompt
    const { system, user } = buildPrompt(input, mode, contentType, userProfile);

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Using mini for cost efficiency during development
      messages: [
        {
          role: "system",
          content: system,
        },
        {
          role: "user",
          content: user,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const output = completion.choices[0]?.message?.content;

    if (!output) {
      return NextResponse.json(
        { error: "No output generated from AI" },
        { status: 500 }
      );
    }

    const processingTime = Date.now() - startTime;

    // Generate session ID
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Save session to database
    try {
      await saveSession({
        id: sessionId,
        userId: actualUserId,
        mode,
        contentType,
        originalInput: input,
        aiOutput: output,
        processingTime,
        tokenUsage: {
          input: completion.usage?.prompt_tokens || 0,
          output: completion.usage?.completion_tokens || 0,
          total: completion.usage?.total_tokens || 0,
        },
      });
    } catch (dbError) {
      console.error("Failed to save session to database:", dbError);
      // Continue anyway - don't fail the request if DB write fails
    }

    return NextResponse.json({
      sessionId,
      output,
      processingTime,
      tokenUsage: {
        input: completion.usage?.prompt_tokens || 0,
        output: completion.usage?.completion_tokens || 0,
        total: completion.usage?.total_tokens || 0,
      },
    });
  } catch (error) {
    console.error("Error processing writing:", error);

    if (error instanceof OpenAI.APIError) {
      return NextResponse.json(
        { error: `OpenAI API error: ${error.message}` },
        { status: error.status || 500 }
      );
    }

    return NextResponse.json(
      { error: "Failed to process writing" },
      { status: 500 }
    );
  }
}
