/**
 * MW LINE A — single source of truth.
 *
 * A transit-themed doubleshot keycap set by MilkyWay, run as a regional group
 * buy. The site is one route with six stations, and everything it renders
 * comes from `project` below. There is no CMS: edit this file and the
 * document changes. No component holds copy of its own.
 *
 * PLACEHOLDER DATA — vendor names, prices and dates are stand-ins. Image
 * paths point at files that do not exist yet; `AssetFrame` draws
 * aspect-correct placeholders until they do.
 */

import type {
  GbStage,
  Intro,
  Kit,
  Project,
  ProjectCopy,
  ProductSwatch,
  Palette,
  RenderGallery,
  Station,
  Terminus,
  Vendor,
} from "@/types/project";

/**
 * Asset roots.
 *
 * URL paths, not filesystem paths. Next serves `public/` at the site root, so
 * a file at `public/kits/base-kit.webp` is fetched as `/kits/base-kit.webp` —
 * writing `/public/kits/...` in a src would 404.
 *
 * Drop real WebP, PNG or SVG files into the matching `public/` subdirectory,
 * keep the filename, and flip `ASSETS_AVAILABLE` in `components/ui/AssetFrame`
 * to swap every placeholder for the artwork.
 */
const ASSETS = {
  /** -> public/kits/ */
  kits: "/kits",
  /** -> public/renders/ */
  renders: "/renders",
} as const;

/* ---------------------------------------------------------------------------
 * Group buy stages
 *
 * Canonical order. `satisfies` keeps the tuple assignable to the union, and
 * the guard below fails the build if a stage is added to the type without
 * being placed in this sequence.
 * ------------------------------------------------------------------------- */

export const GB_STAGE_ORDER = [
  "preparing",
  "group-buy",
  "manufacturing",
  "shipping",
  "completed",
] as const satisfies readonly GbStage[];

type UnorderedStage = Exclude<GbStage, (typeof GB_STAGE_ORDER)[number]>;
type AllStagesOrdered = [UnorderedStage] extends [never] ? true : never;
/** Compile-time assertion; unused at runtime. */
const _allStagesOrdered: AllStagesOrdered = true;
void _allStagesOrdered;

/* ---------------------------------------------------------------------------
 * Palette — the five specified colours, and only these
 * ------------------------------------------------------------------------- */

const colors: Palette = {
  /** Warm Gray 5 C — page background */
  ground: "#ACA39A",
  /** Warm Gray 1 C */
  paper: "#D7D2CB",
  /** Pantone 7565 C — orange track */
  linePrimary: "#CD7925",
  /** Pantone 7407 C — gold track */
  lineSecondary: "#CBA052",
  /** Pantone 447 C */
  ink: "#373A36",
};

/* ---------------------------------------------------------------------------
 * The route
 * ------------------------------------------------------------------------- */

const stations: Station[] = [
  { id: "intro", label: "Intro", index: 1, line: "primary" },
  { id: "kits", label: "Kits", index: 2, line: "secondary" },
  { id: "colors", label: "Colours", index: 3, line: "primary" },
  { id: "renders", label: "Renders", index: 4, line: "secondary" },
  { id: "vendors", label: "Vendors", index: 5, line: "primary" },
  { id: "terminus", label: "Terminus", index: 6, line: "secondary" },
];

/* ---------------------------------------------------------------------------
 * Copy
 * ------------------------------------------------------------------------- */

const copy: ProjectCopy = {
  counts: {
    kit: { singular: "kit" },
    colour: { singular: "colour" },
    plate: { singular: "plate" },
    vendor: { singular: "vendor" },
  },
  kitAvailability: {
    "in-development": "In development",
    sampling: "Sampling",
    released: "Released",
    archived: "Archived",
  },
  renderView: {
    front: "Front",
    "three-quarter": "Three-quarter",
    top: "Top",
    detail: "Detail",
    exploded: "Exploded",
    "in-situ": "In situ",
  },
  vendorRegion: {
    "north-america": "North America",
    europe: "Europe",
    asia: "Asia",
    oceania: "Oceania",
    "south-america": "South America",
    africa: "Africa",
  },
  lineNames: {
    primary: "Line A",
    secondary: "Line B",
  },
  labels: {
    origin: "Origin",
    caps: "caps",
    credit: "Render",
    usedOn: "Used on",
    listingPending: "Listing pending",
    opensInNewTab: "opens in a new tab",
    stage: "Stage",
    updated: "Updated",
    assetPlaceholder: "Plate reserved",
  },
};

