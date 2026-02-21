// src/app/api/onboarding/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    // Simulate validation and saving to DB
    console.log("Onboarding data received:", data);

    // Mock response
    return NextResponse.json({
      message: "Onboarding data saved successfully",
      userId: "mock-user-123"
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
  }
}
