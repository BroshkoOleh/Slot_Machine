import { Container, Sprite, Graphics } from "@pixi/react";
import { Texture, Graphics as PIXIGraphics } from "pixi.js";
import type { PropsWithChildren } from "react";

import backgroundAsset from "../../assets/sea.webp";
import { useMemo, useCallback } from "react";
import { SlotMachine } from "../SlotMachine/SlotMachine";
import {
  VISIBLE_SYMBOLS_COUNT_VERTICAL,
  VISIBLE_SYMBOLS_COUNT_HORIZONTAL,
  REEL_GAP,
} from "../../helpers/constants/constants";
// import { SizeBlock } from "../../helpers/constants/constants";

interface IMainContainerProps {
  canvasSize: {
    width: number;
    height: number;
  };
}

export const MainContainer = ({
  canvasSize,
  children,
}: PropsWithChildren<IMainContainerProps>) => {
  // const SizeBlockWidth = canvasSize.width / VISIBLE_SYMBOLS_COUNT_HORIZONTAL;
  // const SizeBlockHeight = canvasSize.height / VISIBLE_SYMBOLS_COUNT_VERTICAL;

  const backgroundTexture = useMemo(() => Texture.from(backgroundAsset), []);

  //  calculate the symbol size so that the grid fits
  // const SYMBOL_SIZE = Math.min(500, 500);

  const scaleSymbols = canvasSize.width < 780 ? 4.5 : 3;

  // console.log("scaleSymbols", scaleSymbols);

  const SYMBOLS_SIZE_HORIZONTAL = Math.round(
    (canvasSize.width / VISIBLE_SYMBOLS_COUNT_HORIZONTAL) * scaleSymbols
  );

  const SYMBOLS_SIZE_VERTICAL = Math.round(
    (canvasSize.height / VISIBLE_SYMBOLS_COUNT_VERTICAL) * scaleSymbols
  );

  console.log(
    "canvasSize.height",
    canvasSize.height,
    "SYMBOLS_SIZE",
    SYMBOLS_SIZE_VERTICAL
  );
  const SYMBOLS_CONTAINER_WIDTH = Math.round(
    Math.min(
      SYMBOLS_SIZE_HORIZONTAL + VISIBLE_SYMBOLS_COUNT_VERTICAL * REEL_GAP
    )
  );
  const SYMBOLS_CONTAINER_HEIGHT = Math.round(
    Math.min(SYMBOLS_SIZE_VERTICAL + VISIBLE_SYMBOLS_COUNT_HORIZONTAL)
  );

  console.log("SYMBOL_CONTAINER_SIZE", SYMBOLS_CONTAINER_WIDTH);
  // console.log("SYMBOL_SIZE", SYMBOLS_SIZE);
  const drawBlueSquare = useCallback(
    (g: PIXIGraphics) => {
      g.clear();
      g.beginFill(0x0066ff);
      g.drawRect(
        0,
        0,
        SYMBOLS_CONTAINER_WIDTH - REEL_GAP,
        SYMBOLS_CONTAINER_HEIGHT - REEL_GAP
      );
      g.endFill();
    },
    [SYMBOLS_CONTAINER_WIDTH, SYMBOLS_CONTAINER_HEIGHT]
  );

  // const drawBottomCover = useCallback(
  //   (g: PIXIGraphics) => {
  //     g.clear();
  //     g.beginFill(0x000000);
  //     const margin =
  //       (canvasSize.height - SYMBOL_SIZE * VISIBLE_SYMBOLS_COUNT_VERTICAL) / 2;
  //     g.drawRect(10, 100, 200, 200);
  //     g.endFill();
  //   },
  //   [canvasSize, SYMBOL_SIZE]
  // );

  const squareSize = {
    width: SYMBOLS_SIZE_HORIZONTAL,
    height: SYMBOLS_SIZE_VERTICAL,
  };
  console.log("canvasSize", canvasSize);
  const centerX = (canvasSize.width - squareSize.width) / 2;
  console.log("centerX", centerX);
  const centerY = (canvasSize.height - squareSize.height) / 2;
  console.log("centerY", centerY);

  return (
    <Container width={canvasSize.width} height={canvasSize.height}>
      <Sprite
        texture={backgroundTexture}
        width={canvasSize.width}
        height={canvasSize.height}
      />

      <Container x={centerX} y={centerY}>
        <Graphics draw={drawBlueSquare} />
        {/* <Graphics draw={drawBottomCover} /> */}
        <SlotMachine
          canvasSize={{
            width: SYMBOLS_SIZE_HORIZONTAL,
            height: SYMBOLS_SIZE_VERTICAL,
          }}
          SYMBOLS_CONTAINER_WIDTH={SYMBOLS_CONTAINER_WIDTH}
        />
        {children}
      </Container>
    </Container>
  );
};
