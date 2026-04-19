const SERVICE_BG_FLAG =
  "https://upload.wikimedia.org/wikipedia/commons/0/0a/The_American_flag_blows_in_the_wind_as_the_moon_rises_over_Joint_Base_Charleston.jpg";

const SERVICE_BG_LIBERTY =
  "https://upload.wikimedia.org/wikipedia/commons/8/81/Statue_of_Liberty_National_Monument_STLI2261.jpg";

/**
 * Atmospheric shell for secondary routes: warm gradients plus the same faded side imagery
 * the home page uses, so the full site feels like one continuous experience.
 */
export function ServiceSubpageFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="service-subpage-frame relative flex min-h-screen w-full flex-col">
      <div className="service-subpage-bg pointer-events-none fixed inset-0 z-0 print:hidden" aria-hidden />
      <div className="service-subpage-bg-dust pointer-events-none fixed inset-0 z-0 print:hidden" aria-hidden />
      <div
        className="pointer-events-none fixed inset-0 z-[1] opacity-[0.2] max-[47.999rem]:hidden print:hidden"
        aria-hidden
        style={{
          backgroundImage: `url(${SERVICE_BG_LIBERTY})`,
          backgroundSize: "cover",
          backgroundPosition: "left top",
          WebkitMaskImage:
            "linear-gradient(to right, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.55) 24%, rgba(0,0,0,0) 58%)",
          maskImage:
            "linear-gradient(to right, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.55) 24%, rgba(0,0,0,0) 58%)",
        }}
      />
      <div
        className="pointer-events-none fixed inset-0 z-[1] opacity-[0.42] max-[47.999rem]:hidden print:hidden"
        aria-hidden
        style={{
          backgroundImage: `url(${SERVICE_BG_FLAG})`,
          backgroundSize: "cover",
          backgroundPosition: "right 42%",
          WebkitMaskImage:
            "linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0.72) 22%, rgba(0,0,0,0.38) 42%, rgba(0,0,0,0) 72%)",
          maskImage:
            "linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0.72) 22%, rgba(0,0,0,0.38) 42%, rgba(0,0,0,0) 72%)",
        }}
      />
      <div className="relative z-10 flex flex-1 flex-col">{children}</div>
    </div>
  );
}
