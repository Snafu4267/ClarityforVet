import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";

const MAX_COMMENT = 2000;

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return Response.json({ error: "Invalid body." }, { status: 400 });
  }

  const { rating: rawRating, comment: rawComment, pagePath: rawPath } = body as Record<string, unknown>;

  const rating = typeof rawRating === "number" ? rawRating : Number(rawRating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return Response.json({ error: "Rating must be an integer from 1 to 5." }, { status: 400 });
  }

  const comment = typeof rawComment === "string" ? rawComment.trim() : "";
  if (comment.length < 3) {
    return Response.json({ error: "Please add a short comment (at least 3 characters)." }, { status: 400 });
  }
  if (comment.length > MAX_COMMENT) {
    return Response.json({ error: `Comment is too long (max ${MAX_COMMENT} characters).` }, { status: 400 });
  }

  let pagePath: string | null = null;
  if (typeof rawPath === "string" && rawPath.trim()) {
    const p = rawPath.trim().slice(0, 500);
    pagePath = p.startsWith("/") ? p : `/${p}`;
  }

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id ?? null;

  await prisma.siteFeedback.create({
    data: {
      rating,
      comment,
      pagePath,
      userId,
    },
  });

  return Response.json({ ok: true }, { status: 201 });
}
