/**
 * MW LINE A — single source of truth.
 *
 * Everything the page renders comes from `project` below. There is no CMS:
 * edit this file, and the document changes. Optional fields are omitted
 * rather than left blank, so a section with nothing to say stays silent.
 *
 * PLACEHOLDER DATA — copy, codes, vendors and prices are stand-ins.
 * Image `src` paths point at files that do not exist in `/public` yet; add the
 * assets (or swap the paths) before any layout renders them.
 */

import type {
  Kit,
  Lifecycle,
  LifecyclePhase,
  Logo,
  Packaging,
  Palette,
  Project,
  ProductInfo,
  ProductSwatch,
  RenderGallery,
  Vendor,
} from "@/types/project";

/* ---------------------------------------------------------------------------
 * Lifecycle order
 *
 * Canonical phase order. `satisfies` keeps the tuple assignable to the union,
 * and the guard below fails the build if a phase is ever added to the type
 * without being placed in this sequence.
 * ------------------------------------------------------------------------- */

export const LIFECYCLE_ORDER = [
  "preparing",
  "sampling",
  "tooling",
  "production",
  "assembly",
  "fulfilment",
  "completed",
] as const satisfies readonly LifecyclePhase[];

type UnorderedPhase = Exclude<LifecyclePhase, (typeof LIFECYCLE_ORDER)[number]>;
type AllPhasesOrdered = [UnorderedPhase] extends [never] ? true : never;
/** Compile-time assertion; unused at runtime. */
const _allPhasesOrdered: AllPhasesOrdered = true;
void _allPhasesOrdered;

/* ---------------------------------------------------------------------------
 * Colour
 * ------------------------------------------------------------------------- */

const colors: Palette = {
  ground: "#ACA39A",
  linePrimary: "#CD7925",
  lineSecondary: "#BE8D4D",
  ink: "#1A1714",
};

/* ---------------------------------------------------------------------------
 * Logos
 * ------------------------------------------------------------------------- */

const logos: Logo[] = [
  {
    id: "logo-wordmark",
    variant: "wordmark",
    label: "MW LINE A wordmark",
    asset: {
      src: "/logos/mw-line-a-wordmark.svg",
      alt: "MW LINE A",
      width: 640,
      height: 96,
    },
    minWidthMm: 24,
    clearSpace: "Half the cap height on all sides.",
  },
  {
    id: "logo-monogram",
    variant: "monogram",
    label: "MW monogram",
    asset: {
      src: "/logos/mw-monogram.svg",
      alt: "MW",
      width: 128,
      height: 128,
    },
    minWidthMm: 8,
    notes: "Use where the wordmark falls below minimum width.",
  },
  {
    id: "logo-lockup",
    variant: "lockup",
    label: "Wordmark with line mark",
    asset: {
      src: "/logos/mw-line-a-lockup.svg",
      alt: "MW LINE A with route mark",
      width: 720,
      height: 160,
    },
    clearSpace: "One line-width on all sides.",
  },
];

/* ---------------------------------------------------------------------------
 * Product colour swatches
 * ------------------------------------------------------------------------- */

const swatches: ProductSwatch[] = [
  {
    id: "sw-signal",
    name: "Signal Orange",
    code: "LA-SIG",
    hex: "#CD7925",
    finish: "matte",
    references: { pantone: "PANTONE 1595 C", ral: "RAL 2011" },
    available: true,
    vendorId: "vnd-finish",
  },
  {
    id: "sw-brass",
    name: "Brass Ochre",
    code: "LA-BRS",
    hex: "#BE8D4D",
    finish: "satin",
    references: { pantone: "PANTONE 4515 C", ral: "RAL 1024" },
    available: true,
    vendorId: "vnd-finish",
  },
  {
    id: "sw-ash",
    name: "Ash Grey",
    code: "LA-ASH",
    hex: "#ACA39A",
    finish: "raw",
    // No Pantone match on file for the raw finish — only the RAL chip.
    references: { ral: "RAL 7038" },
    available: true,
    vendorId: "vnd-manufacture",
  },
  {
    id: "sw-graphite",
    name: "Graphite",
    code: "LA-GRA",
    hex: "#1A1714",
    finish: "anodised",
    references: { pantone: "PANTONE Black 6 C", ral: "RAL 9011" },
    available: true,
    vendorId: "vnd-finish",
  },
  {
    id: "sw-bone",
    name: "Bone",
    code: "LA-BNE",
    hex: "#E4DCD2",
    finish: "gloss",
    references: { pantone: "PANTONE 9184 C" },
    available: false,
    vendorId: "vnd-finish",
  },
];

