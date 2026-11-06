import type { ReactNode } from "react";
import type { Shape, Tone } from "@/lib/types";

const palettes: Record<Tone, { a: string; b: string; cap: string; capB: string; ink: string }> = {
  lime: { a: "#EEF1B4", b: "#BEC45C", cap: "#A9B04A", capB: "#7C8432", ink: "#353D1C" },
  honey: { a: "#FBE6A2", b: "#E3B13A", cap: "#C99A2A", capB: "#94701A", ink: "#45330C" },
  sage: { a: "#E9EEDA", b: "#A8B48A", cap: "#7D8A5E", capB: "#56613C", ink: "#2C351C" },
  ivory: { a: "#FFFEF9", b: "#E6DFCB", cap: "#CFC6AA", capB: "#A69C7D", ink: "#3A4425" },
  blush: { a: "#FBEDE3", b: "#E3BBA1", cap: "#C79C82", capB: "#9A715B", ink: "#4A3226" },
  olive: { a: "#9AA36B", b: "#4E5730", cap: "#38401F", capB: "#232914", ink: "#F3EFE4" },
};

type Props = {
  shape: Shape;
  tone: Tone;
  brand?: string;
  uid: string;
  className?: string;
};

export function ProductArt({ shape, tone, brand = "", uid, className }: Props) {
  const p = palettes[tone] ?? palettes.lime;
  const id = `pa-${uid}-${shape}-${tone}`.replace(/[^a-zA-Z0-9-]/g, "");
  const label = brand.toUpperCase().slice(0, 16);
  const labelSize = label.length > 11 ? 11 : label.length > 8 ? 13 : 15;

  const defs = (
    <defs>
      <linearGradient id={`${id}-body`} x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stopColor={p.b} />
        <stop offset="0.28" stopColor={p.a} />
        <stop offset="0.62" stopColor={p.a} />
        <stop offset="1" stopColor={p.b} />
      </linearGradient>
      <linearGradient id={`${id}-cap`} x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stopColor={p.capB} />
        <stop offset="0.35" stopColor={p.cap} />
        <stop offset="0.7" stopColor={p.cap} />
        <stop offset="1" stopColor={p.capB} />
      </linearGradient>
      <linearGradient id={`${id}-shine`} x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity="0.85" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
      <radialGradient id={`${id}-shadow`}>
        <stop offset="0" stopColor="#2A3214" stopOpacity="0.28" />
        <stop offset="1" stopColor="#2A3214" stopOpacity="0" />
      </radialGradient>
    </defs>
  );

  const shadow = <ellipse cx="120" cy="286" rx="78" ry="10" fill={`url(#${id}-shadow)`} />;
  const body = `url(#${id}-body)`;
  const cap = `url(#${id}-cap)`;
  const shine = `url(#${id}-shine)`;

  let art: ReactNode;

  switch (shape) {
    case "tube":
      art = (
        <>
          <path d="M90 228 C88 170 72 96 70 50 L170 50 C168 96 152 170 150 228 Z" fill={body} />
          <rect x="66" y="26" width="108" height="28" rx="4" fill={cap} />
          {Array.from({ length: 16 }, (_, i) => (
            <rect key={i} x={71 + i * 6.3} y="30" width="2" height="20" rx="1" fill={p.capB} opacity="0.35" />
          ))}
          <path d="M84 58 C86 112 95 176 100 224 L106 224 C102 176 94 112 93 58 Z" fill={shine} opacity="0.7" />
          <rect x="88" y="226" width="64" height="56" rx="10" fill={cap} />
          <rect x="88" y="226" width="64" height="7" rx="3" fill={p.capB} opacity="0.35" />
          <text
            x="0" y="0" transform="translate(132 140) rotate(-90)" textAnchor="middle"
            fontSize={labelSize} fontWeight="700" letterSpacing="2.4" fill={p.ink}
          >
            {label}
          </text>
          <line x1="142" x2="142" y1="74" y2="206" stroke={p.ink} strokeOpacity="0.35" strokeWidth="1" />
        </>
      );
      break;
    case "dropper":
      art = (
        <>
          <rect x="102" y="26" width="36" height="74" rx="18" fill={p.ink} opacity="0.92" />
          <rect x="108" y="32" width="6" height="52" rx="3" fill="#fff" opacity="0.25" />
          <rect x="92" y="94" width="56" height="30" rx="7" fill={cap} />
          <rect x="70" y="120" width="100" height="162" rx="26" fill={body} />
          <rect x="78" y="176" width="84" height="98" rx="20" fill={p.b} opacity="0.35" />
          <rect x="84" y="164" width="72" height="62" rx="8" fill="#fff" opacity="0.62" />
          <text x="120" y="192" textAnchor="middle" fontSize={labelSize - 2} fontWeight="700" letterSpacing="1.8" fill={p.ink}>
            {label}
          </text>
          <rect x="104" y="204" width="32" height="2" rx="1" fill={p.ink} opacity="0.4" />
          <rect x="80" y="130" width="9" height="140" rx="4.5" fill={shine} opacity="0.75" />
        </>
      );
      break;
    case "pump":
      art = (
        <>
          <path d="M98 44 H150 a6 6 0 0 1 6 6 V62 H98 Z" fill={cap} />
          <rect x="150" y="47" width="36" height="9" rx="4.5" fill={cap} />
          <rect x="113" y="60" width="14" height="30" fill={p.capB} />
          <rect x="96" y="86" width="48" height="30" rx="7" fill={cap} />
          <rect x="68" y="110" width="104" height="172" rx="30" fill={body} />
          <text x="120" y="196" textAnchor="middle" fontSize={labelSize} fontWeight="700" letterSpacing="2" fill={p.ink}>
            {label}
          </text>
          <rect x="100" y="208" width="40" height="2" rx="1" fill={p.ink} opacity="0.35" />
          <rect x="80" y="124" width="10" height="144" rx="5" fill={shine} opacity="0.75" />
        </>
      );
      break;
    case "jar":
      art = (
        <>
          <rect x="56" y="186" width="128" height="96" rx="28" fill={body} />
          <rect x="48" y="146" width="144" height="48" rx="14" fill={cap} />
          {Array.from({ length: 22 }, (_, i) => (
            <rect key={i} x={54 + i * 6.2} y="152" width="2" height="36" rx="1" fill={p.capB} opacity="0.28" />
          ))}
          <rect x="56" y="150" width="128" height="6" rx="3" fill="#fff" opacity="0.3" />
          <text x="120" y="244" textAnchor="middle" fontSize={labelSize} fontWeight="700" letterSpacing="2" fill={p.ink}>
            {label}
          </text>
          <rect x="66" y="198" width="10" height="72" rx="5" fill={shine} opacity="0.7" />
        </>
      );
      break;
    case "pouch":
      art = (
        <>
          <path
            d="M60 44 L66 36 L72 44 L78 36 L84 44 L90 36 L96 44 L102 36 L108 44 L114 36 L120 44 L126 36 L132 44 L138 36 L144 44 L150 36 L156 44 L162 36 L168 44 L174 36 L180 44 V274 a8 8 0 0 1 -8 8 H68 a8 8 0 0 1 -8 -8 Z"
            fill={body}
          />
          <rect x="60" y="54" width="120" height="14" fill={p.b} opacity="0.5" />
          <circle cx="120" cy="196" r="38" fill="#fff" opacity="0.55" />
          <path d="M120 170 C138 182 140 206 120 222 C100 206 102 182 120 170 Z" fill={p.cap} opacity="0.9" />
          <path d="M120 176 V218" stroke={p.capB} strokeWidth="1.5" opacity="0.6" />
          <text x="120" y="120" textAnchor="middle" fontSize={labelSize} fontWeight="700" letterSpacing="2" fill={p.ink}>
            {label}
          </text>
          <text x="120" y="140" textAnchor="middle" fontSize="9" fontWeight="600" letterSpacing="3" fill={p.ink} opacity="0.6">
            SHEET MASK
          </text>
          <rect x="70" y="76" width="8" height="190" rx="4" fill={shine} opacity="0.6" />
        </>
      );
      break;
    default:
      art = (
        <>
          <rect x="102" y="36" width="36" height="42" rx="9" fill={cap} />
          <rect x="98" y="72" width="44" height="210" rx="22" fill={body} />
          <text
            x="0" y="0" transform="translate(126 180) rotate(-90)" textAnchor="middle"
            fontSize={labelSize - 2} fontWeight="700" letterSpacing="2" fill={p.ink}
          >
            {label}
          </text>
          <rect x="104" y="84" width="7" height="186" rx="3.5" fill={shine} opacity="0.7" />
        </>
      );
  }

  return (
    <svg viewBox="0 0 240 300" className={className} role="img" aria-label={brand} preserveAspectRatio="xMidYMid meet">
      {defs}
      {shadow}
      {art}
    </svg>
  );
}
