// src/app/api/plans/generate/route.ts
import { NextResponse } from 'next/server';
import { validateSchedule, Task } from '@/lib/guardrail';

export async function POST(request: Request) {
  try {
    const { duration, startDate } = await request.json();
    console.log(`Generating ${duration}-day plan starting ${startDate}`);

    // Mock AI Generation (Deterministic for now)
    const mockTasks: Task[] = [
      { title: "Sleep", durationMinutes: 480, category: 'SLEEP' },
      { title: "Morning Routine", durationMinutes: 60, category: 'ROUTINE' },
      { title: "Deep Work Block 1", durationMinutes: 240, category: 'WORK' },
      { title: "Lunch & Break", durationMinutes: 60, category: 'BUFFER' },
      { title: "Deep Work Block 2", durationMinutes: 240, category: 'WORK' },
      { title: "Goal Work", durationMinutes: 240, category: 'GOAL' },
      { title: "Evening Wind Down", durationMinutes: 60, category: 'ROUTINE' },
      { title: "Buffer", durationMinutes: 60, category: 'BUFFER' },
    ];

    // Validate the schedule using the Guardrail
    const validation = validateSchedule(mockTasks);

    if (!validation.valid) {
      console.error("AI Hallucinated an invalid schedule:", validation.error);
      return NextResponse.json({
        error: "AI Generation Error: Schedule validation failed.",
        details: validation.error
      }, { status: 500 });
    }

    // Simulate saving plan to DB...

    return NextResponse.json({
      message: "Plan generated successfully",
      planId: "mock-plan-abc",
      schedule: mockTasks,
      validation: validation
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: "Failed to generate plan" }, { status: 500 });
  }
}