/* ---------------------------------------------------------------------------
 * Kits
 * ------------------------------------------------------------------------- */

const kits: Kit[] = [
  {
    id: "kit-core",
    code: "LA-K01",
    name: "Core Kit",
    summary: "The base configuration. One housing, one carrier, mounting hardware.",
    line: "primary",
    availability: "released",
    contents: [
      { name: "Housing", quantity: 1, material: "Anodised aluminium" },
      { name: "Carrier plate", quantity: 1, material: "Cold-rolled steel" },
      { name: "Mounting hardware", quantity: 8, note: "M4, stainless" },
      { name: "Spec card", quantity: 1, material: "300gsm uncoated" },
    ],
    priceMinor: 18500,
    currency: "EUR",
    swatchIds: ["sw-signal", "sw-ash", "sw-graphite"],
    image: {
      src: "/renders/kit-core.png",
      alt: "Core Kit, contents laid flat",
      width: 1600,
      height: 1200,
    },
  },
  {
    id: "kit-extended",
    code: "LA-K02",
    name: "Extended Kit",
    summary: "Core Kit plus the secondary carrier and the full fixing set.",
    line: "primary",
    availability: "sampling",
    contents: [
      { name: "Housing", quantity: 1, material: "Anodised aluminium" },
      { name: "Carrier plate", quantity: 2, material: "Cold-rolled steel" },
      { name: "Extension arm", quantity: 1, material: "Anodised aluminium" },
      { name: "Mounting hardware", quantity: 16, note: "M4, stainless" },
      { name: "Spec card", quantity: 1, material: "300gsm uncoated" },
    ],
    priceMinor: 27500,
    currency: "EUR",
    swatchIds: ["sw-signal", "sw-brass", "sw-graphite"],
    image: {
      src: "/renders/kit-extended.png",
      alt: "Extended Kit, contents laid flat",
      width: 1600,
      height: 1200,
    },
  },
  {
    id: "kit-service",
    code: "LA-K03",
    name: "Service Kit",
    summary: "Consumables and replacement fixings. Ships without a housing.",
    line: "secondary",
    availability: "in-development",
    contents: [
      { name: "Gasket set", quantity: 4, material: "EPDM" },
      { name: "Mounting hardware", quantity: 16, note: "M4, stainless" },
      { name: "Tool", quantity: 1, material: "Hardened steel" },
    ],
    swatchIds: ["sw-ash"],
  },
];

/* ---------------------------------------------------------------------------
 * Renders gallery
 * ------------------------------------------------------------------------- */

const renders: RenderGallery = {
  heading: "Renders",
  intro: "Studio passes at 1:1. Finishes as specified; hardware shown in Graphite.",
  items: [
    {
      id: "rnd-01",
      title: "Housing, front elevation",
      view: "front",
      order: 10,
      swatchId: "sw-signal",
      asset: {
        src: "/renders/la-front.png",
        alt: "Housing photographed straight on",
        width: 2000,
        height: 2500,
      },
    },
    {
      id: "rnd-02",
      title: "Housing, three-quarter",
      view: "three-quarter",
      order: 20,
      swatchId: "sw-signal",
      asset: {
        src: "/renders/la-three-quarter.png",
        alt: "Housing at a three-quarter angle",
        width: 2000,
        height: 1500,
      },
    },
    {
      id: "rnd-03",
      title: "Carrier plate, top",
      view: "top",
      order: 30,
      swatchId: "sw-ash",
      asset: {
        src: "/renders/la-top.png",
        alt: "Carrier plate seen from above",
        width: 2000,
        height: 1500,
      },
    },
    {
      id: "rnd-04",
      title: "Fixing detail",
      view: "detail",
      order: 40,
      swatchId: "sw-graphite",
      asset: {
        src: "/renders/la-detail.png",
        alt: "Close crop of the mounting hardware",
        width: 1600,
        height: 1600,
        caption: "M4 stainless, 8mm, captive washer.",
      },
    },
    {
      id: "rnd-05",
      title: "Exploded assembly",
      view: "exploded",
      order: 50,
      asset: {
        src: "/renders/la-exploded.png",
        alt: "All components separated along the assembly axis",
        width: 2400,
        height: 1600,
        caption: "Fourteen parts, no adhesives.",
      },
    },
    {
      id: "rnd-06",
      title: "Wall mount, in situ",
      view: "in-situ",
      order: 60,
      swatchId: "sw-brass",
      asset: {
        src: "/renders/la-in-situ.png",
        alt: "Unit mounted on a plaster wall",
        width: 2400,
        height: 1600,
      },
    },
  ],
};

