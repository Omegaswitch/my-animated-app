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
  ColorSample,
  Identity,
  DesignerCredit,
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
 * a file at `public/kits/base.png` is fetched as `/kits/base.png` —
 * writing `/public/kits/...` in a src would 404.
 *
 * Drop the file into the matching `public/` subdirectory keeping the filename
 * exactly — lowercase, since Linux hosting is case-sensitive, and with the
 * extension the path below names. The extension is part of the filename: a
 * `render-01.jpg` where the data says `.png` is a 404 and draws a placeholder,
 * with nothing to say why. Kits and logos are `.png`; renders and colour
 * samples are `.jpg`. It appears on
 * the site immediately; anything not yet uploaded keeps its placeholder. No
 * code change is needed, and files can be added one at a time.
 */
const ASSETS = {
  /** -> public/kits/ */
  kits: "/kits",
  /** -> public/renders/ */
  renders: "/renders",
  /** -> public/logos/ */
  logos: "/logos",
  /** -> public/packaging/ */
  packaging: "/packaging",
  /** -> public/colors/ */
  colors: "/colors",
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
  { id: "intro", label: "Line A", index: 1, line: "primary" },
  { id: "kits", label: "Kits", index: 2, line: "secondary" },
  { id: "colors", label: "Colors", index: 3, line: "primary" },
  { id: "renders", label: "Renders", index: 4, line: "secondary" },
  { id: "vendors", label: "Vendors", index: 5, line: "primary" },
  { id: "terminus", label: "Terminus", index: 6, line: "secondary" },
];

/* ---------------------------------------------------------------------------
 * Copy
 * ------------------------------------------------------------------------- */

