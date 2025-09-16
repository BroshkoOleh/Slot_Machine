import { useCallback, useEffect } from "react";
import { Stage } from "@pixi/react";
import { useState } from "react";
import { calculateCanvasSize } from "../../helpers/common";
import { MainContainer } from "../MainContainer/MainContainer";

export const MainSlotMachine = () => {
  const [canvaSize, setCanvasSize] = useState(calculateCanvasSize);

  const updateCanvasSize = useCallback(() => {
    setCanvasSize(calculateCanvasSize());
  }, []);

  useEffect(() => {
    window.addEventListener("resize", updateCanvasSize);
    return () => {
      window.removeEventListener("resize", updateCanvasSize);
    };
  }, [updateCanvasSize]);

  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  return (
    <Stage
      width={canvaSize.width}
      height={canvaSize.height}
      options={{
        autoDensity: true,
        resolution: dpr,
        backgroundAlpha: 0,
        resizeTo: window,
      }}
      style={{ width: "100vw", height: "100vh" }}
    >
      <MainContainer canvasSize={canvaSize}></MainContainer>
    </Stage>
  );
};