/* ---------------------------------------------------------------------------
 * Packaging
 * ------------------------------------------------------------------------- */

const packaging: Packaging = {
  heading: "Packaging",
  intro: "Flat-packed, unbleached board. No foam, no plastics, no printed inserts.",
  components: [
    {
      id: "pkg-outer",
      name: "Outer carton",
      material: "Unbleached E-flute corrugate",
      dimensions: { widthMm: 320, heightMm: 220, depthMm: 90, weightG: 180 },
      print: "1/0 flexo, line black",
      vendorId: "vnd-packaging",
    },
    {
      id: "pkg-sleeve",
      name: "Sleeve",
      material: "300gsm uncoated stock",
      dimensions: { widthMm: 318, heightMm: 218, depthMm: 2, weightG: 42 },
      print: "2/0 screen, Signal Orange and line black",
      vendorId: "vnd-print",
    },
    {
      id: "pkg-tray",
      name: "Moulded tray",
      material: "Moulded paper pulp",
      dimensions: { widthMm: 310, heightMm: 210, depthMm: 70, weightG: 96 },
      vendorId: "vnd-packaging",
    },
  ],
  notes: [
    "92% post-consumer recycled content across all components.",
    "Kerbside recyclable in full; no separation required.",
    "Ships flat at 40 units per pallet layer.",
  ],
};

/* ---------------------------------------------------------------------------
 * Vendors
 * ------------------------------------------------------------------------- */

const vendors: Vendor[] = [
  {
    id: "vnd-manufacture",
    name: "Nordwerk Fertigung",
    role: "manufacturing",
    location: "Solingen, DE",
    status: "contracted",
    leadTimeDays: 35,
    contact: { label: "nordwerk.example", href: "https://nordwerk.example", external: true },
  },
  {
    id: "vnd-tooling",
    name: "Atelier Précis",
    role: "tooling",
    location: "Besançon, FR",
    status: "contracted",
    leadTimeDays: 60,
    notes: "Holds the T1 and T2 tools for the housing.",
  },
  {
    id: "vnd-finish",
    name: "Superficie Milano",
    role: "finishing",
    location: "Milan, IT",
    status: "engaged",
    leadTimeDays: 14,
    notes: "Anodising and screen finishes. Bone gloss still under test.",
  },
  {
    id: "vnd-print",
    name: "Kesselhaus Druck",
    role: "print",
    location: "Leipzig, DE",
    status: "quoting",
    leadTimeDays: 10,
  },
  {
    id: "vnd-packaging",
    name: "Pulp & Board Co.",
    role: "packaging",
    location: "Ghent, BE",
    status: "contracted",
    leadTimeDays: 21,
  },
  {
    id: "vnd-logistics",
    name: "Meridian Freight",
    role: "logistics",
    location: "Rotterdam, NL",
    status: "dormant",
    leadTimeDays: 7,
    notes: "Engaged at fulfilment only.",
  },
];

/* ---------------------------------------------------------------------------
 * Dynamic product info
 * ------------------------------------------------------------------------- */

