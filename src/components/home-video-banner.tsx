"use client";

import { useEffect, useRef } from "react";

export function HomeVideoBanner() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLVideoElement>(null);
  const ambientRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const kick = (node: HTMLVideoElement | null) => {
      if (!node) return;
      node.muted = true;
      node.defaultMuted = true;
      node.playsInline = true;
      void node.play().catch(() => {});
    };

    const main = mainRef.current;
    const ambient = ambientRef.current;

    kick(main);
    kick(ambient);

    const onMainData = () => kick(main);
    const onAmbientData = () => kick(ambient);
    main?.addEventListener("loadeddata", onMainData);
    main?.addEventListener("canplay", onMainData);
    ambient?.addEventListener("loadeddata", onAmbientData);
    ambient?.addEventListener("canplay", onAmbientData);

    const onVisible = () => {
      if (document.visibilityState === "visible") {
        kick(mainRef.current);
        kick(ambientRef.current);
      }
    };
    document.addEventListener("visibilitychange", onVisible);

    const wrap = wrapRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            kick(mainRef.current);
            kick(ambientRef.current);
          }
        });
      },
      { threshold: 0.08, rootMargin: "12% 0px 12% 0px" },
    );
    if (wrap) observer.observe(wrap);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisible);
      main?.removeEventListener("loadeddata", onMainData);
      main?.removeEventListener("canplay", onMainData);
      ambient?.removeEventListener("loadeddata", onAmbientData);
      ambient?.removeEventListener("canplay", onAmbientData);
    };
  }, []);

  return (
    <section className="relative left-1/2 w-[100vw] max-w-[100vw] -translate-x-1/2 overflow-x-clip bg-[linear-gradient(165deg,#f2f6fc_0%,#e4ecf7_42%,#d8e4f2_100%)] [-webkit-overflow-scrolling:touch]">
      <div className="relative mx-auto w-full max-w-[1800px] px-3 pb-7 pt-5 sm:px-4 sm:pb-8 sm:pt-6 md:px-6 md:pb-12 md:pt-10 lg:px-8">
        <div className="pointer-events-none absolute inset-0 hidden md:block" aria-hidden>
          <video
            ref={ambientRef}
            className="h-full w-full scale-[1.06] object-cover opacity-55 blur-2xl"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          >
            <source src="/media/main-banner.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.52)_0%,rgba(226,236,247,0.35)_45%,rgba(210,226,242,0.5)_100%)]" />
        </div>

        <div ref={wrapRef} className="relative z-10 mx-auto w-full max-w-[1500px]">
          <div className="absolute inset-x-0 top-0 hidden h-px bg-[linear-gradient(90deg,transparent_0%,rgba(148,174,212,0.55)_50%,transparent_100%)] md:block" />
          <div className="absolute inset-x-0 bottom-0 hidden h-px bg-[linear-gradient(90deg,transparent_0%,rgba(148,174,212,0.35)_50%,transparent_100%)] md:block" />

          <div className="overflow-hidden rounded-[18px] border border-[#a9bfd9]/55 bg-white/65 shadow-[0_16px_40px_rgba(65,95,140,0.1)] backdrop-blur-[8px] sm:rounded-[22px] md:rounded-[30px] md:border-[#9cb4d4]/50 md:bg-white/55 md:shadow-[0_26px_70px_rgba(55,85,125,0.14)]">
            <div
              className="relative w-full bg-[#b8cce3]"
              style={{
                aspectRatio: "16 / 9",
                minHeight: "clamp(168px, 52vw, 280px)",
              }}
            >
              <video
                ref={mainRef}
                className="absolute inset-0 z-[1] h-full w-full object-cover object-center"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                controls={false}
                disablePictureInPicture
              >
                <source src="/media/main-banner.mp4" type="video/mp4" />
              </video>
              <div className="pointer-events-none absolute inset-0 z-[2] bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,transparent_40%,rgba(180,200,228,0.06)_100%)]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