/* ---------------------------------------------------------------------------
 * Station 1 — intro
 * ------------------------------------------------------------------------- */

const intro: Intro = {
  eyebrow: "LINE A / 01",
  headline: "A transit map for your keyboard",
  subhead: "Doubleshot ABS. Cherry profile. Four kits.",
  lead: "MW LINE A runs from interest check to doorstep along a single line. Every figure here is the working figure — when the run moves, this document moves with it.",
  keyline: [
    { label: "Programme", value: "2026–2027" },
    { label: "Stage", value: "Manufacturing" },
    { label: "Kits", value: "04" },
    { label: "Colours", value: "05" },
  ],
};

/* ---------------------------------------------------------------------------
 * Station 2 — kits
 * ------------------------------------------------------------------------- */

const kits: Kit[] = [
  {
    id: "kit-base",
    code: "LA-BASE",
    name: "Base Kit with Novelties",
    summary: "Alphas, core modifiers and the line-map novelty set.",
    line: "primary",
    availability: "released",
    capCount: 121,
    priceMinor: 12500,
    currency: "EUR",
    swatchIds: ["sw-warm5", "sw-447", "sw-7565"],
    image: {
      src: `${ASSETS.kits}/base-kit.webp`,
      alt: "Base Kit with novelties, laid out",
      width: 1600,
      height: 1000,
    },
  },
  {
    id: "kit-numpad",
    code: "LA-NUM",
    name: "Numpad",
    summary: "Full numpad coverage, including the tall zero and enter.",
    line: "secondary",
    availability: "released",
    capCount: 23,
    priceMinor: 3500,
    currency: "EUR",
    swatchIds: ["sw-warm5", "sw-447"],
    image: {
      src: `${ASSETS.kits}/numpad-kit.webp`,
      alt: "Numpad kit",
      width: 1600,
      height: 1000,
    },
  },
  {
    id: "kit-40s",
    code: "LA-40S",
    name: "40s",
    summary: "The 40% row: shortened modifiers and split spacebars.",
    line: "primary",
    availability: "sampling",
    capCount: 34,
    priceMinor: 3800,
    currency: "EUR",
    swatchIds: ["sw-warm5", "sw-7407"],
    image: {
      src: `${ASSETS.kits}/40s-kit.webp`,
      alt: "40s kit",
      width: 1600,
      height: 1000,
    },
  },
  {
    id: "kit-norde",
    code: "LA-NDE",
    name: "NorDe",
    summary: "Nordic and German legends: ISO Enter, umlauts, the lot.",
    line: "secondary",
    availability: "in-development",
    capCount: 41,
    priceMinor: 4200,
    currency: "EUR",
    swatchIds: ["sw-warm5", "sw-447"],
    image: {
      src: `${ASSETS.kits}/norde-kit.webp`,
      alt: "NorDe kit",
      width: 1600,
      height: 1000,
    },
  },
];

/* ---------------------------------------------------------------------------
 * Station 3 — colours
 *
 * The five specified references. These are the set, not a selection from it.
 * ------------------------------------------------------------------------- */

const swatches: ProductSwatch[] = [
  {
    id: "sw-447",
    name: "Pantone 447 C",
    code: "LA-447",
    hex: "#373A36",
    description: "Legends on the light caps, and the cap colour on the dark.",
  },
  {
    id: "sw-7407",
    name: "Pantone 7407 C",
    code: "LA-7407",
    hex: "#CBA052",
    description: "The gold track. Modifier accents and the 40s row.",
  },
  {
    id: "sw-7565",
    name: "Pantone 7565 C",
    code: "LA-7565",
    hex: "#CD7925",
    description: "The orange track. Novelty legends and the destination blade.",
  },
  {
    id: "sw-warm1",
    name: "Warm Gray 1 C",
    code: "LA-WG1",
    hex: "#D7D2CB",
    description: "The lightest cap. Alphas on the pale layout.",
  },
  {
    id: "sw-warm5",
    name: "Warm Gray 5 C",
    code: "LA-WG5",
    hex: "#ACA39A",
    description: "The base grey, and the surface this page is printed on.",
  },
];

/* ---------------------------------------------------------------------------
 * Station 4 — renders
 * ------------------------------------------------------------------------- */

