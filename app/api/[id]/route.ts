// app/api/requests/[id]/route.ts

import { prisma } from "@/app/prisma";
import { NextRequest, NextResponse } from "next/server";

// PUT - به‌روزرسانی وضعیت درخواست
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> } // توجه: الان Promise هست
) {
  try {
    const { id } = await context.params; // اینجا await بزن
    const { status } = await request.json();

    const updatedRequest = await prisma.request.update({
      where: { id: Number(id) },
      data: { status },
    });

    return NextResponse.json(updatedRequest);
  } catch (error) {
    console.error("Error updating request:", error);
    return NextResponse.json(
      { error: "خطا در به‌روزرسانی درخواست" },
      { status: 500 }
    );
  }
}
