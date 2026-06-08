import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { status } = body;

    if (!["ACCEPTED", "REJECTED"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const collaboration = await prisma.collaboration.findUnique({
      where: { id: params.id },
      include: {
        application: {
          include: {
            collaborations: true
          }
        }
      }
    });

    if (!collaboration) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Only the invited student can accept/reject
    if (collaboration.studentId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // If accepting, ensure the limit of 3 hasn't been reached
    if (status === "ACCEPTED") {
      const currentAccepted = collaboration.application.collaborations.filter(c => c.status === "ACCEPTED");
      if (currentAccepted.length >= 3) {
        return NextResponse.json({ error: "This task already has the maximum number of collaborators" }, { status: 400 });
      }
    }

    const updated = await prisma.collaboration.update({
      where: { id: params.id },
      data: { status },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Collaboration update error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
