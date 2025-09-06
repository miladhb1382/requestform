// app/api/requests/route.ts
import { prisma } from "@/app/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET - دریافت همه درخواست‌ها
export async function GET() {
  try {
    const requests = await prisma.request.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(requests);
  } catch (error) {
    console.error("Error fetching requests:", error);
    return NextResponse.json(
      { error: "خطا در دریافت درخواست‌ها" },
      { status: 500 }
    );
  }
}

// POST - ایجاد درخواست جدید
export async function POST(request: NextRequest) {
  try {
    const { title, content } = await request.json();

    const newRequest = await prisma.request.create({
      data: {
        title,
        content,
        status: "pending",
      },
    });

    return NextResponse.json(newRequest, { status: 201 });
  } catch (error) {
    console.error("Error creating request:", error);
    return NextResponse.json(
      { error: "خطا در ایجاد درخواست" },
      { status: 500 }
    );
  }
}
