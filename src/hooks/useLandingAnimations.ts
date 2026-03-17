import { useEffect, useRef } from "react";
import type { RefObject } from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const heroPieceIntroOffsets = [
  { x: -180, y: -110, rotate: -14 },
  { x: -24, y: -150, rotate: 10 },
  { x: 170, y: -120, rotate: 14 },
  { x: -190, y: 118, rotate: -12 },
  { x: 14, y: 155, rotate: 8 },
  { x: 176, y: 124, rotate: 12 },
] as const;

const heroPieceScatterOffsets = [
  { x: -255, y: -118, rotate: -20 },
  { x: -68, y: -214, rotate: 15 },
  { x: 266, y: -146, rotate: 18 },
  { x: -270, y: 188, rotate: -18 },
  { x: 38, y: 236, rotate: 11 },
  { x: 282, y: 170, rotate: 17 },
] as const;

export function useLandingAnimations(): RefObject<HTMLDivElement | null> {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;

    if (!root) {
      return;
    }

    document.documentElement.classList.add("js");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.documentElement.classList.remove("js");
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      const scrollStages = gsap.utils.toArray<HTMLElement>("[data-scroll-stage]");
      const heroPieces = gsap.utils.toArray<HTMLElement>("[data-hero-piece]");
      const heroCopy = document.querySelector<HTMLElement>("[data-hero-copy]");
      const heroImageFrame = document.querySelector<HTMLElement>("[data-hero-image]");
      const heroImage = document.querySelector<HTMLElement>("[data-hero-image] img");
      const heroLive = document.querySelector<HTMLElement>("[data-hero-live]");
      const tickerWrap = document.querySelector<HTMLElement>(".ticker-wrap");

      gsap.fromTo(
        "[data-hero-copy] .hero-reveal",
        { autoAlpha: 0, y: 30 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.08,
        },
      );

      if (heroImageFrame && heroImage) {
        if (heroPieces.length) {
          gsap.set(heroPieces, {
            autoAlpha: 0,
            x: 0,
            y: 0,
            rotate: 0,
            scale: 1,
            transformOrigin: "center center",
          });

          gsap.fromTo(
            heroPieces,
            {
              autoAlpha: 0,
              scale: 0.88,
              x: (index) => heroPieceIntroOffsets[index]?.x ?? 0,
              y: (index) => heroPieceIntroOffsets[index]?.y ?? 0,
              rotate: (index) => heroPieceIntroOffsets[index]?.rotate ?? 0,
            },
            {
              autoAlpha: 1,
              scale: 1,
              x: 0,
              y: 0,
              rotate: 0,
              duration: 0.8,
              ease: "expo.out",
              stagger: 0.05,
              delay: 0.16,
            },
          );

          gsap.to(heroPieces, {
            autoAlpha: 0,
            duration: 0.2,
            ease: "power1.out",
            stagger: {
              each: 0.02,
              from: "random",
            },
            delay: 1.02,
            onComplete: () => {
              gsap.set(heroPieces, {
                autoAlpha: 0,
                x: 0,
                y: 0,
                rotate: 0,
                scale: 1,
              });
            },
          });
        }

        const heroIntro = gsap.timeline({
          defaults: {
            ease: "power3.out",
          },
        });

        heroIntro.fromTo(
          heroImageFrame,
          { autoAlpha: 0, y: 28, scale: 1.02 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.95,
          },
          0.04,
        );

        heroIntro.fromTo(
          heroImage,
          { autoAlpha: 0.8, scale: 1.08 },
          {
            autoAlpha: 1,
            scale: 1,
            duration: 1.15,
          },
          0,
        );

      }

      if (heroLive) {
        gsap.fromTo(
          heroLive,
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.78,
            ease: "power3.out",
            delay: 0.36,
          },
        );
      }

      if (heroCopy && heroImageFrame && heroLive && tickerWrap) {
        const heroScrollTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: ".hero-section",
            start: "top top",
            end: "bottom top",
            scrub: true,
            invalidateOnRefresh: true,
            onLeaveBack: () => {
              gsap.set(heroCopy, {
                autoAlpha: 1,
                y: 0,
              });

              gsap.set(heroImageFrame, {
                autoAlpha: 1,
                y: 0,
                scale: 1,
              });

              if (heroImage) {
                gsap.set(heroImage, {
                  autoAlpha: 1,
                  scale: 1,
                  yPercent: 0,
                });
              }

              gsap.set(heroLive, {
                autoAlpha: 1,
                y: 0,
              });

              gsap.set(tickerWrap, {
                autoAlpha: 1,
                y: 0,
              });

              if (heroPieces.length) {
                gsap.set(heroPieces, {
                  autoAlpha: 0,
                  x: 0,
                  y: 0,
                  rotate: 0,
                  scale: 1,
                });
              }
            },
          },
        });

        heroScrollTimeline.fromTo(
          heroCopy,
          {
            autoAlpha: 1,
            y: 0,
          },
          {
            autoAlpha: 0.42,
            y: -48,
            ease: "none",
          },
          0,
        );

        heroScrollTimeline.fromTo(
          heroImageFrame,
          {
            y: 0,
            scale: 1,
          },
          {
            y: -16,
            scale: 0.985,
            ease: "none",
          },
          0,
        );

        if (heroImage) {
          heroScrollTimeline.fromTo(
            heroImage,
            {
              scale: 1,
              yPercent: 0,
            },
            {
              scale: 1.06,
              yPercent: 4,
              ease: "none",
            },
            0,
          );
        }

        heroScrollTimeline.fromTo(
          heroLive,
          {
            autoAlpha: 1,
            y: 0,
          },
          {
            autoAlpha: 0.48,
            y: 18,
            ease: "none",
          },
          0.08,
        );

        heroScrollTimeline.fromTo(
          tickerWrap,
          {
            autoAlpha: 1,
            y: 0,
          },
          {
            autoAlpha: 0.56,
            y: 16,
            ease: "none",
          },
          0.12,
        );

        if (heroPieces.length) {
          heroScrollTimeline.to(
            heroPieces,
            {
              autoAlpha: 1,
              x: (index) => heroPieceScatterOffsets[index]?.x ?? 0,
              y: (index) => heroPieceScatterOffsets[index]?.y ?? 0,
              rotate: (index) => heroPieceScatterOffsets[index]?.rotate ?? 0,
              scale: 0.98,
              ease: "none",
              stagger: {
                each: 0.015,
                from: "random",
              },
            },
            0.06,
          );
        }
      }

      gsap.utils.toArray<HTMLElement>(".scroll-reveal").forEach((element) => {
        ScrollTrigger.create({
          trigger: element,
          start: "top 86%",
          once: true,
          onEnter: () => {
            gsap.fromTo(
              element,
              { autoAlpha: 0, y: 24 },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.72,
                ease: "power2.out",
                overwrite: "auto",
              },
            );
          },
        });
      });

      scrollStages.forEach((stage, index) => {
        const isLastStage = index === scrollStages.length - 1;

        gsap.set(stage, {
          force3D: true,
          transformOrigin: "center top",
        });

        gsap.set(stage, {
          autoAlpha: 0.9,
          y: 22,
          scale: 0.996,
        });

        gsap.to(stage, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          ease: "none",
          overwrite: "auto",
          scrollTrigger: {
            trigger: stage,
            start: "top 92%",
            end: "top 64%",
            scrub: true,
            invalidateOnRefresh: true,
          },
        });

        if (!isLastStage) {
          gsap.to(stage, {
            autoAlpha: 0.95,
            y: -8,
            scale: 0.999,
            ease: "none",
            overwrite: "auto",
            scrollTrigger: {
              trigger: stage,
              start: "bottom 56%",
              end: "bottom 28%",
              scrub: true,
              invalidateOnRefresh: true,
            },
          });
        }
      });
    }, root);

    return () => {
      context.revert();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      document.documentElement.classList.remove("js");
    };
  }, []);

  return rootRef;
}
