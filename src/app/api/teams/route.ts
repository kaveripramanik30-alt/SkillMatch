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

    const { name, description, role } = await req.json();

    if (!name || !role) {
      return NextResponse.json({ error: "Name and Role are required" }, { status: 400 });
    }

    const team = await prisma.team.create({
      data: {
        name,
        description,
        members: {
          create: {
            userId: session.user.id,
            role: role
          }
        }
      },
    });

    return NextResponse.json({ message: "Team created successfully", team }, { status: 201 });
  } catch (error) {
    console.error("Team creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
