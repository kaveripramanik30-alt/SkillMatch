import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { applicationId, email } = body;

    if (!applicationId || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Find the invited user
    const invitedUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!invitedUser) {
      return NextResponse.json({ error: "User with this email not found" }, { status: 404 });
    }

    if (invitedUser.id === session.user.id) {
      return NextResponse.json({ error: "You cannot invite yourself" }, { status: 400 });
    }

    if (invitedUser.role !== "STUDENT") {
      return NextResponse.json({ error: "You can only invite other students" }, { status: 400 });
    }

    // Verify application belongs to the current user
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        collaborations: true,
      },
    });

    if (!application || application.studentId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized or application not found" }, { status: 403 });
    }

    if (application.status !== "ACCEPTED" && application.status !== "IN_PROGRESS") {
      return NextResponse.json({ error: "Can only invite collaborators to active tasks" }, { status: 400 });
    }

    // Check limit
    const acceptedCollaborators = application.collaborations.filter(c => c.status === "ACCEPTED" || c.status === "PENDING");
    if (acceptedCollaborators.length >= 3) {
      return NextResponse.json({ error: "Maximum of 3 collaborators allowed per task" }, { status: 400 });
    }

    // Check if already invited
    const alreadyInvited = application.collaborations.some(c => c.studentId === invitedUser.id);
    if (alreadyInvited) {
      return NextResponse.json({ error: "This student has already been invited" }, { status: 400 });
    }

    const collaboration = await prisma.collaboration.create({
      data: {
        applicationId,
        studentId: invitedUser.id,
        status: "PENDING",
      },
    });

    return NextResponse.json(collaboration, { status: 201 });
  } catch (error) {
    console.error("Collaboration creation error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