const copy: ProjectCopy = {
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
    credit: "Render",
    appliedTo: "Applied to",
    legend: "Legend",
    samples: "Colour-matched samples",
    designedBy: "Designed by",
    discord: "Discord",
    previous: "Previous",
    next: "Next",
    zoomIn: "Zoom in",
    zoomOut: "Fit",
    close: "Close",
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
    priceMinor: 12500,
    currency: "EUR",
    image: {
      src: `${ASSETS.kits}/base.png`,
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
    priceMinor: 3500,
    currency: "EUR",
    image: {
      src: `${ASSETS.kits}/numpad.png`,
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
    priceMinor: 3800,
    currency: "EUR",
    image: {
      src: `${ASSETS.kits}/40s.png`,
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
    priceMinor: 4200,
    currency: "EUR",
    image: {
      src: `${ASSETS.kits}/norde.png`,
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
    id: "sw-warm5",
    name: "Warm Gray 5 C",
    code: "LA-WG5",
    hex: "#ACA39A",
    description:
      "The base grey: alphas, modifiers, and every key outside rows 3 and 4. Also the surface this page is printed on.",
    appliesTo: "Base & alphas — all remaining keys",
    legendHex: "#373A36",
    legendName: "Pantone 447 C",
  },
  {
    id: "sw-447",
    name: "Pantone 447 C",
    code: "LA-447",
    hex: "#373A36",
    description: "The legend colour on the base and alpha caps.",
    appliesTo: "Legends — base & alphas",
  },
  {
    id: "sw-7565",
    name: "Pantone 7565 C",
    code: "LA-7565",
    hex: "#CD7925",
    description: "The orange track. Locked to row 3 on every kit in the set.",
    appliesTo: "Row 3 — ASDF · Numpad 4-5-6 · 40s R3",
    legendHex: "#D7D2CB",
    legendName: "Warm Gray 1 C",
  },
  {
    id: "sw-7407",
    name: "Pantone 7407 C",
    code: "LA-7407",
    hex: "#CBA052",
    description: "The gold track. Locked to row 4 on every kit in the set.",
    appliesTo: "Row 4 — ZXCV · Numpad 1-2-3 · 40s R4",
    legendHex: "#D7D2CB",
    legendName: "Warm Gray 1 C",
  },
  {
    id: "sw-warm1",
    name: "Warm Gray 1 C",
    code: "LA-WG1",
    hex: "#D7D2CB",
    description: "The legend colour on the row 3 and row 4 caps.",
    appliesTo: "Legends — row 3 & row 4",
  },
];

/**
 * How the five are applied.
 *
 * Row-locked, not kit-locked: every kit carries all five colours, and the row
 * a key sits in decides which one it gets. Stated once, here, so no kit has
 * to repeat it.
 */
const colourNote =
  "Every kit uses all five colours. Which key gets which is decided by its row, and the rule is the same across the whole set.";

/* ---------------------------------------------------------------------------
 * Station 4 — renders
 * ------------------------------------------------------------------------- */

const renders: RenderGallery = {
  heading: "Renders",
  credit: "Omegaswitch",
  items: [
    {
      id: "rnd-01",
      order: 10,
      board: "F1-8X v2 by Geon",
      asset: {
        src: `${ASSETS.renders}/render-01.jpg`,
        alt: "The set on a full-size board, close",
        width: 5500,
        height: 5500,
      },
    },
    {
      id: "rnd-02",
      order: 20,
      board: "Synovia by Baionlenja",
      asset: {
        src: `${ASSETS.renders}/render-02.jpg`,
        alt: "The set on a tenkeyless board, from above",
        width: 5500,
        height: 5500,
      },
    },
    {
      id: "rnd-03",
      order: 30,
      asset: {
        src: `${ASSETS.renders}/render-03.jpg`,
        alt: "MW LINE A render",
        width: 2400,
        height: 2400,
      },
    },
    {
      id: "rnd-04",
      order: 40,
      asset: {
        src: `${ASSETS.renders}/render-04.jpg`,
        alt: "MW LINE A render",
        width: 2400,
        height: 2400,
      },
    },
    {
      id: "rnd-05",
      order: 50,
      asset: {
        src: `${ASSETS.renders}/render-05.jpg`,
        alt: "MW LINE A render",
        width: 2400,
        height: 2400,
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
 * Colour-matched samples — the physical caps
 *
 * Three, not five. The set is doubleshot, so a cap is a moulded colour and a
 * legend colour together, and the five references pair off into three
 * mouldings. There is no sample of a legend colour on its own to photograph.
 * ------------------------------------------------------------------------- */

const samples: ColorSample[] = [
  {
    id: "smp-7565",
    label: "Pantone 7565 C",
    caption: "Warm Gray 1 C legends",
    image: {
      src: `${ASSETS.colors}/sample-01.png`,
      alt: "Moulded cap in Pantone 7565 C with Warm Gray 1 C legends",
      width: 800,
      height: 800,
    },
  },
  {
    id: "smp-7407",
    label: "Pantone 7407 C",
    caption: "Warm Gray 1 C legends",
    image: {
      src: `${ASSETS.colors}/sample-02.png`,
      alt: "Moulded cap in Pantone 7407 C with Warm Gray 1 C legends",
      width: 800,
      height: 800,
    },
  },
  {
    id: "smp-warm5",
    label: "Warm Gray 5 C",
    caption: "Pantone 447 C legends",
    image: {
      src: `${ASSETS.colors}/sample-03.png`,
      alt: "Moulded cap in Warm Gray 5 C with Pantone 447 C legends",
      width: 800,
      height: 800,
    },
  },
];

/* ---------------------------------------------------------------------------
 * Identity — the marks that ride at the top of the page
 * ------------------------------------------------------------------------- */

const identity: Identity = {
  manufacturer: {
    src: `${ASSETS.logos}/manufacturer.png`,
    /* Nominal only: the header box is fixed and the mark is contained inside
       it, so these do not affect layout. */
    alt: "MilkyWay",
    width: 946,
    height: 241,
  },
  project: {
    src: `${ASSETS.logos}/project.png`,
    alt: "MW LINE A",
    width: 480,
    height: 160,
  },
};

/* ---------------------------------------------------------------------------
 * Designer credits
 *
 * Rendered left to right in this order, with a hairline between them.
 * ------------------------------------------------------------------------- */

const designers: DesignerCredit[] = [
  {
    id: "dsg-01",
    name: "Omegaswitch",
    asset: {
      src: `${ASSETS.logos}/designer-01.png`,
      alt: "Omegaswitch",
      width: 3000,
      height: 3134,
    },
  },
  {
    id: "dsg-02",
    name: "l´Ortizarq",
    asset: {
      src: `${ASSETS.logos}/designer-02.png`,
      alt: "l´Ortizarq",
      width: 3000,
      height: 6176,
    },
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
    discordUrl: "https://discord.gg/milkyway",
    year: "2026–2027",
    locale: "en",
  },
  colors,
  copy,
  identity,
  stations,
  intro,
  kits,
  swatches,
  colourNote,
  samples,
  renders,
  designers,
  vendors,
  terminus,
};

export default project;