const renders: RenderGallery = {
  heading: "Renders",
  intro:
    "Studio passes on a 65% board. The Pantone chips are the reference, not the render.",
  items: [
    {
      id: "rnd-top",
      title: "Full set, top-down",
      view: "top",
      order: 10,
      credit: "MilkyWay Studio",
      swatchId: "sw-warm5",
      asset: {
        src: `${ASSETS.renders}/full-set-top.webp`,
        alt: "The full set installed, from above",
        width: 1600,
        height: 1000,
      },
    },
    {
      id: "rnd-quarter",
      title: "Board, three-quarter",
      view: "three-quarter",
      order: 20,
      credit: "MilkyWay Studio",
      swatchId: "sw-warm5",
      asset: {
        src: `${ASSETS.renders}/board-three-quarter.webp`,
        alt: "Board at a three-quarter angle",
        width: 1600,
        height: 1000,
      },
    },
    {
      id: "rnd-novelty",
      title: "Terminus novelty",
      view: "detail",
      order: 30,
      credit: "Atelier Rendu",
      swatchId: "sw-7565",
      asset: {
        src: `${ASSETS.renders}/terminus-novelty.webp`,
        alt: "Close crop of the terminus novelty cap",
        width: 1200,
        height: 1200,
      },
    },
    {
      id: "rnd-numpad",
      title: "Numpad",
      view: "front",
      order: 40,
      credit: "MilkyWay Studio",
      swatchId: "sw-447",
      asset: {
        src: `${ASSETS.renders}/numpad.webp`,
        alt: "Numpad kit installed",
        width: 1200,
        height: 1200,
      },
    },
    {
      id: "rnd-40s",
      title: "40s layout",
      view: "top",
      order: 50,
      credit: "Atelier Rendu",
      swatchId: "sw-7407",
      asset: {
        src: `${ASSETS.renders}/40s-layout.webp`,
        alt: "40 percent board with the 40s kit",
        width: 1600,
        height: 1000,
      },
    },
    {
      id: "rnd-desk",
      title: "In situ",
      view: "in-situ",
      order: 60,
      credit: "MilkyWay Studio",
      swatchId: "sw-warm1",
      asset: {
        src: `${ASSETS.renders}/board-in-situ.webp`,
        alt: "Board on a desk",
        width: 1600,
        height: 1000,
      },
    },
  ],
};

/* ---------------------------------------------------------------------------
 * Station 5 — vendors
 * ------------------------------------------------------------------------- */

const vendors: Vendor[] = [
  {
    id: "vnd-na",
    name: "Meridian Supply",
    region: "north-america",
    url: "https://meridian-supply.example",
    serves: ["US", "CA", "MX"],
  },
  {
    id: "vnd-eu",
    name: "Kesselhaus Keys",
    region: "europe",
    url: "https://kesselhaus.example",
    serves: ["EU", "UK", "CH", "NO"],
  },
  {
    id: "vnd-uk",
    name: "Northline Supply",
    region: "europe",
    url: "https://northline.example",
    serves: ["UK", "IE"],
  },
  {
    id: "vnd-asia",
    name: "Interchange Works",
    region: "asia",
    // No listing published yet — the row prints a pending state, not a dead link.
    serves: ["SG", "MY", "JP", "KR", "TW"],
  },
  {
    id: "vnd-oce",
    name: "Southline Keys",
    region: "oceania",
    url: "https://southline.example",
    serves: ["AU", "NZ"],
  },
  {
    id: "vnd-sa",
    name: "Terminal Sur",
    region: "south-america",
    url: "https://terminalsur.example",
    serves: ["BR", "AR", "CL"],
  },
];

/* ---------------------------------------------------------------------------
 * Station 6 — terminus
 * ------------------------------------------------------------------------- */

const terminus: Terminus = {
  eyebrow: "Terminus",
  headline: "Thank you for riding Line A",
  message:
    "MW LINE A exists because people backed it before it was a thing you could hold. Manufactured by MilkyWay.",
  stageLabels: {
    preparing: "Preparing",
    "group-buy": "In Group Buy",
    manufacturing: "Manufacturing",
    shipping: "Shipping",
    completed: "Completed",
  },
  current: "manufacturing",
  updatedOn: "2026-09-03",
};

/* ---------------------------------------------------------------------------
 * Root
 * ------------------------------------------------------------------------- */

export const project: Project = {
  meta: {
    name: "MW LINE A",
    code: "MW-LA",
    tagline: "A transit map for your keyboard",
    description:
      "MW LINE A is a doubleshot keycap set drawn from transit diagrams. Manufactured by MilkyWay, run as a regional group buy.",
    studio: "MilkyWay",
    year: "2026–2027",
    locale: "en",
  },
  colors,
  copy,
  stations,
  intro,
  kits,
  swatches,
  renders,
  vendors,
  terminus,
};

export default project;
