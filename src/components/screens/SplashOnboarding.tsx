import React, { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useDeshiMart } from '../../context/DeshiMartContext';

type FlowStep = 0 | 1 | 2 | 3 | 4 | 5;

/* =====================  CUSTOM ANIMATED SVGs  ===================== */

const BagLogoSvg: React.FC = () => (
  <svg viewBox="0 0 104 104" aria-hidden="true">
    <path
      className="hd"
      d="M36 38C36 18 68 18 68 38"
      fill="none"
      stroke="currentColor"
      strokeWidth="7"
      strokeLinecap="round"
    />
    <path
      d="M16 36H88L82 86Q81 92 75 92H29Q23 92 22 86Z"
      fill="currentColor"
    />
    <polyline
      className="tick"
      points="35,52 52,72 70,52"
      fill="none"
      stroke="var(--tick)"
      strokeWidth="9"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const BackIconSvg: React.FC = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

const EyeIconSvg: React.FC<{ show: boolean }> = ({ show }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.9"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M2 12s3.8-7 10-7 10 7 10 7-3.8 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
    {!show && <path d="M4 4l16 16" />}
  </svg>
);

const GoogleIconSvg: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" className="shrink-0">
    <path
      fill="#4285F4"
      d="M23.5 12.3c0-.8-.1-1.5-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.7v3h3.9c2.3-2.1 3.5-5.2 3.5-8.9z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.2 0 6-1.1 7.9-2.9l-3.9-3c-1.1.7-2.5 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1A12 12 0 0 0 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.4 14.3a7.2 7.2 0 0 1 0-4.6V6.6H1.4a12 12 0 0 0 0 10.8l4-3.1z"
    />
    <path
      fill="#EA4335"
      d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.4 6.6l4 3.1C6.3 6.9 8.9 4.8 12 4.8z"
    />
  </svg>
);

const FacebookIconSvg: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" className="shrink-0">
    <circle cx="12" cy="12" r="12" fill="#1877F2" />
    <path
      fill="#fff"
      d="M13.4 19v-6.2h2.1l.4-2.6h-2.5V8.6c0-.8.3-1.3 1.4-1.3H16V5.1c-.3 0-1.1-.1-2-.1-2 0-3.4 1.2-3.4 3.4v1.9H8.4v2.6h2.2V19z"
    />
  </svg>
);

/**
 * Globe + Spinning Continents + Clouds + Graticule + Trade Beacons + Detailed Cargo Boxes + Twin-Engine Cargo Plane
 */
