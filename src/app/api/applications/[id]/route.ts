import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "CLIENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { status } = await req.json(); // ACCEPTED or REJECTED
    const resolvedParams = await params;
    const id = resolvedParams.id;

    const application = await prisma.application.findUnique({
      where: { id },
      include: { project: true }
    });

    if (!application || application.project.clientId !== session.user.id) {
      return NextResponse.json({ error: "Not found or unauthorized" }, { status: 404 });
    }

    // Update Application Status
    const updated = await prisma.application.update({
      where: { id },
      data: { status }
    });

    // If accepted, update the Project status
    if (status === "ACCEPTED") {
      await prisma.project.update({
        where: { id: application.projectId },
        data: { status: "IN_PROGRESS" }
      });
      
      // Reject all other pending applications for this project
      await prisma.application.updateMany({
        where: {
          projectId: application.projectId,
          id: { not: id },
          status: "PENDING"
        },
        data: { status: "REJECTED" }
      });
    }

    return NextResponse.json({ message: "Status updated", application: updated }, { status: 200 });
  } catch (error) {
    console.error("Update application error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
