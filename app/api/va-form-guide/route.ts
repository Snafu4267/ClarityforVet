import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buildVaFormGuidePdf } from "@/lib/va-form-guides/build-pdf";
import { getVaFormGuide, isVaFormGuideId } from "@/data/va-form-guides";
import { getServerSession } from "next-auth/next";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const guide = searchParams.get("guide");
  if (!guide || !isVaFormGuideId(guide)) {
    return new Response("Unknown or missing guide.", { status: 400 });
  }

  const session = await getServerSession(authOptions);
  let veteranName = "______________________________";

  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, email: true },
    });
    const n = user?.name?.trim();
    if (n && n.length > 0) {
      veteranName = n;
    } else if (user?.email) {
      const local = user.email.split("@")[0];
      if (local) veteranName = local;
    }
  }

  const def = getVaFormGuide(guide);
  const bytes = await buildVaFormGuidePdf(def, veteranName);

  return new Response(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="clarity4vets-${guide}-worksheet.pdf"`,
      "Cache-Control": "private, no-store",
    },
  });
}
