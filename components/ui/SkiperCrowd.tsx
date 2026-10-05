"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { gsap } from "gsap";
import React, { useEffect, useRef } from "react";

/**
 * Walking crowd of Open Peeps (Skiper UI skiper39 pattern), drawn on canvas.
 * Sprite sheet: 15 x 7 grid, each cell 240 x 324 px.
 */

const ROLE_TAGS = [
  "💻 Backend dev",
  "🎨 Product designer",
  "🧠 ML engineer",
  "🚀 Growth lead",
  "🛠️ Hardware hacker",
  "✍️ Tech writer",
  "📱 Mobile dev",
  "🎓 CS student",
  "⚡ Hackathon team",
  "🔐 Security nerd",
];

type CrowdCanvasProps = {
  src?: string;
  rows?: number;
  cols?: number;
  /** CSS height of the canvas in px. */
  height?: number;
  /** Sprite scale on desktop. 1 = 240x324 px per person. */
  peepScale?: number;
  /** Draw small role pills above some walkers. */
  showTags?: boolean;
  className?: string;
};

type Peep = {
  rect: number[];
  width: number;
  height: number;
  x: number;
  y: number;
  anchorY: number;
  scaleX: number;
  tag: string | null;
  walk: gsap.core.Timeline | null;
};

export function CrowdCanvas({
  src = "/images/peeps/all-peeps.png",
  rows = 15,
  cols = 7,
  height = 380,
  peepScale = 0.82,
  showTags = true,
  className,
}: CrowdCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fontFamily = getComputedStyle(document.body).fontFamily || "system-ui, sans-serif";

    const img = new Image();
    const stage = { width: 0, height: 0, scale: peepScale, ground: 0 };
    const allPeeps: Peep[] = [];
    const available: Peep[] = [];
    const crowd: Peep[] = [];

    const rand = (min: number, max: number) => min + Math.random() * (max - min);
    const pickIndex = (arr: any[]) => (rand(0, arr.length) | 0);

    const createPeeps = () => {
      const w = img.naturalWidth / rows;
      const h = img.naturalHeight / cols;
      for (let i = 0; i < rows * cols; i++) {
        allPeeps.push({
          rect: [(i % rows) * w, ((i / rows) | 0) * h, w, h],
          width: w,
          height: h,
          x: 0,
          y: 0,
          anchorY: 0,
          scaleX: 1,
          tag: null,
          walk: null,
        });
      }
    };

    const removePeep = (peep: Peep) => {
      const idx = crowd.indexOf(peep);
      if (idx >= 0) crowd.splice(idx, 1);
      available.push(peep);
    };

    const addPeep = (): Peep | null => {
      if (!available.length) return null;
      const peep = available.splice(pickIndex(available), 1)[0];
      const s = stage.scale;
      const w = peep.width * s;
      const h = peep.height * s;
      const dir = Math.random() > 0.5 ? 1 : -1;
      // Small depth variance so the crowd layers naturally.
      const depth = rand(0, 14);
      const startY = stage.ground - h + depth;

      // When flipped (scaleX = -1) the sprite is drawn to the LEFT of x.
      let startX: number;
      let endX: number;
      if (dir === 1) {
        startX = -w;
        endX = stage.width;
        peep.scaleX = 1;
      } else {
        startX = stage.width + w;
        endX = 0;
        peep.scaleX = -1;
      }

      peep.x = startX;
      peep.y = startY;
      peep.anchorY = startY;
      peep.tag = showTags && Math.random() < 0.3 ? ROLE_TAGS[pickIndex(ROLE_TAGS)] : null;

      const distance = Math.abs(endX - startX);
      const speed = rand(55, 95); // px per second
      const duration = distance / speed;
      const step = 0.3;

      const tl = gsap.timeline({
        onComplete: () => {
          removePeep(peep);
          addPeep();
        },
      });
      tl.to(peep, { duration, x: endX, ease: "none" }, 0);
      tl.to(
        peep,
        { duration: step, repeat: Math.floor(duration / step), yoyo: true, y: startY - 6 * s },
        0
      );

      peep.walk = tl;
      crowd.push(peep);
      crowd.sort((a, b) => a.anchorY - b.anchorY);
      return peep;
    };

    const drawTag = (peep: Peep) => {
      if (!peep.tag) return;
      const s = stage.scale;
      const w = peep.width * s;
      const cx = peep.scaleX === 1 ? peep.x + w / 2 : peep.x - w / 2;
      const top = peep.y + 6 * s;

      ctx.font = `600 13px ${fontFamily}`;
      const textW = ctx.measureText(peep.tag).width;
      const boxW = textW + 22;
      const boxH = 26;
      const bx = cx - boxW / 2;
      const by = top - boxH - 6;

      ctx.fillStyle = "rgba(255,255,255,0.96)";
      ctx.strokeStyle = "rgba(17,17,24,0.12)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      if (typeof (ctx as any).roundRect === "function") {
        (ctx as any).roundRect(bx, by, boxW, boxH, 13);
      } else {
        ctx.rect(bx, by, boxW, boxH);
      }
      ctx.fill();
      ctx.stroke();

      // Little pointer under the pill
      ctx.beginPath();
      ctx.moveTo(cx - 5, by + boxH);
      ctx.lineTo(cx, by + boxH + 5);
      ctx.lineTo(cx + 5, by + boxH);
      ctx.closePath();
      ctx.fillStyle = "rgba(255,255,255,0.96)";
      ctx.fill();

      ctx.fillStyle = "#14141c";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(peep.tag, cx, by + boxH / 2 + 0.5);
    };

    const render = () => {
      const dpr = window.devicePixelRatio || 1;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(dpr, dpr);

      // Ground line
      ctx.strokeStyle = "rgba(20,20,28,0.14)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, stage.ground + 8);
      ctx.lineTo(stage.width, stage.ground + 8);
      ctx.stroke();

      const s = stage.scale;
      for (const peep of crowd) {
        const w = peep.width * s;
        const footX = peep.scaleX === 1 ? peep.x + w / 2 : peep.x - w / 2;

        // Contact shadow
        ctx.fillStyle = "rgba(20,20,28,0.10)";
        ctx.beginPath();
        ctx.ellipse(footX, peep.anchorY + peep.height * s - 2, w * 0.3, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.save();
        ctx.translate(peep.x, peep.y);
        ctx.scale(peep.scaleX * s, s);
        const [sx, sy, sw, sh] = peep.rect;
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, peep.width, peep.height);
        ctx.restore();
      }

      // Tags last so they always sit on top of the crowd.
      for (const peep of crowd) drawTag(peep);
    };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      stage.width = canvas.clientWidth;
      stage.height = canvas.clientHeight;
      canvas.width = stage.width * dpr;
      canvas.height = stage.height * dpr;

      // Responsive sizing: shrink people on small screens, never clip heads.
      const maxByHeight = (stage.height - 50) / 324;
      const widthFactor = stage.width < 520 ? 0.62 : stage.width < 900 ? 0.8 : 1;
      stage.scale = Math.min(peepScale * widthFactor, maxByHeight);
      stage.ground = stage.height - 22;

      crowd.forEach((p) => p.walk?.kill());
      crowd.length = 0;
      available.length = 0;
      available.push(...allPeeps);

      const personW = 240 * stage.scale;
      const target = Math.max(5, Math.min(18, Math.round(stage.width / (personW * 0.62))));
      while (available.length && crowd.length < target) {
        const p = addPeep();
        p?.walk?.progress(Math.random());
      }
      if (reduceMotion) crowd.forEach((p) => p.walk?.pause());
    };

    let resizeTimer: ReturnType<typeof setTimeout> | undefined;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150);
    };

    img.onload = () => {
      createPeeps();
      resize();
      gsap.ticker.add(render);
      window.addEventListener("resize", onResize);
    };
    img.src = src;

    return () => {
      img.onload = null;
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      gsap.ticker.remove(render);
      crowd.forEach((p) => p.walk?.kill());
    };
  }, [src, rows, cols, peepScale, showTags]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
      style={{ width: "100%", height: `${height}px`, display: "block", pointerEvents: "none" }}
    />
  );
}

/** Full-bleed crowd strip with soft faded edges. */
export function SkiperCrowd({ height = 380, peepScale = 0.82 }: { height?: number; peepScale?: number }) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        WebkitMaskImage: "linear-gradient(90deg, transparent 0, #000 8%, #000 92%, transparent 100%)",
        maskImage: "linear-gradient(90deg, transparent 0, #000 8%, #000 92%, transparent 100%)",
      }}
    >
      <CrowdCanvas height={height} peepScale={peepScale} />
    </div>
  );
}
