import { round } from "./round";
import { blinq } from "blinq";
export const prettySize = (() => {
  const sizeUnits = ["B", "KB", "MB", "GB", "TB", "PB", "EB"];
  const sizes = sizeUnits.map((u, i) => ({ unit: u, size: 1024 ** i }));
  const round2 = round(2);
  const prettySize = (inputSize: number) => {
    const chosenSize = blinq(sizes)
      .takeWhile(({ size }) => size <= inputSize)
      .lastOrDefault();
    const cs = chosenSize || sizes[0];
    return `${round2(inputSize / cs.size)} ${cs.unit}`;
  };
  return prettySize;
})();
