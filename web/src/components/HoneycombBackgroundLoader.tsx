"use client";

import dynamic from "next/dynamic";

const HoneycombBackground = dynamic(
  () => import("@/components/HoneycombBackground").then((mod) => mod.HoneycombBackground),
  { ssr: false },
);

export function HoneycombBackgroundLoader({
  intensity = 0.5,
  speed = 0.6,
}: {
  intensity?: number;
  speed?: number;
}) {
  return <HoneycombBackground intensity={intensity} speed={speed} />;
}
