import { Container, Sprite } from "@pixi/react";
import { Assets } from "pixi.js";
import { useMemo } from "react";

interface ISlotReelProps {
  x: number;
  symbols: string[];
  symbolSize: number;
  position: number;
  VISIBLE_SYMBOLS_COUNT_VERTICAL: number;
}

export const SlotReel = ({
  x,
  symbols,
  symbolSize,
  position,
  VISIBLE_SYMBOLS_COUNT_VERTICAL,
}: ISlotReelProps) => {
  const symbolTextures = useMemo(() => {
    return symbols.map((symbolKey) => Assets.get(symbolKey));
  }, [symbols]);

  return (
    <Container x={x}>
      {Array.from(
        { length: VISIBLE_SYMBOLS_COUNT_VERTICAL + 1 },
        (_, index) => {
          const baseIndex = Math.floor(position);
          const frac = position - baseIndex;
          const len = symbolTextures.length || symbols.length;
          const wrap = (n: number, m: number) => ((n % m) + m) % m;
          const symbolIndex = wrap(baseIndex + index - 1, len);
          const texture = symbolTextures[symbolIndex];
          const offsetY = -frac * symbolSize;
          const symbolY = index * symbolSize - symbolSize + offsetY;

          return (
            <Sprite
              key={index}
              texture={texture}
              x={0}
              y={Math.round(symbolY)}
              width={symbolSize}
              height={symbolSize}
            />
          );
        }
      )}
    </Container>
  );
};
