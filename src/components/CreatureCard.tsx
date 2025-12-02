"use client";
import Image from "next/image";
import { useCreatureStore } from "../lib/creatureStore";

export default function CreatureCard() {
  const stage = useCreatureStore((s) => s.stage);

  const stageImage = {
    1: "/creatures/stage1.png",
    2: "/creatures/stage2.png",
    3: "/creatures/stage3.png"
  }[stage];

  return (
    <div className="p-8 rounded-xl bg-gray-800 text-white text-center max-w-sm mx-auto">
      <h2 className="text-2xl font-bold mb-4">Your Sprout Creature</h2>
      <Image 
        src={stageImage} 
        alt="Creature stage"
        width={320}
        height={320}
        className="mx-auto"
      />
      <p className="mt-4">Stage {stage} evolution</p>
    </div>
  );
}
