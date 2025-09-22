import { useState, useEffect, useCallback, useRef } from "react";
import { gsap } from "gsap";

interface ReelState {
  position: number;
  previousPosition: number;
}

export const useSlotAnimation = (reelCount: number = 5) => {
  const [reels, setReels] = useState<ReelState[]>([]);
  const [running, setRunning] = useState(false);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const initialReels = Array.from({ length: reelCount }, () => ({
      position: 0,
      previousPosition: 0,
    }));
    setReels(initialReels);
  }, [reelCount]);

  const startPlay = useCallback(() => {
    if (running) return;
    setRunning(true);

    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    const tl = gsap.timeline({
      onComplete: () => {
        setRunning(false);
        timelineRef.current = null;
      },
    });

    const baseSpins = 20;
    const randomExtraMax = 3;
    const spinDuration = 1.0;
    const stopStagger = 0.3;
    const stopDuration = 0.3;

    reels.forEach((reel, i) => {
      const extra = Math.floor(Math.random() * randomExtraMax);
      const target = reel.position - (baseSpins + extra);
      const stopStartTime = spinDuration + i * stopStagger;

      const proxy = { position: reel.position };

      tl.to(
        proxy,
        {
          position: target - 0.5,
          duration: stopStartTime,
          ease: "none",
          onUpdate: () => {
            setReels((prevReels) => {
              const newReels = [...prevReels];
              newReels[i] = {
                ...newReels[i],
                previousPosition: newReels[i].position,
                position: proxy.position,
              };
              return newReels;
            });
          },
        },
        0
      ).to(
        proxy,
        {
          position: target,
          duration: stopDuration,
          ease: "back.out(0.3)",
          onUpdate: () => {
            setReels((prevReels) => {
              const newReels = [...prevReels];
              newReels[i] = {
                ...newReels[i],
                previousPosition: newReels[i].position,
                position: proxy.position,
              };
              return newReels;
            });
          },
        },
        stopStartTime
      );
    });

    timelineRef.current = tl;
  }, [running, reels]);

  useEffect(() => {
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, []);

  return {
    reels,
    running,
    startPlay,
  };
};
