import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "STUDENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { skills, bio, portfolioUrl } = await req.json();

    const profile = await prisma.studentProfile.update({
      where: { userId: session.user.id },
      data: {
        skills,
        bio,
        portfolioUrl,
      },
    });

    return NextResponse.json({ message: "Profile updated successfully", profile }, { status: 200 });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
