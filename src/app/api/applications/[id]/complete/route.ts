import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "CLIENT") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { rating, review } = body;

    // Verify application belongs to a project owned by this client
    const existingApp = await prisma.application.findUnique({
      where: { id: resolvedParams.id },
      include: { project: true }
    });

    if (!existingApp || existingApp.project.clientId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const application = await prisma.application.update({
      where: { id: resolvedParams.id },
      data: {
        status: "COMPLETED",
        rating: rating ? parseInt(rating) : null,
        review: review || null
      }
    });

    // Mark the project itself as COMPLETED
    await prisma.project.update({
      where: { id: application.projectId },
      data: { status: "COMPLETED" }
    });

    return NextResponse.json(application);
  } catch (error) {
    console.error("Error completing application:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
