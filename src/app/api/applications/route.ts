import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "STUDENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId, matchScore } = await req.json();

    if (!projectId || matchScore === undefined) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Check if already applied
    const existing = await prisma.application.findFirst({
      where: { projectId, studentId: session.user.id }
    });

    if (existing) {
      return NextResponse.json({ error: "Already applied" }, { status: 400 });
    }

    const application = await prisma.application.create({
      data: {
        projectId,
        studentId: session.user.id,
        matchScore
      }
    });

    return NextResponse.json({ message: "Applied successfully", application }, { status: 201 });
  } catch (error) {
    console.error("Application error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
