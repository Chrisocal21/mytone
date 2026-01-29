import { NextResponse } from "next/server";
import { updateSessionFinalOutput } from "@/lib/database";

export async function POST(request: Request) {
  try {
    const { sessionId, finalOutput } = await request.json();

    // Validate input
    if (!sessionId || typeof sessionId !== "string") {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    if (!finalOutput || typeof finalOutput !== "string") {
      return NextResponse.json(
        { error: "Final output is required" },
        { status: 400 }
      );
    }

    // Update session with final output
    await updateSessionFinalOutput(sessionId, finalOutput);

    // TODO: Extract learning patterns from edits
    // Compare AI output with final output to learn preferences

    return NextResponse.json({
      success: true,
      learningUpdated: false, // Will be true once learning is implemented
      message: "Session finalized successfully",
    });
  } catch (error) {
    console.error("Error finalizing session:", error);

    return NextResponse.json(
      { error: "Failed to finalize session" },
      { status: 500 }
    );
  }
}