const GlobeBoxesPlaneArt: React.FC<{ variant: 'splash' | 'ob' }> = ({
  variant,
}) => {
  const uid = useId().replace(/:/g, '');
  const ocId = `oc-${uid}`;
  const sdId = `sd-${uid}`;
  const atmoId = `atmo-${uid}`;
  const gcId = `gc-${uid}`;
  const contId = `cont-${uid}`;
  const cloudId = `cloud-${uid}`;
  const boxTopId = `btop-${uid}`;
  const boxSideId = `bside-${uid}`;

  const isSplash = variant === 'splash';

  return (
    <div
      className={`dm-flow-art ${
        isSplash ? 'dm-flow-art-splash' : 'dm-flow-art-ob'
      }`}
    >
      <svg viewBox="0 0 300 260" aria-hidden="true">
        <defs>
          {/* Multi-stop ocean depth gradient */}
          <radialGradient id={ocId} cx="32%" cy="28%" r="82%">
            <stop offset="0" stopColor="#e2f7e8" />
            <stop offset=".35" stopColor="#9edbb0" />
            <stop offset=".72" stopColor="#58ad74" />
            <stop offset="1" stopColor="#2b7546" />
          </radialGradient>

          {/* Spherical 3D terminator shadow & rim light */}
          <radialGradient id={sdId} cx="32%" cy="28%" r="78%">
            <stop offset=".5" stopColor="rgba(0,0,0,0)" />
            <stop offset=".84" stopColor="rgba(9,45,24,.24)" />
            <stop offset="1" stopColor="rgba(5,28,15,.48)" />
          </radialGradient>

          {/* Outer atmosphere aura */}
          <radialGradient id={atmoId} cx="50%" cy="50%" r="50%">
            <stop offset="72%" stopColor="rgba(116,212,146,0)" />
            <stop
              offset="90%"
              stopColor={
                isSplash ? 'rgba(180,245,200,0.28)' : 'rgba(63,154,90,0.2)'
              }
            />
            <stop offset="100%" stopColor="rgba(116,212,146,0)" />
          </radialGradient>

          <linearGradient id={boxTopId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f4d39b" />
            <stop offset="1" stopColor="#dfb06c" />
          </linearGradient>

          <linearGradient id={boxSideId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#dfa964" />
            <stop offset="1" stopColor="#bc823c" />
          </linearGradient>

          <clipPath id={gcId}>
            <circle cx="120" cy="140" r="95" />
          </clipPath>

          {/* Detailed tileable 200px continent + highland + island topology */}
          <g id={contId}>
            {/* North-West Continent & Highland */}
            <path
              d="M42 94c8-14 26-22 44-16c14 5 24 16 18 30c-5 11-18 14-25 23c-7 9-12 18-24 15c-14-3-20-18-17-31c1-8-2-14 4-21z"
              fill="#358f52"
            />
            <path
              d="M54 96c8-9 21-12 31-7c8 4 12 12 7 20c-4 7-14 9-20 14c-8 5-16-2-18-12c-1-6-3-11 0-15z"
              fill="#5ec07b"
              opacity="0.72"
            />
            {/* Mountain range ridge */}
            <path
              d="M62 98l6-7l6 8l5-5l6 7"
              fill="none"
              stroke="#d9f5e1"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.65"
            />

            {/* Eurasia / South Asia (Bangladesh Hub Region) */}
            <path
              d="M122 68c16-12 42-14 60-4c15 8 26 24 20 39c-5 12-20 16-30 14c-9-2-14 6-22 10c-11 5-24 0-30-11c-6-12-10-38 2-48z"
              fill="#2f854b"
            />
            <path
              d="M134 74c12-7 30-8 42-1c10 6 16 17 11 26c-4 8-16 10-25 7c-11-3-22-4-27-14c-3-6-5-14-1-18z"
              fill="#62c47f"
              opacity="0.7"
            />
            {/* Himalayan snow ridge */}
            <path
              d="M144 82l7-8l7 8l6-6l7 7"
              fill="none"
              stroke="#e5faeb"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.7"
            />

            {/* Southern Continent / Africa-Australia Mass */}
            <path
              d="M126 146c15-9 36-4 46 11c9 14 8 34-6 45c-13 10-32 8-42-6c-9-12-11-41 2-50z"
              fill="#358f52"
            />
            <path
              d="M136 156c10-5 24-1 30 9c5 9 4 22-5 28c-9 6-21 3-26-6c-5-9-6-27 1-31z"
              fill="#64c580"
              opacity="0.65"
            />

            {/* South-West Peninsula & Archipelago Islands */}
            <path
              d="M74 172c11-6 24 0 28 12c4 12-4 25-16 26c-12 1-20-11-18-23c1-7 1-12 6-15z"
              fill="#3c9658"
            />
            <circle cx="109" cy="134" r="5.5" fill="#4aa866" />
            <circle cx="118" cy="141" r="3.5" fill="#62c47f" />
            <circle cx="192" cy="136" r="6" fill="#3c9658" />
            <circle cx="203" cy="145" r="4" fill="#62c47f" />
            <circle cx="52" cy="154" r="4.5" fill="#4aa866" />
          </g>

          {/* Tileable 200px drifting cloud layer */}
          <g id={cloudId} fill="#ffffff" opacity="0.42">
            <path d="M48 82h28a6 6 0 0 1 0 12H48a6 6 0 0 1 0-12z" />
            <circle cx="58" cy="80" r="7" />
            <circle cx="67" cy="82" r="5.5" />

            <path d="M138 118h34a7 7 0 0 1 0 14h-34a7 7 0 0 1 0-14z" />
            <circle cx="150" cy="115" r="8" />
            <circle cx="161" cy="117" r="6.5" />

            <path d="M86 168h26a5.5 5.5 0 0 1 0 11H86a5.5 5.5 0 0 1 0-11z" />
            <circle cx="96" cy="166" r="6.5" />

            <path d="M188 76h24a5 5 0 0 1 0 10h-24a5 5 0 0 1 0-10z" />
            <circle cx="198" cy="74" r="6" />
          </g>
        </defs>

        {/* Floating Globe Assembly */}
        <g className="gf">
          {/* Outer atmospheric glow halo */}
          <circle cx="120" cy="140" r="112" fill={`url(#${atmoId})`} />
          <circle
            cx="120"
            cy="140"
            r="101"
            fill="none"
            stroke={isSplash ? 'rgba(255,255,255,0.18)' : 'rgba(63,154,90,0.22)'}
            strokeWidth="1.2"
            strokeDasharray="4 6"
          />

          {/* Polar Ice Cap Crown Hints & Base Ocean Sphere */}
          <circle cx="120" cy="140" r="95" fill={`url(#${ocId})`} />

          {/* Clipped Spherical Contents */}
          <g clipPath={`url(#${gcId})`}>
            {/* Polar Ice Caps */}
            <ellipse
              cx="120"
              cy="46"
              rx="52"
              ry="12"
              fill="#f3fbf6"
              opacity="0.55"
            />
            <ellipse
              cx="120"
              cy="234"
              rx="48"
              ry="11"
              fill="#f3fbf6"
              opacity="0.45"
            />

            {/* Subtle Cartographic Latitude & Longitude Graticule */}
            <g
              fill="none"
              stroke="#1b5e34"
              strokeOpacity="0.14"
              strokeWidth="1"
            >
              {/* Latitude parallels */}
              <line x1="25" y1="140" x2="215" y2="140" strokeDasharray="3 3" />
              <path d="M30 105 Q120 118 210 105" />
              <path d="M42 74 Q120 86 198 74" />
              <path d="M30 175 Q120 162 210 175" />
              <path d="M42 206 Q120 194 198 206" />
              {/* Longitude meridians */}
              <ellipse cx="120" cy="140" rx="32" ry="95" />
              <ellipse cx="120" cy="140" rx="66" ry="95" />
              <line x1="120" y1="45" x2="120" y2="235" />
            </g>

            {/* Spinning Continents Layer */}
            <g className="land">
              <use href={`#${contId}`} />
              <use href={`#${contId}`} x="200" />
            </g>

            {/* Active Trade Hub Beacons & Connecting Trade Arcs */}
            <g>
              {/* Curved Trade Route Arcs on Sphere */}
              <path
                d="M72 104 Q112 72 152 108"
                fill="none"
                stroke="#fff7d6"
                strokeWidth="1.6"
                strokeDasharray="3 4"
                opacity="0.85"
              />
              <path
                d="M95 168 Q128 148 152 108"
                fill="none"
                stroke="#fff7d6"
                strokeWidth="1.5"
                strokeDasharray="3 4"
                opacity="0.75"
              />

              {/* Origin Hub 1 (US/EU) */}
              <circle
                className="hub-beacon"
                cx="72"
                cy="104"
                r="6"
                fill="none"
                stroke="#ffffff"
                strokeWidth="1.6"
              />
              <circle cx="72" cy="104" r="3" fill="#ffffff" />

              {/* Origin Hub 2 (SG/AU) */}
              <circle
                className="hub-beacon hub-beacon-delay"
                cx="95"
                cy="168"
                r="5.5"
                fill="none"
                stroke="#ffffff"
                strokeWidth="1.5"
              />
              <circle cx="95" cy="168" r="2.6" fill="#ffffff" />

              {/* Primary Destination Hub (Dhaka, Bangladesh) */}
              <circle
                className="hub-beacon"
                cx="152"
                cy="108"
                r="8"
                fill="none"
                stroke="#ffe082"
                strokeWidth="2"
              />
              <circle
                cx="152"
                cy="108"
                r="4"
                fill="#ffd54f"
                stroke="#ffffff"
                strokeWidth="1.2"
              />
            </g>

            {/* Parallax Drifting Atmospheric Clouds */}
            <g className="clouds">
              <use href={`#${cloudId}`} />
              <use href={`#${cloudId}`} x="200" />
            </g>
          </g>

          {/* 3D Spherical Shading & Rim Specular Gloss */}
          <circle cx="120" cy="140" r="95" fill={`url(#${sdId})`} />
          <circle
            cx="120"
            cy="140"
            r="94.2"
            fill="none"
            stroke="rgba(255,255,255,0.42)"
            strokeWidth="1.5"
          />
          <ellipse
            cx="84"
            cy="92"
            rx="28"
            ry="14"
            fill="#fff"
            opacity=".26"
            transform="rotate(-32 84 92)"
          />
          <ellipse
            cx="66"
            cy="112"
            rx="10"
            ry="5"
            fill="#fff"
            opacity=".18"
            transform="rotate(-32 66 112)"
          />

          {/* Tilted Orbital Trade Ring Wrapping Globe */}
          <path
            className="orbit-ring"
            d="M18 158 C 45 196, 195 178, 222 122"
            fill="none"
            stroke={isSplash ? 'rgba(255,255,255,0.65)' : 'rgba(42,122,70,0.55)'}
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          {/* Orbiting GPS Logistics Satellite Node */}
          <g transform="translate(36 168) rotate(-18)">
            <rect x="-4" y="-3" width="8" height="6" rx="1.5" fill="#fff" />
            <rect x="-11" y="-2" width="6" height="4" rx="1" fill="#86c898" />
            <rect x="5" y="-2" width="6" height="4" rx="1" fill="#86c898" />
          </g>
        </g>

        {/* Botanical Leaves with Vein Detail */}
        <g className="leaf">
          <path d="M216 112q24-28 43-4q-15 22-43 4z" fill="#3f9a5a" />
          <path
            d="M220 112q18-10 34-3"
            fill="none"
            stroke="#a5e3b7"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        </g>
        <g className="leaf" style={{ animationDelay: '-1.2s' }}>
          <path d="M235 125q22-15 33 6q-15 13-33-6z" fill="#2b7e47" />
          <path
            d="M238 125q14-4 26 4"
            fill="none"
            stroke="#8ed6a3"
            strokeWidth="1.1"
            strokeLinecap="round"
          />
        </g>

        {/* Detailed Cross-Border Parcel Box 1 (Front Left) */}
        <g className="box b1">
          {/* Drop shadow */}
          <ellipse
            cx="203"
            cy="235"
            rx="36"
            ry="4"
            fill="rgba(12,42,24,0.22)"
          />
          <rect
            x="168"
            y="182"
            width="70"
            height="52"
            rx="4"
            fill={`url(#${boxSideId})`}
          />
          <rect
            x="168"
            y="182"
            width="70"
            height="12"
            rx="3"
            fill={`url(#${boxTopId})`}
          />
          {/* Center packing tape */}
          <rect x="196" y="182" width="14" height="52" fill="#f6e2b5" />
          <line
            x1="168"
            y1="194"
            x2="238"
            y2="194"
            stroke="#b57935"
            strokeWidth="1"
          />
          {/* Shipping Label & Barcode */}
          <rect x="174" y="201" width="17" height="12" rx="1.5" fill="#fff" />
          <line x1="176" y1="204" x2="188" y2="204" stroke="#26382e" strokeWidth="1.2" />
          <line x1="176" y1="207" x2="184" y2="207" stroke="#3f9a5a" strokeWidth="1.2" />
          <line x1="177" y1="210" x2="177" y2="212" stroke="#26382e" strokeWidth="1" />
          <line x1="180" y1="210" x2="180" y2="212" stroke="#26382e" strokeWidth="1.5" />
          <line x1="183" y1="210" x2="183" y2="212" stroke="#26382e" strokeWidth="1" />
          <line x1="186" y1="210" x2="186" y2="212" stroke="#26382e" strokeWidth="1.4" />
          {/* Care / Fragile Up Arrows */}
          <path
            d="M222 218l3-4l3 4M225 214v9M230 218l3-4l3 4M233 214v9"
            fill="none"
            stroke="#8c581c"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* Detailed Cross-Border Parcel Box 2 (Right) */}
        <g className="box b2">
          <ellipse
            cx="261"
            cy="235"
            rx="26"
            ry="3.5"
            fill="rgba(12,42,24,0.2)"
          />
          <rect x="236" y="196" width="50" height="38" rx="3.5" fill="#c68d4a" />
          <rect x="236" y="196" width="50" height="10" rx="3" fill="#e4b778" />
          <rect x="255" y="196" width="12" height="38" fill="#f2d8a3" />
          <line
            x1="236"
            y1="206"
            x2="286"
            y2="206"
            stroke="#a67030"
            strokeWidth="1"
          />
          {/* Customs Verified Green Badge */}
          <circle cx="276" cy="222" r="5" fill="#3f9a5a" />
          <path
            d="M273.5 222l1.8 1.8l3.2-3.2"
            fill="none"
            stroke="#fff"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        </g>

        {/* Detailed Cross-Border Parcel Box 3 (Top Stacked) */}
        <g className="box b3">
          <rect x="178" y="146" width="48" height="36" rx="3.5" fill="#e2b273" />
          <rect x="178" y="146" width="48" height="10" rx="3" fill="#f4d39e" />
          <rect x="196" y="146" width="12" height="36" fill="#faeac5" />
          <line
            x1="178"
            y1="156"
            x2="226"
            y2="156"
            stroke="#c49250"
            strokeWidth="1"
          />
          <rect x="211" y="162" width="10" height="7" rx="1" fill="#fff" opacity="0.9" />
          <line x1="213" y1="165" x2="219" y2="165" stroke="#3f9a5a" strokeWidth="1.2" />
        </g>
      </svg>

      {/* Dual Flight Route Trail & Synchronized Cargo Jet inside the exact 300x260 SVG coordinate space */}
      <svg className="trail" viewBox="0 0 300 260" aria-hidden="true">
        <path
          d="M-18 102C62 24 172-14 260 42"
          fill="none"
          strokeOpacity=".88"
          strokeWidth="2.2"
          strokeDasharray="2 7"
          strokeLinecap="round"
        />
        <path
          d="M-18 108C62 30 172-8 260 48"
          fill="none"
          strokeOpacity=".32"
          strokeWidth="1"
          strokeDasharray="4 8"
          strokeLinecap="round"
        />
      </svg>

      {/* Cargo Jet Moving Along the Exact 300x260 SVG Flight Path */}
      <svg viewBox="0 0 300 260" aria-hidden="true">
        <g className="plane-track">
          <g className="plane-bob" transform="translate(-22, -22)">
            {/* Swept Wings & Under-wing Engines */}
            <path
              className="fuselage"
              d="M17 18L10 3L16 3L28 18zM17 26L10 41L16 41L28 26z"
            />
            <ellipse className="fuselage" cx="20" cy="11" rx="3.2" ry="1.6" />
            <ellipse className="fuselage" cx="20" cy="33" rx="3.2" ry="1.6" />
            {/* Tail Stabilizers */}
            <path
              className="fuselage"
              d="M5 18L1 10L7 10L11 18zM5 26L1 34L7 34L11 26z"
            />
            {/* Fuselage Body */}
            <path
              className="fuselage"
              d="M2 22Q2 18 9 18L33 18Q42 18 42 22Q42 26 33 26L9 26Q2 26 2 22z"
            />
            {/* Cockpit & Cabin Windows */}
            <path
              d="M35 20.2C37.5 20.2 39 21 39 22C39 23 37.5 23.8 35 23.8Z"
              fill={isSplash ? '#14523d' : '#ffffff'}
              opacity="0.88"
            />
            <circle
              cx="29"
              cy="22"
              r="1"
              fill={isSplash ? '#14523d' : '#ffffff'}
              opacity="0.78"
            />
            <circle
              cx="25"
              cy="22"
              r="1"
              fill={isSplash ? '#14523d' : '#ffffff'}
              opacity="0.78"
            />
            <circle
              cx="21"
              cy="22"
              r="1"
              fill={isSplash ? '#14523d' : '#ffffff'}
              opacity="0.78"
            />
          </g>
        </g>
      </svg>
    </div>
  );
};

/**
 * Onboarding 2: Safe & Secure Shopping Illustration (Detailed)
 */
const SafeSecureArt: React.FC = () => {
  const uid = useId().replace(/:/g, '');
  const shgId = `shg-${uid}`;

  return (
    <svg className="dm-flow-il" viewBox="0 0 300 260" aria-hidden="true">
      <defs>
        <linearGradient id={shgId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#65bf81" />
          <stop offset="1" stopColor="#257341" />
        </linearGradient>
      </defs>
      <circle cx="150" cy="135" r="102" fill="#eaf6ee" />
      <circle
        cx="150"
        cy="135"
        r="90"
        fill="none"
        stroke="#cde6d4"
        strokeWidth="1.5"
        strokeDasharray="5 6"
      />

      {/* Smartphone with Encrypted Checkout UI */}
      <g className="ph">
        <rect
          x="95"
          y="32"
          width="110"
          height="194"
          rx="18"
          fill="#fff"
          stroke="#9ccdab"
          strokeWidth="4"
        />
        {/* Top Speaker & Front Camera */}
        <rect x="130" y="43" width="34" height="5" rx="2.5" fill="#cfe6d5" />
        <circle cx="172" cy="45.5" r="2.5" fill="#9ccdab" />
        {/* Top SSL Verified Pill */}
        <rect x="112" y="58" width="76" height="14" rx="7" fill="#eaf6ee" />
        <circle cx="121" cy="65" r="3.5" fill="#3f9a5a" />
        <rect x="129" y="63" width="48" height="4" rx="2" fill="#86c898" />

        {/* Central Security Padlock */}
        <g transform="translate(150 125)">
          <path
            className="shk"
            d="M-14-4V-16a14 14 0 0 1 28 0V-4"
            fill="none"
            stroke="#5d7065"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <rect x="-24" y="-6" width="48" height="38" rx="8" fill="#6f8579" />
          <rect x="-20" y="-2" width="40" height="30" rx="6" fill="#7d9487" />
          <circle cy="10" r="5" fill="#fff" />
          <rect x="-2" y="10" width="4" height="12" rx="2" fill="#fff" />
        </g>

        {/* Bottom Order Verification Lines */}
        <rect x="114" y="175" width="72" height="6" rx="3" fill="#e3f2e8" />
        <rect x="126" y="187" width="48" height="5" rx="2.5" fill="#cfe6d5" />
      </g>

      {/* Smart Payment Card with EMV Chip & Contactless Waves */}
      <g className="cd">
        <g transform="rotate(-8 77 194)">
          <rect x="20" y="158" width="114" height="70" rx="10" fill="#3f9a5a" />
          <rect x="20" y="174" width="114" height="12" fill="#1b5e34" />
          {/* Gold EMV Chip */}
          <rect x="32" y="194" width="18" height="13" rx="2.5" fill="#f3cf7a" />
          <line x1="32" y1="200" x2="50" y2="200" stroke="#c89b3c" strokeWidth="1" />
          <line x1="41" y1="194" x2="41" y2="207" stroke="#c89b3c" strokeWidth="1" />
          {/* Cardholder digits */}
          <rect x="32" y="213" width="36" height="6" rx="3" fill="#cfe6d5" />
          <circle cx="110" cy="214" r="6" fill="#f3cf7a" opacity="0.85" />
          <circle cx="118" cy="214" r="6" fill="#cfe6d5" opacity="0.85" />
        </g>
      </g>

      {/* Radiating Shield Pulse & 3D Check Shield */}
      <circle
        className="pls"
        cx="225"
        cy="172"
        r="38"
        fill="none"
        stroke="#3f9a5a"
        strokeWidth="3"
      />
      <g className="sh">
        <path
          d="M225 118l-42 15v33c0 31 23 48 42 56c19-8 42-25 42-56v-33z"
          fill={`url(#${shgId})`}
        />
        <path
          d="M225 125l-35 12.5v28c0 26 19 40 35 47c16-7 35-21 35-47v-28z"
          fill="none"
          stroke="rgba(255,255,255,0.32)"
          strokeWidth="2"
        />
        <polyline
          className="ck"
          points="205,170 220,185 246,155"
          fill="none"
          stroke="#fff"
          strokeWidth="9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

/**
 * Onboarding 3: Fast & Reliable Delivery Truck Illustration (Detailed)
 */
const FastDeliveryArt: React.FC = () => (
  <svg className="dm-flow-il" viewBox="0 0 300 260" aria-hidden="true">
    <circle cx="150" cy="140" r="102" fill="#eaf6ee" />
    {/* Subtle Dhaka Skyline Silhouette */}
    <path
      d="M52 205v-38h18v38M74 205v-52h22v52M100 205v-30h16v30M208 205v-46h20v46M232 205v-28h16v28"
      fill="#dceee2"
    />
    <rect x="10" y="205" width="280" height="6" rx="3" fill="#cfe6d5" />
    <line
      className="dash"
      x1="0"
      y1="226"
      x2="300"
      y2="226"
      stroke="#9ccdab"
      strokeWidth="3"
      strokeDasharray="18 14"
      strokeLinecap="round"
    />
    <g className="spd" stroke="#9ccdab" strokeWidth="3" strokeLinecap="round">
      <line x1="12" y1="130" x2="38" y2="130" />
      <line x1="4" y1="152" x2="34" y2="152" />
      <line x1="14" y1="174" x2="36" y2="174" />
    </g>
    <g className="pin">
      <ellipse
        className="pr"
        cx="254"
        cy="112"
        rx="18"
        ry="5"
        fill="none"
        stroke="#3f9a5a"
        strokeWidth="2"
      />
      <path
        d="M232 60a22 22 0 1 1 44 0c0 18-22 40-22 40s-22-22-22-40z"
        fill="#3f9a5a"
      />
      <circle cx="254" cy="60" r="8" fill="#fff" />
    </g>
    <g className="box b1" style={{ animationDelay: '1.1s' }}>
      <rect x="236" y="170" width="46" height="36" rx="3" fill="#d9a566" />
      <rect x="236" y="170" width="46" height="9" rx="3" fill="#ecc388" />
      <rect x="253" y="170" width="12" height="36" fill="#f3dba9" />
      <rect x="241" y="184" width="9" height="7" rx="1" fill="#fff" />
    </g>
    <g className="truck">
      <g className="tb">
        {/* Cargo Box Container */}
        <rect x="40" y="105" width="120" height="85" rx="6" fill="#d9a566" />
        <rect x="40" y="105" width="120" height="14" rx="6" fill="#ecc388" />
        <rect x="92" y="105" width="16" height="85" fill="#f3dba9" />
        {/* Express Brand Stripe & Check Badge on Container */}
        <rect x="40" y="142" width="120" height="10" fill="#c58c4b" opacity="0.45" />
        <circle cx="66" cy="147" r="9" fill="#3f9a5a" />
        <path
          d="M62 147l3 3l5.5-5.5"
          fill="none"
          stroke="#fff"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        {/* Truck Cab */}
        <path
          d="M164 130h34l22 28v32h-56z"
          fill="#fff"
          stroke="#9ccdab"
          strokeWidth="3"
        />
        <path d="M172 138h22l14 18h-36z" fill="#cfe6d5" />
        {/* Door handle & Headlight */}
        <rect x="174" y="164" width="10" height="3" rx="1.5" fill="#9ccdab" />
        <rect x="215" y="168" width="5" height="9" rx="2" fill="#f6c453" />
        <rect x="40" y="186" width="180" height="6" rx="2" fill="#3f9a5a" />
      </g>
      <g transform="translate(85 192)">
        <g className="wl">
          <circle r="15" fill="#33433a" />
          <circle r="6" fill="#cfd8d2" />
          <path d="M-11 0h22M0-11v22" stroke="#cfd8d2" strokeWidth="2" />
        </g>
      </g>
      <g transform="translate(190 192)">
        <g className="wl">
          <circle r="15" fill="#33433a" />
          <circle r="6" fill="#cfd8d2" />
          <path d="M-11 0h22M0-11v22" stroke="#cfd8d2" strokeWidth="2" />
        </g>
      </g>
    </g>
  </svg>
);

/* =====================  RIPPLE BUTTON HELPER  ===================== */

const RippleButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & { delaySec?: number }
> = ({ children, className = '', delaySec, onClick, ...rest }) => {
  const [ripples, setRipples] = useState<
    Array<{ id: number; x: number; y: number }>
  >([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - 22;
    const y = e.clientY - rect.top - 22;
    const id = Date.now() + Math.random();
    setRipples((prev) => [...prev, { id, x, y }]);
    window.setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 650);
    onClick?.(e);
  };

  return (
    <button
      {...rest}
      onClick={handleClick}
      style={
        delaySec !== undefined
          ? ({ '--d': delaySec } as React.CSSProperties)
          : undefined
      }
      className={`dm-flow-btn ${delaySec !== undefined ? 'dm-flow-a' : ''} ${className}`}
    >
      {children}
      {ripples.map((r) => (
        <span
          key={r.id}
          className="dm-flow-rp"
          style={{ left: r.x, top: r.y }}
        />
      ))}
    </button>
  );
};

/* =====================  MAIN COMPONENT  ===================== */

export const SplashOnboarding: React.FC = () => {
  const { currentScreen, navigateTo, loginUser, showToast } = useDeshiMart();

  const initialStep: FlowStep =
    currentScreen === 'splash'
      ? 0
      : currentScreen === 'onboarding'
      ? 1
      : 4;

  const [step, setStep] = useState<FlowStep>(initialStep);
  const [slideDirection, setSlideDirection] = useState<1 | -1>(1);
  const pointerStartX = useRef<number | null>(null);

  // Auth Form State (Clean initial state without hardcoded real credentials)
  const [loginRole, setLoginRole] = useState<'customer' | 'admin'>('customer');
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPw, setShowLoginPw] = useState(false);
  const [loginShake, setLoginShake] = useState(false);
  const [loginErrors, setLoginErrors] = useState<{
    identifier?: string;
    password?: string;
    form?: string;
  }>({});
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPw, setShowRegPw] = useState(false);
  const [regShake, setRegShake] = useState(false);
  const [regErrors, setRegErrors] = useState<{
    name?: string;
    phone?: string;
    password?: string;
  }>({});
  const [isRegistering, setIsRegistering] = useState(false);

  // Sync when external navigation changes currentScreen
  useEffect(() => {
    if (currentScreen === 'splash') setStep(0);
    else if (currentScreen === 'onboarding' && (step < 1 || step > 3)) setStep(1);
    else if (currentScreen === 'auth' && step < 4) setStep(4);
  }, [currentScreen]);

  const goStep = (next: FlowStep) => {
    if (next === step) return;
    setSlideDirection(next > step ? 1 : -1);
    setStep(next);
  };

  // Splash auto-advances after 3.5s as confirmed
  useEffect(() => {
    if (step !== 0) return;
    const timer = window.setTimeout(() => {
      goStep(1);
    }, 3500);
    return () => window.clearTimeout(timer);
  }, [step]);

  // Pointer swipe support on Onboarding slides (1..3)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    pointerStartX.current = e.clientX;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (pointerStartX.current === null) return;
    const dx = e.clientX - pointerStartX.current;
    pointerStartX.current = null;
    if (step >= 1 && step <= 3 && Math.abs(dx) > 45) {
      if (dx < 0) {
        goStep((step === 3 ? 4 : step + 1) as FlowStep);
      } else {
        goStep((step - 1) as FlowStep);
      }
    }
  };

  const triggerShake = (which: 'login' | 'reg', msg?: string) => {
    if (msg) showToast(msg, 'info');
    if (which === 'login') {
      setLoginShake(false);
      window.setTimeout(() => setLoginShake(true), 10);
    } else {
      setRegShake(false);
      window.setTimeout(() => setRegShake(true), 10);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoggingIn) return;

    const trimmedId = loginIdentifier.trim();
    const trimmedPw = loginPassword.trim();
    const nextErrors: { identifier?: string; password?: string; form?: string } = {};

    if (!trimmedId) {
      nextErrors.identifier = 'Enter your email address or Bangladesh phone number.';
    } else if (
      !trimmedId.includes('@') &&
      !/^(\+?880|0)?1[3-9]\d{8}$/.test(trimmedId.replace(/[\s-]/g, '')) &&
      trimmedId.length < 4
    ) {
      nextErrors.identifier = 'Enter a valid email (name@example.com) or BD mobile number.';
    }

    if (!trimmedPw) {
      nextErrors.password = 'Enter your account password.';
    } else if (trimmedPw.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters.';
    }

    if (Object.keys(nextErrors).length > 0) {
      setLoginErrors(nextErrors);
      triggerShake('login');
      return;
    }

    setLoginErrors({});
    setIsLoggingIn(true);
    const isAdminLogin = loginRole === 'admin';
    window.setTimeout(() => {
      setIsLoggingIn(false);
      loginUser(
        trimmedId,
        isAdminLogin ? 'Nakib Prince' : 'Tanvir Ahmed',
        isAdminLogin ? 'admin' : 'customer'
      );
    }, 180);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegistering) return;

    const trimmedName = regName.trim();
    const trimmedPhone = regPhone.trim();
    const nextErrors: { name?: string; phone?: string; password?: string } = {};

    if (!trimmedName) {
      nextErrors.name = 'Enter your full name.';
    }
    if (!trimmedPhone) {
      nextErrors.phone = 'Enter your Bangladesh mobile number.';
    }
    if (regPassword.trim().length < 8) {
      nextErrors.password = 'Password must be at least 8 characters.';
    }

    if (Object.keys(nextErrors).length > 0) {
      setRegErrors(nextErrors);
      triggerShake('reg');
      return;
    }

    setRegErrors({});
    setIsRegistering(true);
    window.setTimeout(() => {
      setIsRegistering(false);
      loginUser(trimmedPhone, trimmedName);
    }, 180);
  };

  const handleSocialLogin = (provider: 'Google' | 'Facebook') => {
    if (isLoggingIn || isRegistering) return;
    loginUser(`tanvir.${provider.toLowerCase()}@deshimart.bd`, 'Tanvir Ahmed');
  };

  const renderDots = (activeIdx: number, isSplash = false) => (
    <div
      role="tablist"
      aria-label="Onboarding slide indicator"
      className={`flex items-center justify-center gap-1.5 ${
        isSplash ? '' : 'my-2'
      }`}
    >
      {[0, 1, 2].map((k) => {
        const active = k === activeIdx;
        return (
          <button
            key={k}
            type="button"
            role="tab"
            aria-selected={active}
            aria-label={`Go to slide ${k + 1}`}
            onClick={(e) => {
              e.stopPropagation();
              goStep((k + 1) as FlowStep);
            }}
            className="py-2 px-1 flex items-center justify-center focus-visible:outline-none"
          >
            <span
              className={`block h-[7px] rounded-full transition-all duration-300 ${
                active
                  ? isSplash
                    ? 'w-[24px] bg-white'
                    : 'w-[24px] bg-[#059669]'
                  : isSplash
                  ? 'w-[7px] bg-white/40 hover:bg-white/65'
                  : 'w-[7px] bg-[#DFEAE3] hover:bg-[#A7C4B5]'
              }`}
            />
          </button>
        );
      })}
    </div>
  );

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      className="relative flex-1 w-full h-full overflow-hidden bg-white select-none flex flex-col"
    >
      <AnimatePresence mode="wait" initial={false}>
        {/* =====================  0: SPLASH SCREEN (3.5s AUTO-ADVANCE, ZERO VERTICAL CROWDING) ===================== */}
        {step === 0 && (
          <motion.section
            key="flow-splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.26, ease: 'easeOut' }}
            onClick={() => goStep(1)}
            className="dm-flow-splash relative flex-1 flex flex-col items-center justify-between px-6 pt-5 pb-5 overflow-hidden cursor-pointer"
          >
            <div className="dm-flow-glow absolute inset-0 pointer-events-none" />

            {/* Top bar with quick Skip to Store option */}
            <div className="relative z-10 w-full flex items-center justify-between">
              <span className="text-[11px] font-medium text-white/75 tracking-wide">
                Tap anywhere to continue
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  navigateTo('home');
                }}
                className="min-h-[36px] text-xs leading-4 font-semibold text-white/90 hover:text-white bg-white/14 hover:bg-white/22 px-3.5 py-1.5 rounded-full backdrop-blur-xs transition-colors whitespace-nowrap"
              >
                Skip to Store →
              </button>
            </div>

            {/* Center Brand Identity (Balanced vertical proportions so globe & parcels never collide) */}
            <div className="relative z-10 flex flex-col items-center my-auto py-1">
              <div className="relative w-[82px] h-[82px] flex items-center justify-center">
                <div className="dm-flow-ring" />
                <div className="dm-flow-ring" />
                <div className="dm-flow-logo dm-flow-logo-splash">
                  <BagLogoSvg />
                </div>
              </div>

              <h1
                aria-label="DeshiMart"
                className="mt-3.5 text-[32px] sm:text-[34px] leading-[38px] font-bold tracking-tight flex justify-center text-white"
              >
                {'DeshiMart'.split('').map((ch, idx) => (
                  <span
                    key={idx}
                    className="dm-flow-ltr"
                    style={{ '--i': idx } as React.CSSProperties}
                  >
                    {ch}
                  </span>
                ))}
              </h1>

              <p className="dm-flow-sp mt-1 text-[14px] leading-5 font-medium text-emerald-50">
                Cross-Border Landed Shopping
              </p>

              <p className="dm-flow-tg mt-1.5 text-[12px] leading-4 text-white/85 flex items-center gap-1.5">
                <span>Global Products</span>
                <span aria-hidden="true">·</span>
                <span>Local Dreams</span>
              </p>
            </div>

            {/* Bottom Animated Globe + Parcel Boxes + Plane + 3.5s Auto-Advance Bar */}
            <div className="relative z-10 flex flex-col items-center w-full shrink-0">
              <GlobeBoxesPlaneArt variant="splash" />
              <div className="w-36 h-1 rounded-full bg-white/20 overflow-hidden mt-2">
                <div className="dm-splash-progress-fill h-full w-full bg-white rounded-full" />
              </div>
              <div className="mt-0.5">{renderDots(0, true)}</div>
            </div>
          </motion.section>
        )}

        {/* =====================  1–3: ONBOARDING SCREENS (DIRECTIONAL SLIDE MOTION & SAFE VIEWBOX) ===================== */}
        {(step === 1 || step === 2 || step === 3) && (
          <motion.section
            key="flow-ob-shell"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24, ease: 'easeOut' }}
            className="flex-1 flex flex-col justify-between px-6 pt-5 pb-5 text-center bg-white text-[#0F1D17] overflow-hidden"
          >
            {/* Stationary Top Header + Directional Animated Copy */}
            <div className="shrink-0">
              <div className="flex items-center justify-between w-full">
                <button
                  type="button"
                  aria-label="Back"
                  onClick={() => goStep((step - 1) as FlowStep)}
                  className="w-11 h-11 -ml-2 rounded-full grid place-items-center text-[#17231E] hover:bg-[#EFF4F1] active:bg-[#E2ECE6] transition-colors"
                >
                  <BackIconSvg />
                </button>

                <span className="font-mono-num text-xs font-semibold text-[#485B52]">
                  {step} / 3
                </span>

                <button
                  type="button"
                  aria-label="Account Login"
                  onClick={() => goStep(4)}
                  className="w-11 h-11 -mr-2 rounded-full grid place-items-center text-[#059669] hover:bg-[#EFF4F1] active:bg-[#E2ECE6] transition-colors"
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#059669"
                    strokeWidth="1.9"
                    strokeLinecap="round"
                  >
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 21c0-4.5 3.6-7 8-7s8 2.5 8 7" />
                  </svg>
                </button>
              </div>

              <div className="min-h-[96px] flex flex-col justify-center mt-1 px-1">
                <AnimatePresence mode="wait" initial={false} custom={slideDirection}>
                  <motion.div
                    key={`ob-copy-${step}`}
                    custom={slideDirection}
                    initial={{ opacity: 0, x: slideDirection * 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: slideDirection * -24 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <h2 className="text-[20px] sm:text-[21px] leading-[26px] font-bold text-[#0F1D17] text-balance">
                      {step === 1 && 'Worldwide Products Delivered to Your Door'}
                      {step === 2 && 'Safe & Secure Shopping'}
                      {step === 3 && 'Fast & Reliable Delivery'}
                    </h2>

                    <p className="text-[13px] leading-5 text-[#485B52] mt-1.5 max-w-[32ch] mx-auto">
                      {step === 1 &&
                        'Discover the best products from global brands with upfront BD customs & VAT.'}
                      {step === 2 &&
                        'Your bKash, Nagad, card payments and personal data are always protected.'}
                      {step === 3 &&
                        'Track your order in real-time from our global warehouse to your doorstep.'}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Center Illustration Stage with Directional Swipe Motion & Safe Overflow Padding */}
            <div className="flex-1 flex items-center justify-center min-h-0 py-2 px-2">
              <AnimatePresence mode="wait" initial={false} custom={slideDirection}>
                <motion.div
                  key={`ob-art-${step}`}
                  custom={slideDirection}
                  initial={{ opacity: 0, x: slideDirection * 32, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: slideDirection * -32, scale: 0.96 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full flex items-center justify-center"
                >
                  {step === 1 && <GlobeBoxesPlaneArt variant="ob" />}
                  {step === 2 && <SafeSecureArt />}
                  {step === 3 && <FastDeliveryArt />}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Stationary Bottom Dots + CTA + Skip */}
            <div className="shrink-0">
              {renderDots(step - 1, false)}

              <RippleButton
                type="button"
                delaySec={0}
                className="!opacity-100 !animate-none"
                onClick={() =>
                  step === 3 ? goStep(4) : goStep((step + 1) as FlowStep)
                }
              >
                {step === 3 ? 'Get Started' : 'Next'}
              </RippleButton>

              <div className="mt-2.5 h-7 flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => navigateTo('home')}
                  className="min-h-[36px] px-3 text-[13px] font-semibold text-[#16865F] hover:underline"
                >
                  {step < 3 ? 'Skip to Store' : 'Browse Store as Guest →'}
                </button>
              </div>
            </div>
          </motion.section>
        )}

        {/* =====================  4: LOGIN SCREEN (REFINED TYPOGRAPHY, 8PT SPACING & ACCESSIBILITY) ===================== */}
        {step === 4 && (
          <motion.section
            key="flow-login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className="flex-1 min-h-0 overflow-y-auto no-scrollbar bg-[var(--auth-surface)] text-[var(--auth-text-main)] select-text"
          >
            <div className="min-h-full w-full max-w-[392px] mx-auto px-5 pt-3 pb-5 flex flex-col justify-between">
              {/* 1. Top Navigation Bar (44x44px back target & balanced Skip to Store) */}
              <header className="flex items-center justify-between w-full shrink-0">
                <button
                  type="button"
                  aria-label="Back to onboarding"
                  onClick={() => goStep(3)}
                  className="w-11 h-11 -ml-2.5 rounded-full grid place-items-center text-[var(--auth-text-main)] hover:bg-[#EFF5F2] active:bg-[#E2ECE7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16865F] transition-colors duration-150"
                >
                  <BackIconSvg />
                </button>
                <button
                  type="button"
                  onClick={() => navigateTo('home')}
                  className="min-h-[44px] px-2 -mr-1.5 inline-flex items-center gap-1 text-[12.5px] leading-[1.4] font-semibold text-[var(--auth-interactive)] hover:text-[var(--auth-hover)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16865F] rounded-lg transition-colors duration-150 whitespace-nowrap"
                >
                  <span>Skip to Store</span>
                  <span aria-hidden="true" className="text-[13px] leading-none">
                    →
                  </span>
                </button>
              </header>

              {/* 2. Unified Brand Header + Auth Form + Social Authentication */}
              <div className="w-full my-auto py-3">
                {/* Brand Mark + Heading + Subtitle */}
                <div className="text-center mb-6">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-[#EEF6F2] border border-[#DCE7E0]/80 flex items-center justify-center shadow-[0_1px_2px_rgba(6,95,70,0.06)]">
                    <div className="dm-flow-logo dm-flow-logo-sm">
                      <BagLogoSvg />
                    </div>
                  </div>

                  <h1 className="mt-3 text-[22px] sm:text-[23px] leading-[1.25] font-bold text-[var(--auth-text-main)] tracking-[-0.02em] whitespace-nowrap">
                    {loginRole === 'admin' ? 'Admin Console Sign In' : 'Welcome Back'}
                  </h1>

                  <p className="mt-1.5 text-[13.5px] leading-[1.5] font-normal text-[var(--auth-text-secondary)]">
                    {loginRole === 'admin'
                      ? 'Authorized DeshiMart operations & catalog portal'
                      : 'Sign in to your DeshiMart cross-border account'}
                  </p>
                </div>

                {/* Login Form */}
                <form
                  onSubmit={handleLoginSubmit}
                  noValidate
                  className={`text-left space-y-4 ${
                    loginShake ? 'dm-flow-shake' : ''
                  }`}
                >
                  {/* Email or Phone Field */}
                  <div>
                    <label
                      htmlFor="dm-login-identifier"
                      className="block text-[12.5px] leading-[1.4] font-semibold text-[var(--auth-text-main)] mb-1.5"
                    >
                      Email or Phone
                    </label>
                    <div
                      className={`flex items-center h-[46px] px-3.5 rounded-xl border bg-[var(--auth-input-bg)] transition-all duration-150 ${
                        loginErrors.identifier
                          ? 'border-[var(--auth-error)] bg-[var(--auth-error-bg)]/40 focus-within:border-[var(--auth-error)] focus-within:ring-3 focus-within:ring-[#B42318]/14'
                          : 'border-[var(--auth-border)] hover:border-[var(--auth-border-hover)] focus-within:border-[var(--auth-interactive)] focus-within:bg-white focus-within:ring-3 focus-within:ring-[var(--auth-focus-ring)]'
                      }`}
                    >
                      <input
                        id="dm-login-identifier"
                        name="username"
                        type="text"
                        inputMode="email"
                        value={loginIdentifier}
                        disabled={isLoggingIn}
                        onChange={(e) => {
                          setLoginIdentifier(e.target.value);
                          if (loginErrors.identifier) {
                            setLoginErrors((prev) => ({ ...prev, identifier: undefined }));
                          }
                        }}
                        placeholder={
                          loginRole === 'admin'
                            ? 'admin@deshimart.bd'
                            : 'name@example.com or +880 17...'
                        }
                        autoComplete="username"
                        aria-invalid={Boolean(loginErrors.identifier)}
                        aria-describedby={
                          loginErrors.identifier ? 'dm-login-identifier-error' : undefined
                        }
                        className="flex-1 min-w-0 bg-transparent border-0 outline-none text-[13.5px] leading-[1.45] font-medium text-[var(--auth-text-main)] placeholder:text-[var(--auth-text-muted)] placeholder:font-normal disabled:opacity-60"
                      />
                    </div>
                    {loginErrors.identifier && (
                      <p
                        id="dm-login-identifier-error"
                        role="alert"
                        className="mt-1.5 flex items-center gap-1.5 text-[12px] leading-[1.4] font-medium text-[var(--auth-error)]"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                          className="shrink-0"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="8" x2="12" y2="12" />
                          <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        <span>{loginErrors.identifier}</span>
                      </p>
                    )}
                  </div>

                  {/* Password Field & Recovery Link */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <label
                        htmlFor="dm-login-password"
                        className="text-[12.5px] leading-[1.4] font-semibold text-[var(--auth-text-main)]"
                      >
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          showToast('Password reset link sent to your email/SMS', 'info')
                        }
                        className="min-h-[28px] -my-1 px-1 text-[12px] leading-[1.4] font-semibold text-[var(--auth-interactive)] hover:text-[var(--auth-hover)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16865F] rounded transition-colors duration-150 whitespace-nowrap"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div
                      className={`flex items-center h-[46px] pl-3.5 pr-1 rounded-xl border bg-[var(--auth-input-bg)] transition-all duration-150 ${
                        loginErrors.password
                          ? 'border-[var(--auth-error)] bg-[var(--auth-error-bg)]/40 focus-within:border-[var(--auth-error)] focus-within:ring-3 focus-within:ring-[#B42318]/14'
                          : 'border-[var(--auth-border)] hover:border-[var(--auth-border-hover)] focus-within:border-[var(--auth-interactive)] focus-within:bg-white focus-within:ring-3 focus-within:ring-[var(--auth-focus-ring)]'
                      }`}
                    >
                      <input
                        id="dm-login-password"
                        name="password"
                        type={showLoginPw ? 'text' : 'password'}
                        value={loginPassword}
                        disabled={isLoggingIn}
                        onChange={(e) => {
                          setLoginPassword(e.target.value);
                          if (loginErrors.password) {
                            setLoginErrors((prev) => ({ ...prev, password: undefined }));
                          }
                        }}
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        aria-invalid={Boolean(loginErrors.password)}
                        aria-describedby={
                          loginErrors.password ? 'dm-login-password-error' : undefined
                        }
                        className="flex-1 min-w-0 bg-transparent border-0 outline-none text-[13.5px] leading-[1.45] font-medium text-[var(--auth-text-main)] placeholder:text-[var(--auth-text-muted)] placeholder:font-normal disabled:opacity-60"
                      />
                      <button
                        type="button"
                        aria-label={showLoginPw ? 'Hide password' : 'Show password'}
                        aria-pressed={showLoginPw}
                        onClick={() => setShowLoginPw((v) => !v)}
                        className="w-10 h-10 rounded-lg grid place-items-center text-[var(--auth-text-muted)] hover:text-[var(--auth-text-main)] hover:bg-[#E8F0EC]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16865F] transition-colors duration-150 shrink-0"
                      >
                        <EyeIconSvg show={showLoginPw} />
                      </button>
                    </div>
                    {loginErrors.password && (
                      <p
                        id="dm-login-password-error"
                        role="alert"
                        className="mt-1.5 flex items-center gap-1.5 text-[12px] leading-[1.4] font-medium text-[var(--auth-error)]"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                          className="shrink-0"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="8" x2="12" y2="12" />
                          <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        <span>{loginErrors.password}</span>
                      </p>
                    )}
                  </div>

                  {/* Primary Login CTA */}
                  <div className="pt-1">
                    <RippleButton
                      type="submit"
                      disabled={isLoggingIn}
                      aria-busy={isLoggingIn}
                    >
                      {isLoggingIn ? (
                        <span className="inline-flex items-center justify-center gap-2">
                          <svg
                            className="w-4 h-4 animate-spin text-white shrink-0"
                            viewBox="0 0 24 24"
                            fill="none"
                            aria-hidden="true"
                          >
                            <circle
                              cx="12"
                              cy="12"
                              r="9"
                              stroke="currentColor"
                              strokeWidth="2.5"
                               className="opacity-30"
                            />
                            <path
                              d="M21 12a9 9 0 0 0-9-9"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                            />
                          </svg>
                          <span>
                            {loginRole === 'admin'
                              ? 'Signing in to Console...'
                              : 'Signing in...'}
                          </span>
                        </span>
                      ) : loginRole === 'admin' ? (
                        'Sign In to Admin Console'
                      ) : (
                        'Login'
                      )}
                    </RippleButton>
                  </div>
                </form>

                {/* Social Authentication Divider */}
                <div
                  role="separator"
                  aria-label="or continue with"
                  className="flex items-center gap-3 text-[var(--auth-text-muted)] text-[11.5px] leading-[1.4] font-normal my-5 before:content-[''] before:flex-1 before:h-px before:bg-[var(--auth-border)] after:content-[''] after:flex-1 after:h-px after:bg-[var(--auth-border)]"
                >
                  <span>or continue with</span>
                </div>

                {/* 2-Column Google & Facebook Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    disabled={isLoggingIn}
                    onClick={() => handleSocialLogin('Google')}
                    className="flex items-center justify-center gap-2 w-full h-[44px] px-3 bg-[var(--auth-surface)] border border-[var(--auth-border)] rounded-xl text-[12.5px] leading-[1.4] font-semibold text-[var(--auth-text-main)] hover:border-[var(--auth-border-hover)] hover:bg-[#FAFDFB] active:bg-[#EFF5F2] active:scale-[0.985] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[var(--auth-focus-ring)] transition-all duration-150 whitespace-nowrap disabled:opacity-60"
                  >
                    <GoogleIconSvg />
                    <span>Google</span>
                  </button>
                  <button
                    type="button"
                    disabled={isLoggingIn}
                    onClick={() => handleSocialLogin('Facebook')}
                    className="flex items-center justify-center gap-2 w-full h-[44px] px-3 bg-[var(--auth-surface)] border border-[var(--auth-border)] rounded-xl text-[12.5px] leading-[1.4] font-semibold text-[var(--auth-text-main)] hover:border-[var(--auth-border-hover)] hover:bg-[#FAFDFB] active:bg-[#EFF5F2] active:scale-[0.985] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[var(--auth-focus-ring)] transition-all duration-150 whitespace-nowrap disabled:opacity-60"
                  >
                    <FacebookIconSvg />
                    <span>Facebook</span>
                  </button>
                </div>
              </div>

              {/* 3. Registration Prompt & Discreet Staff Console Link */}
              <footer className="shrink-0 pt-3 text-center space-y-2">
                <p className="text-[12.5px] leading-[1.5] font-normal text-[var(--auth-text-secondary)]">
                  Don&apos;t have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setLoginErrors({});
                      goStep(5);
                    }}
                    className="font-semibold text-[var(--auth-interactive)] hover:text-[var(--auth-hover)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16865F] rounded px-0.5 transition-colors duration-150"
                  >
                    Register
                  </button>
                </p>

                <div>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginErrors({});
                      if (loginRole === 'customer') {
                        setLoginRole('admin');
                        if (!loginIdentifier) setLoginIdentifier('admin@deshimart.bd');
                        if (!loginPassword) setLoginPassword('admin1234');
                      } else {
                        setLoginRole('customer');
                        if (loginIdentifier === 'admin@deshimart.bd') {
                          setLoginIdentifier('');
                        }
                        if (loginPassword === 'admin1234') {
                          setLoginPassword('');
                        }
                      }
                    }}
                    className="inline-flex items-center justify-center gap-1 min-h-[32px] px-2 text-[11.5px] leading-[1.5] font-medium text-[var(--auth-text-muted)] hover:text-[var(--auth-interactive)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16865F] rounded transition-colors duration-150"
                  >
                    {loginRole === 'admin' ? (
                      <>
                        <span aria-hidden="true">←</span>
                        <span>Switch back to Customer Sign In</span>
                      </>
                    ) : (
                      <>
                        <span>Staff member? Switch to Admin Console</span>
                        <span aria-hidden="true">→</span>
                      </>
                    )}
                  </button>
                </div>
              </footer>
            </div>
          </motion.section>
        )}

        {/* =====================  5: REGISTER SCREEN (MATCHING TYPOGRAPHY & 8PT SPACING SYSTEM) ===================== */}
        {step === 5 && (
          <motion.section
            key="flow-register"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className="flex-1 min-h-0 overflow-y-auto no-scrollbar bg-[var(--auth-surface)] text-[var(--auth-text-main)] select-text"
          >
            <div className="min-h-full w-full max-w-[392px] mx-auto px-5 pt-3 pb-5 flex flex-col justify-between">
              {/* 1. Top Navigation Bar */}
              <header className="flex items-center justify-between w-full shrink-0">
                <button
                  type="button"
                  aria-label="Back to Login"
                  onClick={() => goStep(4)}
                  className="w-11 h-11 -ml-2.5 rounded-full grid place-items-center text-[var(--auth-text-main)] hover:bg-[#EFF5F2] active:bg-[#E2ECE7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16865F] transition-colors duration-150"
                >
                  <BackIconSvg />
                </button>
                <button
                  type="button"
                  onClick={() => navigateTo('home')}
                  className="min-h-[44px] px-2 -mr-1.5 inline-flex items-center gap-1 text-[12.5px] leading-[1.4] font-semibold text-[var(--auth-interactive)] hover:text-[var(--auth-hover)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16865F] rounded-lg transition-colors duration-150 whitespace-nowrap"
                >
                  <span>Skip to Store</span>
                  <span aria-hidden="true" className="text-[13px] leading-none">
                    →
                  </span>
                </button>
              </header>

              {/* 2. Brand Header + Register Form + Social Authentication */}
              <div className="w-full my-auto py-2.5">
                <div className="text-center mb-5">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-[#EEF6F2] border border-[#DCE7E0]/80 flex items-center justify-center shadow-[0_1px_2px_rgba(6,95,70,0.06)]">
                    <div className="dm-flow-logo dm-flow-logo-sm">
                      <BagLogoSvg />
                    </div>
                  </div>

                  <h1 className="mt-2.5 text-[22px] sm:text-[23px] leading-[1.25] font-bold text-[var(--auth-text-main)] tracking-[-0.02em] whitespace-nowrap">
                    Create Your Account
                  </h1>
                  <p className="mt-1 text-[13.5px] leading-[1.5] font-normal text-[var(--auth-text-secondary)]">
                    Join DeshiMart and start global shopping
                  </p>
                </div>

                <form
                  onSubmit={handleRegisterSubmit}
                  noValidate
                  className={`text-left space-y-3.5 ${
                    regShake ? 'dm-flow-shake' : ''
                  }`}
                >
                  <div>
                    <label
                      htmlFor="dm-reg-name"
                      className="block text-[12.5px] leading-[1.4] font-semibold text-[var(--auth-text-main)] mb-1.5"
                    >
                      Full Name
                    </label>
                    <div
                      className={`flex items-center h-[44px] px-3.5 rounded-xl border bg-[var(--auth-input-bg)] transition-all duration-150 ${
                        regErrors.name
                          ? 'border-[var(--auth-error)] bg-[var(--auth-error-bg)]/40 focus-within:border-[var(--auth-error)] focus-within:ring-3 focus-within:ring-[#B42318]/14'
                          : 'border-[var(--auth-border)] hover:border-[var(--auth-border-hover)] focus-within:border-[var(--auth-interactive)] focus-within:bg-white focus-within:ring-3 focus-within:ring-[var(--auth-focus-ring)]'
                      }`}
                    >
                      <input
                        id="dm-reg-name"
                        name="name"
                        type="text"
                        value={regName}
                        disabled={isRegistering}
                        onChange={(e) => {
                          setRegName(e.target.value);
                          if (regErrors.name) {
                            setRegErrors((prev) => ({ ...prev, name: undefined }));
                          }
                        }}
                        placeholder="Tanvir Ahmed"
                        autoComplete="name"
                        aria-invalid={Boolean(regErrors.name)}
                        aria-describedby={regErrors.name ? 'dm-reg-name-error' : undefined}
                        className="flex-1 min-w-0 bg-transparent border-0 outline-none text-[13.5px] leading-[1.45] font-medium text-[var(--auth-text-main)] placeholder:text-[var(--auth-text-muted)] placeholder:font-normal"
                      />
                    </div>
                    {regErrors.name && (
                      <p
                        id="dm-reg-name-error"
                        role="alert"
                        className="mt-1 text-[12px] leading-[1.4] font-medium text-[var(--auth-error)]"
                      >
                        {regErrors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="dm-reg-phone"
                      className="block text-[12.5px] leading-[1.4] font-semibold text-[var(--auth-text-main)] mb-1.5"
                    >
                      Phone Number (Bangladesh)
                    </label>
                    <div
                      className={`flex items-center h-[44px] px-3.5 rounded-xl border bg-[var(--auth-input-bg)] transition-all duration-150 ${
                        regErrors.phone
                          ? 'border-[var(--auth-error)] bg-[var(--auth-error-bg)]/40 focus-within:border-[var(--auth-error)] focus-within:ring-3 focus-within:ring-[#B42318]/14'
                          : 'border-[var(--auth-border)] hover:border-[var(--auth-border-hover)] focus-within:border-[var(--auth-interactive)] focus-within:bg-white focus-within:ring-3 focus-within:ring-[var(--auth-focus-ring)]'
                      }`}
                    >
                      <input
                        id="dm-reg-phone"
                        name="tel"
                        type="tel"
                        value={regPhone}
                        disabled={isRegistering}
                        onChange={(e) => {
                          setRegPhone(e.target.value);
                          if (regErrors.phone) {
                            setRegErrors((prev) => ({ ...prev, phone: undefined }));
                          }
                        }}
                        placeholder="+880 1712 345678"
                        autoComplete="tel"
                        aria-invalid={Boolean(regErrors.phone)}
                        aria-describedby={regErrors.phone ? 'dm-reg-phone-error' : undefined}
                        className="flex-1 min-w-0 bg-transparent border-0 outline-none text-[13.5px] leading-[1.45] font-medium text-[var(--auth-text-main)] placeholder:text-[var(--auth-text-muted)] placeholder:font-normal font-mono-num"
                      />
                    </div>
                    {regErrors.phone && (
                      <p
                        id="dm-reg-phone-error"
                        role="alert"
                        className="mt-1 text-[12px] leading-[1.4] font-medium text-[var(--auth-error)]"
                      >
                        {regErrors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label
                        htmlFor="dm-reg-password"
                        className="text-[12.5px] leading-[1.4] font-semibold text-[var(--auth-text-main)]"
                      >
                        Password
                      </label>
                      <span
                        className={`text-[11.5px] leading-[1.4] transition-colors ${
                          regPassword.length >= 8
                            ? 'text-[var(--auth-interactive)] font-semibold'
                            : 'text-[var(--auth-text-muted)] font-medium'
                        }`}
                      >
                        {regPassword.length >= 8 ? '8+ characters met' : 'Min. 8 characters'}
                      </span>
                    </div>
                    <div
                      className={`flex items-center h-[44px] pl-3.5 pr-1 rounded-xl border bg-[var(--auth-input-bg)] transition-all duration-150 ${
                        regErrors.password
                          ? 'border-[var(--auth-error)] bg-[var(--auth-error-bg)]/40 focus-within:border-[var(--auth-error)] focus-within:ring-3 focus-within:ring-[#B42318]/14'
                          : 'border-[var(--auth-border)] hover:border-[var(--auth-border-hover)] focus-within:border-[var(--auth-interactive)] focus-within:bg-white focus-within:ring-3 focus-within:ring-[var(--auth-focus-ring)]'
                      }`}
                    >
                      <input
                        id="dm-reg-password"
                        name="new-password"
                        type={showRegPw ? 'text' : 'password'}
                        value={regPassword}
                        disabled={isRegistering}
                        onChange={(e) => {
                          setRegPassword(e.target.value);
                          if (regErrors.password) {
                            setRegErrors((prev) => ({ ...prev, password: undefined }));
                          }
                        }}
                        placeholder="Create a password"
                        autoComplete="new-password"
                        aria-invalid={Boolean(regErrors.password)}
                        aria-describedby={regErrors.password ? 'dm-reg-pw-error' : undefined}
                        className="flex-1 min-w-0 bg-transparent border-0 outline-none text-[13.5px] leading-[1.45] font-medium text-[var(--auth-text-main)] placeholder:text-[var(--auth-text-muted)] placeholder:font-normal"
                      />
                      <button
                        type="button"
                        aria-label={showRegPw ? 'Hide password' : 'Show password'}
                        aria-pressed={showRegPw}
                        onClick={() => setShowRegPw((v) => !v)}
                        className="w-10 h-10 rounded-lg grid place-items-center text-[var(--auth-text-muted)] hover:text-[var(--auth-text-main)] hover:bg-[#E8F0EC]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16865F] transition-colors duration-150 shrink-0"
                      >
                        <EyeIconSvg show={showRegPw} />
                      </button>
                    </div>
                    {regErrors.password && (
                      <p
                        id="dm-reg-pw-error"
                        role="alert"
                        className="mt-1 text-[12px] leading-[1.4] font-medium text-[var(--auth-error)]"
                      >
                        {regErrors.password}
                      </p>
                    )}
                  </div>

                  <div className="pt-1">
                    <RippleButton
                      type="submit"
                      disabled={isRegistering}
                      aria-busy={isRegistering}
                    >
                      {isRegistering ? 'Creating account...' : 'Register'}
                    </RippleButton>
                  </div>
                </form>

                {/* Social Auth Divider + 2-Column Side-by-Side Grid */}
                <div
                  role="separator"
                  aria-label="or continue with"
                  className="flex items-center gap-3 text-[var(--auth-text-muted)] text-[11.5px] leading-[1.4] font-normal my-4 before:content-[''] before:flex-1 before:h-px before:bg-[var(--auth-border)] after:content-[''] after:flex-1 after:h-px after:bg-[var(--auth-border)]"
                >
                  <span>or continue with</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    disabled={isRegistering}
                    onClick={() => handleSocialLogin('Google')}
                    className="flex items-center justify-center gap-2 w-full h-[44px] px-3 bg-[var(--auth-surface)] border border-[var(--auth-border)] rounded-xl text-[12.5px] leading-[1.4] font-semibold text-[var(--auth-text-main)] hover:border-[var(--auth-border-hover)] hover:bg-[#FAFDFB] active:bg-[#EFF5F2] active:scale-[0.985] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[var(--auth-focus-ring)] transition-all duration-150 whitespace-nowrap"
                  >
                    <GoogleIconSvg />
                    <span>Google</span>
                  </button>
                  <button
                    type="button"
                    disabled={isRegistering}
                    onClick={() => handleSocialLogin('Facebook')}
                    className="flex items-center justify-center gap-2 w-full h-[44px] px-3 bg-[var(--auth-surface)] border border-[var(--auth-border)] rounded-xl text-[12.5px] leading-[1.4] font-semibold text-[var(--auth-text-main)] hover:border-[var(--auth-border-hover)] hover:bg-[#FAFDFB] active:bg-[#EFF5F2] active:scale-[0.985] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[var(--auth-focus-ring)] transition-all duration-150 whitespace-nowrap"
                  >
                    <FacebookIconSvg />
                    <span>Facebook</span>
                  </button>
                </div>
              </div>

              {/* 3. Footer with Login Switch */}
              <footer className="shrink-0 pt-2 text-center">
                <p className="text-[12.5px] leading-[1.5] font-normal text-[var(--auth-text-secondary)]">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setRegErrors({});
                      goStep(4);
                    }}
                    className="font-semibold text-[var(--auth-interactive)] hover:text-[var(--auth-hover)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16865F] rounded px-0.5 transition-colors duration-150"
                  >
                    Login
                  </button>
                </p>
              </footer>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
};
