import { Container, Sprite, Graphics } from "@pixi/react";
import { Texture, Graphics as PIXIGraphics } from "pixi.js";
import type { PropsWithChildren } from "react";

import backgroundAsset from "../../assets/sea.webp";
import { useMemo, useCallback } from "react";
import { SlotMachine } from "../SlotMachine/SlotMachine";
import { SizeBlock } from "../../helpers/constants/constants";

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
  const backgroundTexture = useMemo(() => Texture.from(backgroundAsset), []);

  const drawBlueSquare = useCallback((g: PIXIGraphics) => {
    g.clear();
    g.beginFill(0x0066ff);
    g.drawRect(0, 0, SizeBlock.width, SizeBlock.height);
    g.endFill();
  }, []);

  const squareSize = { width: SizeBlock.width, height: SizeBlock.height };
  const centerX = (canvasSize.width - squareSize.width) / 2;
  const centerY = (canvasSize.height - squareSize.height) / 2;

  return (
    <Container width={canvasSize.width} height={canvasSize.height}>
      <Sprite
        texture={backgroundTexture}
        width={canvasSize.width}
        height={canvasSize.height}
      />

      <Container x={centerX} y={centerY}>
        {/* <Graphics draw={drawBlueSquare} /> */}
        <SlotMachine
          canvasSize={{
            width: SizeBlock.width,
            height: SizeBlock.height,
          }}
        />
        {children}
      </Container>
    </Container>
  );
};
