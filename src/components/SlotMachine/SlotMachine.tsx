import { Container, Graphics, Text } from "@pixi/react";
import { Graphics as PIXIGraphics, TextStyle, Assets } from "pixi.js";
import { useCallback, useMemo, useEffect, useState } from "react";
import { SlotReel } from "../SlotReel/SlotReel";
import { useSlotAnimation } from "./useSlotAnimation";

interface ISlotMachineProps {
  canvasSize: {
    width: number;
    height: number;
  };
}

const REEL_WIDTH = 105; //idents beside symbola
const SYMBOL_SIZE = 100; // size of symbols
const VISIBLE_SYMBOLS_COUNT_VERTICAL = 5; // number of symbols vertically
const VISIBLE_SYMBOLS_COUNT_HORIZONTAL = 6; // number of symbols horizontally

const SYMBOL_ASSETS = {
  bundle: "slot-symbols",
  assets: {
    img0: "/src/assets/slotImages/img0.jpg",
    img1: "/src/assets/slotImages/img1.jpg",
    img2: "/src/assets/slotImages/img2.jpg",
    img3: "/src/assets/slotImages/img3.jpg",
    img4: "/src/assets/slotImages/img4.jpg",
    img5: "/src/assets/slotImages/img5.jpg",
    img6: "/src/assets/slotImages/img6.jpg",
    img7: "/src/assets/slotImages/img7.jpg",
    img8: "/src/assets/slotImages/img8.jpg",
    img9: "/src/assets/slotImages/img9.jpg",
    img10: "/src/assets/slotImages/img10.jpg",
    img11: "/src/assets/slotImages/img11.jpg",
    img12: "/src/assets/slotImages/img12.jpg",
  },
};

const SYMBOL_KEYS = [
  "img0",
  "img1",
  "img2",
  "img3",
  "img4",
  "img5",
  "img6",
  "img7",
  "img8",
  "img9",
  "img10",
  "img11",
  "img12",
];

