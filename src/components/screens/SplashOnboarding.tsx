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
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#1c2a22"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 5l-7 7 7 7" />
  </svg>
);

const EyeIconSvg: React.FC<{ show: boolean }> = ({ show }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
  >
    <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
    <path
      d="M4 4l16 16"
      style={{ opacity: show ? 0 : 1, transition: 'opacity 0.2s' }}
    />
  </svg>
);

const GoogleIconSvg: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
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
  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
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

      {/* Dual Flight Route Trail */}
      <svg className="trail" viewBox="0 0 300 260" aria-hidden="true">
        <path
          d="M-30 100C60 20 170-20 262 40"
          fill="none"
          strokeOpacity=".85"
          strokeWidth="2.2"
          strokeDasharray="2 7"
          strokeLinecap="round"
        />
        <path
          d="M-30 106C60 26 170-14 262 46"
          fill="none"
          strokeOpacity=".3"
          strokeWidth="1"
          strokeDasharray="4 8"
          strokeLinecap="round"
        />
      </svg>

      {/* Detailed Cargo Jet with Windows & Turbine Pods */}
      <div className="plane" aria-hidden="true">
        <svg viewBox="0 0 44 44">
          {/* Swept Wings & Under-wing Engines */}
          <path d="M17 18L10 3L16 3L28 18zM17 26L10 41L16 41L28 26z" />
          <ellipse cx="20" cy="11" rx="3.2" ry="1.6" />
          <ellipse cx="20" cy="33" rx="3.2" ry="1.6" />
          {/* Tail Stabilizers */}
          <path d="M5 18L1 10L7 10L11 18zM5 26L1 34L7 34L11 26z" />
          {/* Fuselage Body */}
          <path d="M2 22Q2 18 9 18L33 18Q42 18 42 22Q42 26 33 26L9 26Q2 26 2 22z" />
          {/* Cockpit & Cabin Windows */}
          <path
            d="M35 20.2C37.5 20.2 39 21 39 22C39 23 37.5 23.8 35 23.8Z"
            fill={isSplash ? '#14523d' : '#ffffff'}
            opacity="0.85"
          />
          <circle
            cx="29"
            cy="22"
            r="1"
            fill={isSplash ? '#14523d' : '#ffffff'}
            opacity="0.75"
          />
          <circle
            cx="25"
            cy="22"
            r="1"
            fill={isSplash ? '#14523d' : '#ffffff'}
            opacity="0.75"
          />
          <circle
            cx="21"
            cy="22"
            r="1"
            fill={isSplash ? '#14523d' : '#ffffff'}
            opacity="0.75"
          />
        </svg>
      </div>
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
  const pointerStartX = useRef<number | null>(null);

  // Auth Form State
  const [loginRole, setLoginRole] = useState<'customer' | 'admin'>('customer');
  const [loginIdentifier, setLoginIdentifier] = useState('tanvir.ahmed@deshimart.bd');
  const [loginPassword, setLoginPassword] = useState('••••••••••••');
  const [showLoginPw, setShowLoginPw] = useState(false);
  const [loginShake, setLoginShake] = useState(false);

  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('+880 1712 345678');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPw, setShowRegPw] = useState(false);
  const [regShake, setRegShake] = useState(false);

  // Sync when external navigation changes currentScreen
  useEffect(() => {
    if (currentScreen === 'splash') setStep(0);
    else if (currentScreen === 'onboarding' && (step < 1 || step > 3)) setStep(1);
    else if (currentScreen === 'auth' && step < 4) setStep(4);
  }, [currentScreen]);

  const goStep = (next: FlowStep) => {
    if (next === step) return;
    setStep(next);
  };

  // Splash auto-advances after 5.2s just like the reference HTML
  useEffect(() => {
    if (step !== 0) return;
    const timer = window.setTimeout(() => {
      goStep(1);
    }, 5200);
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
    if (step >= 1 && step <= 3 && Math.abs(dx) > 55) {
      if (dx < 0) {
        goStep((step === 3 ? 4 : step + 1) as FlowStep);
      } else {
        goStep((step - 1) as FlowStep);
      }
    }
  };

  const triggerShake = (which: 'login' | 'reg', msg: string) => {
    showToast(msg, 'info');
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
    if (!loginIdentifier.trim() || !loginPassword.trim()) {
      triggerShake('login', 'Please enter email/phone and password');
      return;
    }
    const isAdminLogin =
      loginRole === 'admin' ||
      loginIdentifier.toLowerCase().includes('admin');
    loginUser(
      loginIdentifier.trim(),
      isAdminLogin ? 'Nakib Prince' : 'Tanvir Ahmed',
      isAdminLogin ? 'admin' : 'customer'
    );
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regPhone.trim() || regPassword.trim().length < 8) {
      triggerShake('reg', 'Fill all fields (password 8+ chars)');
      return;
    }
    loginUser(regPhone.trim(), regName.trim());
  };

  const handleSocialLogin = (provider: 'Google' | 'Facebook') => {
    loginUser(`tanvir.${provider.toLowerCase()}@deshimart.bd`, 'Tanvir Ahmed');
  };

  const renderDots = (activeIdx: number, isSplash = false) => (
    <div
      className={`flex justify-center gap-2 ${
        isSplash ? '' : 'my-3'
      }`}
    >
      {[0, 1, 2].map((k) => {
        const active = k === activeIdx;
        return (
          <button
            key={k}
            type="button"
            aria-label={`Go to slide ${k + 1}`}
            onClick={(e) => {
              e.stopPropagation();
              goStep((k + 1) as FlowStep);
            }}
            className={`block h-[7px] rounded-full transition-all duration-300 ${
              active
                ? isSplash
                  ? 'w-[22px] bg-white'
                  : 'w-[22px] bg-[#059669]'
                : isSplash
                ? 'w-[7px] bg-white/40 hover:bg-white/60'
                : 'w-[7px] bg-[#DFEAE3] hover:bg-[#A7C4B5]'
            }`}
          />
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
        {/* =====================  0: SPLASH SCREEN (STATIONARY PAGE SHELL) ===================== */}
        {step === 0 && (
          <motion.section
            key="flow-splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            onClick={() => goStep(1)}
            className="dm-flow-splash relative flex-1 flex flex-col items-center justify-between px-6 pt-8 pb-6 overflow-hidden cursor-pointer"
          >
            <div className="dm-flow-glow absolute inset-0 pointer-events-none" />

            {/* Top bar with quick Skip to Store option */}
            <div className="relative z-10 w-full flex items-center justify-end">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  navigateTo('home');
                }}
                className="text-xs leading-4 font-semibold text-white/85 hover:text-white bg-white/12 hover:bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-xs transition-colors"
              >
                Skip to Store →
              </button>
            </div>

            {/* Center Brand Identity (Stationary frame, internal SVG & letter animations) */}
            <div className="relative z-10 flex flex-col items-center mt-2">
              <div className="relative w-24 h-24 flex items-center justify-center">
                <div className="dm-flow-ring" />
                <div className="dm-flow-ring" />
                <div className="dm-flow-logo dm-flow-logo-splash">
                  <BagLogoSvg />
                </div>
              </div>

              <h1
                aria-label="DeshiMart"
                className="mt-5 text-[36px] leading-[42px] font-bold tracking-tight flex justify-center text-white"
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

              <p className="dm-flow-sp mt-1.5 text-[16px] leading-6 font-medium text-white">
                Drop Shipping Store
              </p>

              <p className="dm-flow-tg mt-3 text-[14px] leading-6 text-white/90">
                <span>Global Products</span>
                <span>Local Dreams</span>
              </p>
            </div>

            {/* Bottom Animated Globe + Parcel Boxes + Plane */}
            <div className="relative z-10 flex flex-col items-center w-full">
              <GlobeBoxesPlaneArt variant="splash" />
              <div className="mt-2">{renderDots(0, true)}</div>
            </div>
          </motion.section>
        )}

        {/* =====================  1–3: ONBOARDING SCREENS (STATIONARY SHELL, IN-PLACE CONTENT) ===================== */}
        {(step === 1 || step === 2 || step === 3) && (
          <motion.section
            key="flow-ob-shell"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="flex-1 flex flex-col justify-between px-6 pt-8 pb-6 text-center bg-white text-[#0F1D17]"
          >
            {/* Stationary Top Header + In-Place Animated Copy */}
            <div>
              <div className="flex items-center justify-between w-full">
                <button
                  type="button"
                  aria-label="Back"
                  onClick={() => goStep((step - 1) as FlowStep)}
                  className="w-9 h-9 -ml-2 rounded-full grid place-items-center active:bg-[#EFF4F1] transition-colors"
                >
                  <BackIconSvg />
                </button>

                <button
                  type="button"
                  aria-label="Account Login"
                  onClick={() => goStep(4)}
                  className="w-9 h-9 rounded-full grid place-items-center text-[#059669] hover:bg-[#EFF4F1] transition-colors"
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

              <div className="min-h-[104px] flex flex-col justify-center mt-3">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={`ob-copy-${step}`}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                  >
                    <h2 className="text-[21px] leading-[27px] font-bold text-[#0F1D17]">
                      {step === 1 && 'Worldwide Products Delivered to Your Door'}
                      {step === 2 && 'Safe & Secure Shopping'}
                      {step === 3 && 'Fast & Reliable Delivery'}
                    </h2>

                    <p className="text-[13px] leading-5 text-[#485B52] mt-2">
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

            {/* Stationary Center Illustration Stage with In-Place Artwork Choreography */}
            <div className="flex-1 grid place-items-center min-h-0 my-1">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={`ob-art-${step}`}
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
                  className="grid place-items-center"
                >
                  {step === 1 && <GlobeBoxesPlaneArt variant="ob" />}
                  {step === 2 && <SafeSecureArt />}
                  {step === 3 && <FastDeliveryArt />}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Stationary Bottom Dots + CTA + Skip */}
            <div>
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

              <div className="mt-3 h-6 flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => navigateTo('home')}
                  className="text-[13px] font-semibold text-[#059669] hover:underline"
                >
                  {step < 3 ? 'Skip to Store' : 'Browse Store as Guest →'}
                </button>
              </div>
            </div>
          </motion.section>
        )}

        {/* =====================  4: LOGIN SCREEN (STATIONARY PAGE SHELL) ===================== */}
        {step === 4 && (
          <motion.section
            key="flow-login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24, ease: 'easeOut' }}
            className="flex-1 flex flex-col justify-between px-6 pt-7 pb-6 text-center bg-white text-[#0F1D17] overflow-y-auto"
          >
            <div>
              <div className="flex items-center justify-between w-full dm-flow-a">
                <button
                  type="button"
                  aria-label="Back"
                  onClick={() => goStep(3)}
                  className="w-9 h-9 -ml-2 rounded-full grid place-items-center active:bg-[#EFF4F1]"
                >
                  <BackIconSvg />
                </button>
                <button
                  type="button"
                  onClick={() => navigateTo('home')}
                  className="text-xs font-semibold text-[#059669] hover:underline"
                >
                  Skip to Store →
                </button>
              </div>

              <div
                className="dm-flow-logo dm-flow-logo-sm dm-flow-a"
                style={{ '--d': 0.05 } as React.CSSProperties}
              >
                <BagLogoSvg />
              </div>

              <h2
                className="dm-flow-a text-[22px] leading-7 font-bold mt-2.5 text-[#0F1D17]"
                style={{ '--d': 0.12 } as React.CSSProperties}
              >
                Welcome Back
              </h2>
              <p
                className="dm-flow-a text-[13px] leading-5 text-[#485B52] mt-1"
                style={{ '--d': 0.18 } as React.CSSProperties}
              >
                Select account type or sign in with credentials
              </p>

              {/* Quick Role Selector (Customer Account vs Admin Console) */}
              <div
                className="dm-flow-a grid grid-cols-2 gap-1.5 mt-3.5 p-1 rounded-xl bg-[#F5F8F6] border border-[#DFEAE3]"
                style={{ '--d': 0.21 } as React.CSSProperties}
              >
                <button
                  type="button"
                  onClick={() => {
                    setLoginRole('customer');
                    setLoginIdentifier('tanvir.ahmed@deshimart.bd');
                    setLoginPassword('••••••••••••');
                  }}
                  className={`h-9 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                    loginRole === 'customer'
                      ? 'bg-[#065F46] text-white shadow-xs'
                      : 'text-[#485B52] hover:text-[#0F1D17]'
                  }`}
                >
                  Customer Account
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginRole('admin');
                    setLoginIdentifier('admin@deshimart.bd');
                    setLoginPassword('••••••••••••');
                  }}
                  className={`h-9 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                    loginRole === 'admin'
                      ? 'bg-[#065F46] text-white shadow-xs'
                      : 'text-[#485B52] hover:text-[#0F1D17]'
                  }`}
                >
                  Admin Console
                </button>
              </div>

              <form
                onSubmit={handleLoginSubmit}
                noValidate
                className={`text-left mt-3.5 space-y-3 ${
                  loginShake ? 'dm-flow-shake' : ''
                }`}
              >
                <div
                  className="dm-flow-a"
                  style={{ '--d': 0.24 } as React.CSSProperties}
                >
                  <label className="block text-[12px] font-semibold text-[#0F1D17] mb-1">
                    Email or Phone
                  </label>
                  <div className="flex items-center h-11 px-3.5 rounded-xl border-[1.5px] border-[#DFEAE3] bg-[#F5F8F6] focus-within:border-[#059669] focus-within:ring-4 focus-within:ring-[#059669]/12 transition-all">
                    <input
                      type="text"
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder="name@example.com"
                      autoComplete="username"
                      className="flex-1 min-w-0 bg-transparent border-0 outline-none text-[13px] text-[#0F1D17]"
                    />
                  </div>
                </div>

                <div
                  className="dm-flow-a"
                  style={{ '--d': 0.32 } as React.CSSProperties}
                >
                  <label className="block text-[12px] font-semibold text-[#0F1D17] mb-1">
                    Password
                  </label>
                  <div className="flex items-center h-11 px-3.5 rounded-xl border-[1.5px] border-[#DFEAE3] bg-[#F5F8F6] focus-within:border-[#059669] focus-within:ring-4 focus-within:ring-[#059669]/12 transition-all">
                    <input
                      type={showLoginPw ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      className="flex-1 min-w-0 bg-transparent border-0 outline-none text-[13px] text-[#0F1D17]"
                    />
                    <button
                      type="button"
                      aria-label="Show password"
                      onClick={() => setShowLoginPw((v) => !v)}
                      className="w-8 h-8 grid place-items-center text-[#74887E] hover:text-[#0F1D17]"
                    >
                      <EyeIconSvg show={showLoginPw} />
                    </button>
                  </div>
                </div>

                <div
                  className="flex justify-end dm-flow-a"
                  style={{ '--d': 0.38 } as React.CSSProperties}
                >
                  <button
                    type="button"
                    onClick={() =>
                      showToast('Password reset link sent to your email/SMS', 'info')
                    }
                    className="text-[12px] font-semibold text-[#059669] hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>

                <RippleButton type="submit" delaySec={0.44}>
                  Login
                </RippleButton>
              </form>

              {/* Social Auth Divider */}
              <div
                className="dm-flow-a flex items-center gap-3 text-[#74887E] text-xs my-3.5 before:content-[''] before:flex-1 before:h-px before:bg-[#EAF0EC] after:content-[''] after:flex-1 after:h-px after:bg-[#EAF0EC]"
                style={{ '--d': 0.52 } as React.CSSProperties}
              >
                or
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleSocialLogin('Google')}
                  style={{ '--d': 0.56 } as React.CSSProperties}
                  className="dm-flow-a flex items-center justify-center gap-2.5 w-full h-11 border-[1.5px] border-[#DFEAE3] rounded-xl text-[13px] font-semibold text-[#0F1D17] hover:border-[#A7C4B5] active:bg-[#EFF4F1] active:scale-[0.98] transition-all"
                >
                  <GoogleIconSvg />
                  <span>Continue with Google</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSocialLogin('Facebook')}
                  style={{ '--d': 0.62 } as React.CSSProperties}
                  className="dm-flow-a flex items-center justify-center gap-2.5 w-full h-11 border-[1.5px] border-[#DFEAE3] rounded-xl text-[13px] font-semibold text-[#0F1D17] hover:border-[#A7C4B5] active:bg-[#EFF4F1] active:scale-[0.98] transition-all"
                >
                  <FacebookIconSvg />
                  <span>Continue with Facebook</span>
                </button>
              </div>
            </div>

            <p
              className="dm-flow-a pt-3 text-[13px] text-[#485B52]"
              style={{ '--d': 0.7 } as React.CSSProperties}
            >
              Don&apos;t have an account?{' '}
              <button
                type="button"
                onClick={() => goStep(5)}
                className="font-semibold text-[#059669] hover:underline"
              >
                Register
              </button>
            </p>
          </motion.section>
        )}

        {/* =====================  5: REGISTER SCREEN (STATIONARY PAGE SHELL) ===================== */}
        {step === 5 && (
          <motion.section
            key="flow-register"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24, ease: 'easeOut' }}
            className="flex-1 flex flex-col justify-between px-6 pt-7 pb-6 text-center bg-white text-[#0F1D17] overflow-y-auto"
          >
            <div>
              <div className="flex items-center justify-between w-full dm-flow-a">
                <button
                  type="button"
                  aria-label="Back to Login"
                  onClick={() => goStep(4)}
                  className="w-9 h-9 -ml-2 rounded-full grid place-items-center active:bg-[#EFF4F1]"
                >
                  <BackIconSvg />
                </button>
                <button
                  type="button"
                  onClick={() => navigateTo('home')}
                  className="text-xs font-semibold text-[#059669] hover:underline"
                >
                  Skip to Store →
                </button>
              </div>

              <div
                className="dm-flow-logo dm-flow-logo-sm dm-flow-a"
                style={{ '--d': 0.05 } as React.CSSProperties}
              >
                <BagLogoSvg />
              </div>

              <h2
                className="dm-flow-a text-[22px] leading-7 font-bold mt-2.5 text-[#0F1D17]"
                style={{ '--d': 0.12 } as React.CSSProperties}
              >
                Create Your Account
              </h2>
              <p
                className="dm-flow-a text-[13px] leading-5 text-[#485B52] mt-1"
                style={{ '--d': 0.18 } as React.CSSProperties}
              >
                Join DeshiMart and start global shopping
              </p>

              <form
                onSubmit={handleRegisterSubmit}
                noValidate
                className={`text-left mt-3.5 space-y-2.5 ${
                  regShake ? 'dm-flow-shake' : ''
                }`}
              >
                <div
                  className="dm-flow-a"
                  style={{ '--d': 0.24 } as React.CSSProperties}
                >
                  <label className="block text-[12px] font-semibold text-[#0F1D17] mb-1">
                    Full Name
                  </label>
                  <div className="flex items-center h-11 px-3.5 rounded-xl border-[1.5px] border-[#DFEAE3] bg-[#F5F8F6] focus-within:border-[#059669] focus-within:ring-4 focus-within:ring-[#059669]/12 transition-all">
                    <input
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="Tanvir Ahmed"
                      autoComplete="name"
                      className="flex-1 min-w-0 bg-transparent border-0 outline-none text-[13px] text-[#0F1D17]"
                    />
                  </div>
                </div>

                <div
                  className="dm-flow-a"
                  style={{ '--d': 0.31 } as React.CSSProperties}
                >
                  <label className="block text-[12px] font-semibold text-[#0F1D17] mb-1">
                    Phone Number
                  </label>
                  <div className="flex items-center h-11 px-3.5 rounded-xl border-[1.5px] border-[#DFEAE3] bg-[#F5F8F6] focus-within:border-[#059669] focus-within:ring-4 focus-within:ring-[#059669]/12 transition-all">
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+880 1712 345678"
                      autoComplete="tel"
                      className="flex-1 min-w-0 bg-transparent border-0 outline-none text-[13px] text-[#0F1D17] font-mono-num"
                    />
                  </div>
                </div>

                <div
                  className="dm-flow-a"
                  style={{ '--d': 0.38 } as React.CSSProperties}
                >
                  <label className="block text-[12px] font-semibold text-[#0F1D17] mb-1">
                    Password
                  </label>
                  <div className="flex items-center h-11 px-3.5 rounded-xl border-[1.5px] border-[#DFEAE3] bg-[#F5F8F6] focus-within:border-[#059669] focus-within:ring-4 focus-within:ring-[#059669]/12 transition-all">
                    <input
                      type={showRegPw ? 'text' : 'password'}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••••••"
                      autoComplete="new-password"
                      className="flex-1 min-w-0 bg-transparent border-0 outline-none text-[13px] text-[#0F1D17]"
                    />
                    <button
                      type="button"
                      aria-label="Show password"
                      onClick={() => setShowRegPw((v) => !v)}
                      className="w-8 h-8 grid place-items-center text-[#74887E] hover:text-[#0F1D17]"
                    >
                      <EyeIconSvg show={showRegPw} />
                    </button>
                  </div>
                </div>

                <div
                  style={{ '--d': 0.44 } as React.CSSProperties}
                  className={`dm-flow-a text-xs transition-colors ${
                    regPassword.length >= 8
                      ? 'text-[#059669] font-semibold'
                      : 'text-[#485B52]'
                  }`}
                >
                  {regPassword.length >= 8 ? '✓ ' : ''}At least 8 characters
                </div>

                <RippleButton type="submit" delaySec={0.5}>
                  Register
                </RippleButton>
              </form>

              {/* Social Auth Divider */}
              <div
                className="dm-flow-a flex items-center gap-3 text-[#74887E] text-xs my-3 before:content-[''] before:flex-1 before:h-px before:bg-[#EAF0EC] after:content-[''] after:flex-1 after:h-px after:bg-[#EAF0EC]"
                style={{ '--d': 0.56 } as React.CSSProperties}
              >
                or
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleSocialLogin('Google')}
                  style={{ '--d': 0.6 } as React.CSSProperties}
                  className="dm-flow-a flex items-center justify-center gap-2.5 w-full h-11 border-[1.5px] border-[#DFEAE3] rounded-xl text-[13px] font-semibold text-[#0F1D17] hover:border-[#A7C4B5] active:bg-[#EFF4F1] active:scale-[0.98] transition-all"
                >
                  <GoogleIconSvg />
                  <span>Continue with Google</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSocialLogin('Facebook')}
                  style={{ '--d': 0.66 } as React.CSSProperties}
                  className="dm-flow-a flex items-center justify-center gap-2.5 w-full h-11 border-[1.5px] border-[#DFEAE3] rounded-xl text-[13px] font-semibold text-[#0F1D17] hover:border-[#A7C4B5] active:bg-[#EFF4F1] active:scale-[0.98] transition-all"
                >
                  <FacebookIconSvg />
                  <span>Continue with Facebook</span>
                </button>
              </div>
            </div>

            <p
              className="dm-flow-a pt-3 text-[13px] text-[#485B52]"
              style={{ '--d': 0.72 } as React.CSSProperties}
            >
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => goStep(4)}
                className="font-semibold text-[#059669] hover:underline"
              >
                Login
              </button>
            </p>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
};
