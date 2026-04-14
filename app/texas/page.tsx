import type { Metadata } from "next";
import texasData from "@/data/texas-va-resources.json";
import { SITE_NAME } from "@/lib/site";
import TexasPageContent from "@/components/TexasPageContent";
import type { TexasVaData } from "@/types/texas-va";

const data = texasData as TexasVaData;

export const metadata: Metadata = {
  title: `Texas VA facilities & contacts — ${SITE_NAME}`,
  description:
    "Educational directory: Texas VAMCs and clinics from public VA.gov sources—phones, hours notes, map, approximate distances. Not legal or medical advice; verify all details officially.",
};

export default function TexasPage() {
  return (
    <TexasPageContent data={data} stateCode="TX" stateName="Texas" accentClassName="page-accent-texas" />
  );
}
