// src/app/api/plans/generate/route.ts
import { NextResponse } from 'next/server';
import { validateSchedule, Task } from '@/lib/guardrail';

export async function POST(request: Request) {
  try {
    const { duration, startDate, identity } = await request.json();
    console.log(`Generating ${duration}-day plan starting ${startDate} for identity: ${identity}`);

    let mockTasks: Task[] = [];
    let dailyStrategy = "";

    if (identity === "The Elite Programmer") {
        dailyStrategy = "Focus on deep work blocks early in the day. Use transition buffers to completely disconnect from code before switching context.";
        mockTasks = [
            { title: "Wake Up & Hydrate", durationMinutes: 30, category: 'ROUTINE' },
            { title: "LeetCode / Algo Warmup", durationMinutes: 60, category: 'GOAL' },
            { title: "Transition: Coffee & Setup", durationMinutes: 15, category: 'BUFFER' },
            { title: "Deep Work: Core Feature Dev", durationMinutes: 240, category: 'WORK' },
            { title: "Lunch & Walk", durationMinutes: 60, category: 'BUFFER' },
            { title: "Code Review & Architecture", durationMinutes: 240, category: 'WORK' },
            { title: "Transition: Decompress", durationMinutes: 15, category: 'BUFFER' },
            { title: "Side Project / Learning", durationMinutes: 90, category: 'GOAL' },
            { title: "Dinner & Relax", durationMinutes: 60, category: 'ROUTINE' },
            { title: "Read Technical Papers", durationMinutes: 120, category: 'GOAL' },
            { title: "Sleep", durationMinutes: 510, category: 'SLEEP' }, // 8.5 hours
        ];
    } else if (identity === "The Hybrid Athlete") {
        dailyStrategy = "Prioritize recovery between double sessions. Ensure high protein intake during the lunch buffer.";
        mockTasks = [
            { title: "Wake Up & Electrolytes", durationMinutes: 30, category: 'ROUTINE' },
            { title: "Zone 2 Run (Low HR)", durationMinutes: 90, category: 'GOAL' },
            { title: "Post-Run Fuel & Shower", durationMinutes: 30, category: 'ROUTINE' },
            { title: "Transition: Commute/Setup", durationMinutes: 15, category: 'BUFFER' },
            { title: "Deep Work Block 1", durationMinutes: 240, category: 'WORK' },
            { title: "Lunch & Mobility Work", durationMinutes: 60, category: 'BUFFER' },
            { title: "Deep Work Block 2", durationMinutes: 240, category: 'WORK' },
            { title: "Transition: Pre-Workout", durationMinutes: 15, category: 'BUFFER' },
            { title: "Strength Training (Heavy)", durationMinutes: 90, category: 'GOAL' },
            { title: "Dinner & Protein", durationMinutes: 60, category: 'ROUTINE' },
            { title: "Recovery / Stretching", durationMinutes: 90, category: 'ROUTINE' },
            { title: "Sleep", durationMinutes: 480, category: 'SLEEP' }, // 8 hours
        ];
    } else {
        // Default / Generic
        dailyStrategy = "Maintain a balanced rhythm. Stick to the buffers to avoid burnout.";
        mockTasks = [
            { title: "Sleep", durationMinutes: 480, category: 'SLEEP' },
            { title: "Morning Routine", durationMinutes: 60, category: 'ROUTINE' },
            { title: "Deep Work Block 1", durationMinutes: 240, category: 'WORK' },
            { title: "Lunch & Break", durationMinutes: 60, category: 'BUFFER' },
            { title: "Deep Work Block 2", durationMinutes: 240, category: 'WORK' },
            { title: "Goal Work", durationMinutes: 240, category: 'GOAL' },
            { title: "Evening Wind Down", durationMinutes: 60, category: 'ROUTINE' },
            { title: "Buffer", durationMinutes: 60, category: 'BUFFER' },
        ];
    }

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
      dailyStrategy: dailyStrategy,
      validation: validation
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: "Failed to generate plan" }, { status: 500 });
  }
}
