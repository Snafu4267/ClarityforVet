/**
 * Atmospheric shell for secondary routes: warm gradients, soft “dust,” diagonal texture,
 * and a hairline top band—evokes the cinematic / service mood without stock imagery.
 */
export function ServiceSubpageFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="service-subpage-frame relative flex min-h-screen w-full flex-col">
      <div className="service-subpage-bg pointer-events-none fixed inset-0 z-0 print:hidden" aria-hidden />
      <div className="service-subpage-bg-dust pointer-events-none fixed inset-0 z-0 print:hidden" aria-hidden />
      <div className="relative z-10 flex flex-1 flex-col">{children}</div>
    </div>
  );
}
