// app/api/requests/[id]/route.ts
import { prisma } from "@/app/prisma";
import { NextRequest, NextResponse } from "next/server";

// PUT - به‌روزرسانی وضعیت درخواست
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await request.json();
    const id = parseInt(params.id);

    const updatedRequest = await prisma.request.update({
      where: { id },
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
