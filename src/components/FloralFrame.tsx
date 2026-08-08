import type { SVGProps } from "react";

// One spray, drawn for the top-left, then flipped into the other three corners.
// Mirroring costs a transform; hand-drawing each would cost four sets of path data.
// Set inside the corner rather than flush to it, so the sprays read as foliage
// lying behind the page instead of a frame drawn around it. Never past the edge —
// hanging them outside meant the wrapper's overflow-hidden sliced them.
const CORNERS = [
  "top-2 left-2 sm:top-6 sm:left-6",
  "top-2 right-2 sm:top-6 sm:right-6 -scale-x-100",
  "bottom-2 left-2 sm:bottom-6 sm:left-6 -scale-y-100",
  "bottom-2 right-2 sm:bottom-6 sm:right-6 -scale-100",
];

// The stem runs straight along each edge and turns a square corner, so the leaves
// grow off the lines x=STEM and y=STEM. Leaves and blooms are each drawn once in
// <defs> and stamped with <use> — the tables below are just placements.
const STEM = 7;

// The corner turns through a quarter-circle of this radius instead of a hard
// miter. The arc is symmetric about the diagonal, so it is drawn once while the
// two arms stay reflections of each other.
const CORNER_R = 16;

// [distance along the stem, rotation, scale, offset from the stem line].
// Every row differs from every other on purpose: an even −45/+45 alternation at
// even spacing is what made this read as a stamped pattern rather than a drawing.
// The offset lifts each leaf a little off the line so they attach at varied points.
const LEAVES: [number, number, number, number][] = [
  [25, -58, 0.52, -1], [30, 38, 0.44, 1.5], [34, -34, 0.36, -2.5],
  [36, -49, 0.62, 0.5], [41, 55, 0.5, 2],
  [52, -41, 0.46, -1.5], [56, 33, 0.55, 1],
  [66, -62, 0.4, 0], [71, 44, 0.34, 1.5],
  [74, -28, 0.3, -1],
];

// Two short sprigs branching off the main stem, so the foliage is not all sitting
// on one line. [start along the stem, path relative to that point, leaf angle, scale]
const SPRIGS: [number, string, number, number][] = [
  [30, "c 3,-4 8,-6 12,-6.5", -30, 0.44],
  [61, "c 2,4 6,6.5 10,7", 34, 0.38],
];

// Sparse and small on purpose: the reference card is mostly foliage, with blooms
// as punctuation. Scaling these up is what makes it read as clip art.
// [distance along the stem, scale, offset from the stem line]
const BLOOMS: [number, number, number][] = [[33, 0.58, -1.5], [46, 0.44, 1.5], [64, 0.36, -1]];

function FloralCorner({ className }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none">
      <defs>
        <path id="petal-leaf" d="M0,0 C5,-6 15,-7 22,0 C15,7 5,6 0,0 Z" />
        <g id="petal-bloom">
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse key={a} cx="4.6" cy="0" rx="3.4" ry="2.1" transform={`rotate(${a})`} />
          ))}
          <circle r="1.9" className="fill-brand-rose/70" />
        </g>

        {/* The stem dissolves toward its far end instead of stopping dead in a
            round cap, so it needs no particular place to finish. */}
        <linearGradient id="petal-stem" gradientUnits="userSpaceOnUse" x1={STEM} y1="0" x2="92" y2="0">
          <stop offset="0" stopColor="var(--color-brand-gold)" stopOpacity="0.75" />
          <stop offset="0.6" stopColor="var(--color-brand-gold)" stopOpacity="0.55" />
          <stop offset="1" stopColor="var(--color-brand-gold)" stopOpacity="0" />
        </linearGradient>

        {/* One arm, drawn along the top edge. Reflecting it across the diagonal
            (the matrix below swaps x and y) gives the other arm for free. */}
        <g id="petal-arm">
          <path d={`M${STEM + CORNER_R},${STEM} H92`} stroke="url(#petal-stem)" strokeWidth="1.1" />

          {SPRIGS.map(([d, curve, r, s]) => (
            <g key={d}>
              <path
                d={`M${d},${STEM} ${curve}`}
                stroke="url(#petal-stem)"
                strokeWidth="0.7"
                strokeLinecap="round"
              />
              <use
                href="#petal-leaf"
                className="fill-brand-olive/40"
                transform={`translate(${d + 11} ${STEM + (r < 0 ? -6 : 6)}) rotate(${r}) scale(${s})`}
              />
            </g>
          ))}

          <g className="fill-brand-olive/40">
            {LEAVES.map(([d, r, s, off]) => (
              <use
                key={d}
                href="#petal-leaf"
                transform={`translate(${d} ${STEM + off}) rotate(${r}) scale(${s})`}
              />
            ))}
          </g>

          <g className="fill-brand-gold/75">
            {BLOOMS.map(([d, s, off]) => (
              <use key={d} href="#petal-bloom" transform={`translate(${d} ${STEM + off}) scale(${s})`} />
            ))}
          </g>
        </g>
      </defs>

      {/* The rounded turn, shared by both arms */}
      <path
        d={`M${STEM},${STEM + CORNER_R} A${CORNER_R},${CORNER_R} 0 0 1 ${STEM + CORNER_R},${STEM}`}
        stroke="url(#petal-stem)"
        strokeWidth="1.1"
      />

      <use href="#petal-arm" />
      <use href="#petal-arm" transform="matrix(0 1 1 0 0 0)" />

      {/* Sitting on the midpoint of the turn */}
      <use
        href="#petal-bloom"
        className="fill-brand-gold/75"
        transform={`translate(${STEM + CORNER_R - CORNER_R / Math.SQRT2} ${
          STEM + CORNER_R - CORNER_R / Math.SQRT2
        }) scale(0.7)`}
      />
    </svg>
  );
}

/** A botanical spray on two opposite corners, as on the printed card. Drawn, not
 *  photographed — so it recolours with the tokens and stays crisp at any size. */
export default function FloralFrame() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {CORNERS.map((corner) => (
        <FloralCorner key={corner} className={`absolute w-40 sm:w-64 ${corner}`} />
      ))}
    </div>
  );
}
