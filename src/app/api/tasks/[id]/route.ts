// src/app/api/tasks/[id]/route.ts
import { NextResponse } from 'next/server';

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const updates = await request.json();
    console.log(`Updating task ${id} with:`, updates);

    // Mock DB update logic
    // In a real app, we would update the `verificationNote` or `status` in the DB here.

    return NextResponse.json({
      taskId: id,
      updatedFields: updates,
      status: "UPDATED",
      newIdentityPoints: updates.status === 'COMPLETED' ? 15 : 0 // Mock points
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}