export const SlotMachine = ({ canvasSize }: ISlotMachineProps) => {
  const {
    reels,
    startPlay,
    // visibleSymbolsCount,
    running,
  } = useSlotAnimation(
    VISIBLE_SYMBOLS_COUNT_HORIZONTAL
    //  VISIBLE_SYMBOLS_COUNT
  );
  const margin = 100;
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    const loadAssets = async () => {
      try {
        Assets.addBundle(SYMBOL_ASSETS.bundle, SYMBOL_ASSETS.assets);

        const bundle = await Assets.loadBundle(
          SYMBOL_ASSETS.bundle,
          (progress) => {
            setLoadingProgress(progress);
          }
        );

        setAssetsLoaded(true);
        console.log("Assets loaded successfully:", bundle);
      } catch (error) {
        console.error("Failed to load assets:", error);
      }
    };

    loadAssets();
  }, []);

  // const drawTopCover = useCallback(
  //   (g: PIXIGraphics) => {
  //     g.clear();
  //     // g.beginFill(0x0089bf);
  //     g.drawRect(
  //       0,
  //       0,
  //       canvasSize.width,
  //       (canvasSize.height - SYMBOL_SIZE * VISIBLE_SYMBOLS_COUNT_VERTICAL) / 2
  //     );
  //     g.endFill();
  //   },
  //   [canvasSize]
  // );

  const drawBottomCover = useCallback(
    (g: PIXIGraphics) => {
      g.clear();
      g.beginFill(0x000000);
      const margin =
        (canvasSize.height - SYMBOL_SIZE * VISIBLE_SYMBOLS_COUNT_VERTICAL) / 2;
      g.drawRect(
        0,
        SYMBOL_SIZE * VISIBLE_SYMBOLS_COUNT_VERTICAL + margin,
        canvasSize.width,
        margin
      );
      g.endFill();
    },
    [canvasSize]
  );

  const drawSpinButton = useCallback(
    (g: PIXIGraphics) => {
      g.clear();

      const buttonWidth = 120;
      const buttonHeight = 50;
      const buttonX = (canvasSize.width - buttonWidth) / 2;
      const buttonY =
        canvasSize.height - margin + Math.round((margin - buttonHeight) / 2);

      g.beginFill(running ? 0x666666 : 0xff6b35);
      g.drawRoundedRect(buttonX, buttonY, buttonWidth, buttonHeight, 10);
      g.endFill();

      g.lineStyle(2, running ? 0x444444 : 0xff4500, 1);
      g.drawRoundedRect(buttonX, buttonY, buttonWidth, buttonHeight, 10);
    },
    [canvasSize, running, margin]
  );

  const textStyle = useMemo(
    () =>
      new TextStyle({
        fontFamily: "Arial",
        fontSize: 24,
        fontStyle: "italic",
        fontWeight: "bold",
        fill: ["#ffffff", "#00ff99"],
        stroke: "#4a1850",
        strokeThickness: 3,
        dropShadow: true,
        dropShadowColor: "#000000",
        dropShadowBlur: 2,
        dropShadowAngle: Math.PI / 6,
        dropShadowDistance: 3,
        wordWrap: true,
        wordWrapWidth: 300,
      }),
    []
  );

  const buttonTextStyle = useMemo(
    () =>
      new TextStyle({
        fontFamily: "Arial",
        fontSize: 20,
        fontWeight: "bold",
        fill: running ? "#888888" : "#ffffff",
        stroke: "#000000",
        strokeThickness: 2,
        dropShadow: true,
        dropShadowColor: "#000000",
        dropShadowBlur: 1,
        dropShadowDistance: 1,
      }),
    [running]
  );

  const reelContainerX =
    (canvasSize.width - REEL_WIDTH * VISIBLE_SYMBOLS_COUNT_HORIZONTAL) / 2;

  const reelContainerY =
    canvasSize.height / 2 -
    (SYMBOL_SIZE * (VISIBLE_SYMBOLS_COUNT_VERTICAL - 1)) / 2;

  if (!assetsLoaded) {
    return (
      <Container>
        <Text
          text={`Loading... ${Math.round(loadingProgress * 100)}%`}
          style={textStyle}
          x={canvasSize.width / 2}
          y={canvasSize.height / 2}
          anchor={0.5}
        />
      </Container>
    );
  }

  return (
    <Container>
      <Container x={reelContainerX} y={reelContainerY}>
        {reels.map((reel, i) => (
          <SlotReel
            key={i}
            x={i * REEL_WIDTH}
            symbols={SYMBOL_KEYS}
            symbolSize={SYMBOL_SIZE}
            position={reel.position}
            VISIBLE_SYMBOLS_COUNT_VERTICAL={VISIBLE_SYMBOLS_COUNT_VERTICAL}
          />
        ))}
      </Container>

      {/* <Graphics draw={drawTopCover} /> */}

      {/* <Text
        text="TRY YOUR LUCK!"
        style={textStyle}
        x={Math.round((canvasSize.width - 200) / 2)}
        y={Math.round(margin / 3)}
      /> */}

      <Graphics draw={drawBottomCover} />

      <Graphics draw={drawSpinButton} />

      <Container
        x={Math.round((canvasSize.width - 120) / 2)}
        y={canvasSize.height - margin + Math.round((margin - 50) / 2)}
        eventMode="static"
        cursor={running ? "not-allowed" : "pointer"}
        onclick={startPlay}
        interactive={true}
      >
        {/* <Graphics
          draw={(g) => {
            g.clear();
            g.beginFill(0x000000, 0.01);
            g.drawRoundedRect(0, 0, 120, 50, 10);
            g.endFill();
          }}
        /> */}

        <Text
          text={running ? "SPINNING..." : "SPIN!"}
          style={buttonTextStyle}
          x={60}
          y={25}
          anchor={0.5}
        />
      </Container>
    </Container>
  );
};
