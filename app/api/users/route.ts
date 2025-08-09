import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);
    const q = searchParams.get("q");

    const skip = (page - 1) * limit;

    const where = q
      ? {
          username: {
            contains: q,
            mode: "insensitive",
          },
        }
      : {};

    const [users, total] = await prisma.$transaction([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          username: true,
          bio: true,
          avatar: true,
          createdAt: true,
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.user.count({ where }),
    ]);

    const formattedUsers = users.map(user => ({
      id: user.id,
      username: user.username,
      slug: user.username,
      bio: user.bio,
      image: user.avatar,
      country: null, // Country is not available in the User model
      createdAt: user.createdAt,
    }));

    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    const pagination = {
      page,
      limit,
      total,
      totalPages,
      hasNext,
      hasPrev,
      nextPage: hasNext ? page + 1 : null,
      prevPage: hasPrev ? page - 1 : null,
    };

    return NextResponse.json({ users: formattedUsers, pagination });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Error fetching users" }, { status: 500 });
  }
}
