import { PageAccent } from "@/components/PageAccent";
import { ServiceSubpageFrame } from "@/components/ServiceSubpageFrame";

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  return (
    <ServiceSubpageFrame>
      <PageAccent className="page-accent-learn-shell" />
      {children}
    </ServiceSubpageFrame>
  );
}
