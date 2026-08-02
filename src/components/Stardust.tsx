import type { CSSProperties } from "react";

// ponytail: positions derived from the index rather than Math.random, so the
// motes don't reshuffle on every re-render and there's no state to hold.
const MOTES = Array.from({ length: 18 }, (_, i) => ({
  left: `${(i * 37) % 97}%`,
  top: `${(i * 53) % 89}%`,
  size: 1 + (i % 3),
  dur: `${9 + (i % 5) * 2.5}s`,
  delay: `${(i % 7) * 1.4}s`,
  dx: `${((i % 5) - 2) * 14}px`,
  dy: `${-18 - (i % 4) * 10}px`,
}));

export default function Stardust() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-[5] overflow-hidden"
      aria-hidden="true"
    >
      {MOTES.map((mote, i) => (
        <span
          key={i}
          className="stardust-mote"
          style={
            {
              left: mote.left,
              top: mote.top,
              width: mote.size,
              height: mote.size,
              "--dur": mote.dur,
              "--delay": mote.delay,
              "--dx": mote.dx,
              "--dy": mote.dy,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