const info: ProductInfo = {
  heading: "Specification",
  intro: "Figures are from the T2 tool. Tolerances hold to ±0.2mm unless noted.",
  dimensions: { widthMm: 280, heightMm: 180, depthMm: 62, weightG: 1240 },
  materials: [
    "Anodised aluminium, 6082-T6",
    "Cold-rolled steel, DC01",
    "EPDM gasket, 60 Shore A",
    "Stainless fixings, A2-70",
  ],
  groups: [
    {
      id: "inf-dimensions",
      heading: "Dimensions",
      line: "primary",
      rows: [
        { label: "Width", value: "280 mm" },
        { label: "Height", value: "180 mm" },
        { label: "Depth", value: "62 mm" },
        { label: "Weight", value: "1,240 g" },
        { label: "Tolerance", value: "±0.2 mm" },
      ],
    },
    {
      id: "inf-construction",
      heading: "Construction",
      line: "secondary",
      rows: [
        { label: "Parts", value: "14" },
        { label: "Adhesives", value: "None" },
        { label: "Fixings", value: "M4 stainless, A2-70" },
        { label: "Serviceable", value: "Yes, full teardown" },
      ],
    },
    {
      id: "inf-compliance",
      heading: "Compliance",
      line: "secondary",
      rows: [
        { label: "REACH", value: "Conformant" },
        { label: "RoHS", value: "Conformant" },
        { label: "Warranty", value: "5 years" },
        { label: "Origin", value: "Made in the EU" },
      ],
    },
  ],
};

/* ---------------------------------------------------------------------------
 * Lifecycle
 * ------------------------------------------------------------------------- */

const lifecycle: Lifecycle = {
  heading: "Programme",
  current: "production",
  updatedOn: "2026-09-03",
  stages: [
    {
      id: "preparing",
      index: 1,
      label: "Preparing",
      description: "Brief fixed, references gathered, target cost agreed.",
      state: "complete",
      startedOn: "2026-01-12",
      completedOn: "2026-02-20",
    },
    {
      id: "sampling",
      index: 2,
      label: "Sampling",
      description: "Three housing samples; Signal Orange approved off the second.",
      state: "complete",
      startedOn: "2026-02-21",
      completedOn: "2026-04-30",
      vendorIds: ["vnd-manufacture", "vnd-finish"],
    },
    {
      id: "tooling",
      index: 3,
      label: "Tooling",
      description: "T1 cut and revised; T2 signed off at first shot.",
      state: "complete",
      startedOn: "2026-05-04",
      completedOn: "2026-07-17",
      vendorIds: ["vnd-tooling"],
    },
    {
      id: "production",
      index: 4,
      label: "Production",
      description: "First run of 500 housings. Finishing in batches of 100.",
      state: "active",
      startedOn: "2026-08-10",
      vendorIds: ["vnd-manufacture", "vnd-finish"],
    },
    {
      id: "assembly",
      index: 5,
      label: "Assembly",
      description: "Hand assembly and QC against the T2 datum.",
      state: "upcoming",
      vendorIds: ["vnd-manufacture"],
    },
    {
      id: "fulfilment",
      index: 6,
      label: "Fulfilment",
      description: "Pack, palletise, dispatch from Rotterdam.",
      state: "upcoming",
      vendorIds: ["vnd-packaging", "vnd-logistics"],
    },
    {
      id: "completed",
      index: 7,
      label: "Completed",
      description: "Run closed, tooling archived, spares held for five years.",
      state: "upcoming",
    },
  ],
};

/* ---------------------------------------------------------------------------
 * Root
 * ------------------------------------------------------------------------- */

export const project: Project = {
  meta: {
    name: "MW LINE A",
    code: "MW-LA",
    tagline: "A modular carrier system, documented end to end",
    description:
      "MW LINE A is a modular carrier system built from fourteen parts and no adhesives. This document tracks the line from brief to dispatch.",
    studio: "Metalwork Studio",
    year: "2025–2026",
    locale: "en",
  },
  colors,
  logos,
  hero: {
    eyebrow: "LINE A / 01",
    headline: "A carrier system, documented end to end",
    subhead: "Fourteen parts. No adhesives. Five-year spares.",
    lead: "MW LINE A runs from brief to dispatch on a single page. Every figure below is the working figure — when the line moves, this document moves with it.",
    keyline: [
      { label: "Programme", value: "2025–2026" },
      { label: "Phase", value: "Production" },
      { label: "Kits", value: "03" },
      { label: "Finishes", value: "05" },
    ],
  },
  kits,
  swatches,
  renders,
  packaging,
  vendors,
  info,
  lifecycle,
};

export default project;
