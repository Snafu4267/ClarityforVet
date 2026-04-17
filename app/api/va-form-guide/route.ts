import { getVaFormGuide, isVaFormGuideId } from "@/data/va-form-guides";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const guide = searchParams.get("guide");
  if (!guide || !isVaFormGuideId(guide)) {
    return new Response("Unknown or missing guide.", { status: 400 });
  }

  const def = getVaFormGuide(guide);
  return Response.redirect(def.officialPdfUrl ?? def.officialFindFormUrl, 302);
}
