/**
 * MW LINE A — single source of truth.
 *
 * A transit-themed doubleshot keycap set, manufactured by MilkyWay and run as
 * a regional group buy. Everything the page renders comes from `project`
 * below. There is no CMS: edit this file, and the document changes. Optional
 * fields are omitted rather than left blank, so a section with nothing to say
 * stays silent.
 *
 * PLACEHOLDER DATA — vendor names, prices, dates and codes are stand-ins.
 * Image `src` paths point at files that do not exist in `/public` yet;
 * `AssetFrame` draws aspect-correct placeholders until they do.
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
  ProjectCopy,
  RenderGallery,
  ThankYou,
  Vendor,
} from "@/types/project";

/**
 * Asset roots.
 *
 * These are URL paths, not filesystem paths. Next serves `public/` at the site
 * root, so a file at `public/kits/base-kit.webp` is fetched as
 * `/kits/base-kit.webp` — writing `/public/kits/...` in a src would 404.
 *
 * Drop real WebP, PNG or SVG files into the matching `public/` subdirectory,
 * keep the filename, and flip `ASSETS_AVAILABLE` in `components/ui/AssetFrame`
 * to swap every placeholder for the real artwork.
 */
const ASSETS = {
  /** -> public/kits/ */
  kits: "/kits",
  /** -> public/renders/ */
  renders: "/renders",
  /** -> public/packaging/ */
  packaging: "/packaging",
  /** -> public/logos/ */
  logos: "/logos",
} as const;

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
 * Copy
 *
 * Every user-facing string that is not itself a piece of content. Sections
 * render what they are handed and invent no wording of their own.
 * ------------------------------------------------------------------------- */

const copy: ProjectCopy = {
  headings: {
    kits: "Kits",
    colors: "Colours",
    vendors: "Vendors",
  },
  counts: {
    configuration: { singular: "configuration" },
    finish: { singular: "finish", plural: "finishes" },
    plate: { singular: "plate" },
    component: { singular: "component" },
    table: { singular: "table" },
    channel: { singular: "channel" },
  },
  kitAvailability: {
    "in-development": "In development",
    sampling: "Sampling",
    released: "Released",
    archived: "Archived",
  },
  swatchFinish: {
    matte: "Matte",
    satin: "Satin",
    gloss: "Gloss",
    anodised: "Anodised",
    raw: "Raw",
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
    europe: "Europe",
    "north-america": "North America",
    "south-america": "South America",
    asia: "Asia",
    oceania: "Oceania",
    africa: "Africa",
    global: "Worldwide",
  },
  lineNames: {
    primary: "Line A",
    secondary: "Line B",
  },
  kitLabels: {
    availability: "Availability",
    price: "Price",
    line: "Line",
  },
  swatchLabels: {
    hex: "Hex",
    ral: "RAL",
    pantone: "Pantone",
    finish: "Finish",
    finisher: "Finisher",
    usedOn: "Used on",
    notReleased: "Not released",
    unassigned: "Unassigned",
    renderCount: { singular: "render" },
  },
  renderLabels: {
    credit: "Render",
  },
  packagingLabels: {
    material: "Material",
    weight: "Weight",
    print: "Print",
    supplier: "Supplier",
    packedWeight: "Packed weight",
  },
  infoLabels: {
    materials: "Materials",
  },
  statusLabels: {
    now: "Now",
    updated: "Updated",
    status: "Status",
  },
  vendorLabels: {
    listingOpen: "Listing open",
    listingPending: "Listing pending",
    allocationPending: "Allocation pending",
    manufacturedBy: "Manufactured by",
    opensInNewTab: "opens in a new tab",
  },
  assetPlaceholder: "Plate reserved",
  originLabel: "Origin",
};

/* ---------------------------------------------------------------------------
 * Thank you
 * ------------------------------------------------------------------------- */

const thanks: ThankYou = {
  eyebrow: "Terminus",
  headline: "Thank you for riding Line A",
  message:
    "MW LINE A exists because people backed it before it was a thing you could hold. Manufactured by MilkyWay.",
  creditsHeading: "Credits",
};

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
    id: "logo-milkyway",
    variant: "wordmark",
    label: "MilkyWay wordmark",
    asset: {
      src: `${ASSETS.logos}/milkyway-wordmark.svg`,
      alt: "MilkyWay",
      width: 640,
      height: 96,
    },
    minWidthMm: 24,
    clearSpace: "Half the cap height on all sides.",
  },
  {
    id: "logo-line-a",
    variant: "lockup",
    label: "MW LINE A lockup",
    asset: {
      src: `${ASSETS.logos}/mw-line-a-lockup.svg`,
      alt: "MW LINE A",
      width: 720,
      height: 160,
    },
    clearSpace: "One line-width on all sides.",
  },
  {
    id: "logo-designer",
    variant: "monogram",
    label: "Designer monogram",
    asset: {
      src: `${ASSETS.logos}/designer-monogram.svg`,
      alt: "Designer monogram",
      width: 128,
      height: 128,
    },
    minWidthMm: 8,
  },
];

/* ---------------------------------------------------------------------------
 * Colourways
 * ------------------------------------------------------------------------- */

const swatches: ProductSwatch[] = [
  {
    id: "sw-signal",
    name: "Signal Orange",
    code: "LA-SIG",
    hex: "#CD7925",
    finish: "matte",
    description: "The accent. Novelty legends and the destination blade.",
    references: { pantone: "PANTONE 1595 C", ral: "RAL 2011" },
    available: true,
    vendorId: "vnd-milkyway",
  },
  {
    id: "sw-brass",
    name: "Brass Ochre",
    code: "LA-BRS",
    hex: "#BE8D4D",
    finish: "satin",
    description: "Secondary accent, used across the modifier set.",
    references: { pantone: "PANTONE 4515 C", ral: "RAL 1024" },
    available: true,
    vendorId: "vnd-milkyway",
  },
  {
    id: "sw-ash",
    name: "Ash Grey",
    code: "LA-ASH",
    hex: "#ACA39A",
    finish: "matte",
    description: "The base. Alphas and the bulk of the standard kit.",
    // Matched off the RAL chip only; no Pantone equivalent on file.
    references: { ral: "RAL 7038" },
    available: true,
    vendorId: "vnd-milkyway",
  },
  {
    id: "sw-graphite",
    name: "Graphite",
    code: "LA-GRA",
    hex: "#1A1714",
    finish: "matte",
    description: "Legend colour on the light caps, cap colour on the dark.",
    references: { pantone: "PANTONE Black 6 C", ral: "RAL 9011" },
    available: true,
    vendorId: "vnd-milkyway",
  },
  {
    id: "sw-bone",
    name: "Bone",
    code: "LA-BNE",
    hex: "#E4DCD2",
    finish: "gloss",
    description: "Held for a possible round two; not tooled yet.",
    references: { pantone: "PANTONE 9184 C" },
    available: false,
    vendorId: "vnd-milkyway",
  },
];

/* ---------------------------------------------------------------------------
 * Kits
 * ------------------------------------------------------------------------- */

const kits: Kit[] = [
  {
    id: "kit-base",
    code: "LA-BASE",
    name: "Base Kit",
    summary:
      "Alphas, core modifiers and the standard bottom row. Covers ANSI on a 60 through TKL.",
    line: "primary",
    availability: "released",
    contents: [
      { name: "Alphas", quantity: 47, material: "ABS doubleshot" },
      { name: "Modifiers", quantity: 31, material: "ABS doubleshot" },
      { name: "6.25u spacebar", quantity: 1, material: "ABS doubleshot" },
      { name: "Function row", quantity: 13, material: "ABS doubleshot" },
    ],
    priceMinor: 12500,
    currency: "EUR",
    swatchIds: ["sw-ash", "sw-graphite", "sw-signal"],
    image: {
      src: `${ASSETS.kits}/base-kit.webp`,
      alt: "Base Kit laid out on a board",
      width: 2400,
      height: 1600,
    },
  },
  {
    id: "kit-extension",
    code: "LA-EXT",
    name: "Extension Kit",
    summary:
      "ISO, split spacebars, stepped caps and the 40s row. Everything the base kit leaves out.",
    line: "primary",
    availability: "released",
    contents: [
      { name: "ISO Enter and Shift", quantity: 3, material: "ABS doubleshot" },
      { name: "Split spacebars", quantity: 4, material: "ABS doubleshot" },
      { name: "40s kit", quantity: 18, material: "ABS doubleshot" },
      { name: "Stepped Caps Lock", quantity: 1, material: "ABS doubleshot" },
    ],
    priceMinor: 6500,
    currency: "EUR",
    swatchIds: ["sw-ash", "sw-graphite", "sw-brass"],
    image: {
      src: `${ASSETS.kits}/extension-kit.webp`,
      alt: "Extension Kit laid flat",
      width: 2400,
      height: 1600,
    },
  },
  {
    id: "kit-novelty",
    code: "LA-NOV",
    name: "Novelty Kit",
    summary:
      "The line map set: terminus, interchange and depot caps, plus the Line A destination blade.",
    line: "secondary",
    availability: "sampling",
    contents: [
      { name: "Novelty 1u", quantity: 8, material: "ABS doubleshot" },
      {
        name: "Destination blade, 2.25u",
        quantity: 1,
        material: "ABS doubleshot",
      },
      { name: "Depot Escape", quantity: 1, material: "ABS doubleshot" },
    ],
    priceMinor: 3500,
    currency: "EUR",
    swatchIds: ["sw-signal", "sw-brass"],
    image: {
      src: `${ASSETS.kits}/novelty-kit.webp`,
      alt: "Novelty Kit caps arranged in a row",
      width: 1600,
      height: 1600,
    },
  },
];

/* ---------------------------------------------------------------------------
 * Renders
 * ------------------------------------------------------------------------- */

const renders: RenderGallery = {
  heading: "Renders",
  intro:
    "Studio passes on a 65% board. Colours are render approximations — the RAL and Pantone chips are the reference.",
  items: [
    {
      id: "rnd-top",
      title: "Full set, top-down",
      view: "top",
      credit: "MilkyWay Studio",
      order: 10,
      swatchId: "sw-ash",
      asset: {
        src: `${ASSETS.renders}/full-set-top.webp`,
        alt: "The full set installed, photographed from above",
        width: 2400,
        height: 1350,
      },
    },
    {
      id: "rnd-quarter",
      title: "65% board, three-quarter",
      view: "three-quarter",
      credit: "MilkyWay Studio",
      order: 20,
      swatchId: "sw-ash",
      asset: {
        src: `${ASSETS.renders}/board-three-quarter.webp`,
        alt: "Board at a three-quarter angle",
        width: 2400,
        height: 1600,
      },
    },
    {
      id: "rnd-alphas",
      title: "Alphas, front elevation",
      view: "front",
      credit: "MilkyWay Studio",
      order: 30,
      swatchId: "sw-graphite",
      asset: {
        src: `${ASSETS.renders}/alphas-front.webp`,
        alt: "Alpha caps seen straight on",
        width: 1600,
        height: 2000,
      },
    },
    {
      id: "rnd-novelty",
      title: "Terminus novelty",
      view: "detail",
      credit: "Atelier Rendu",
      order: 40,
      swatchId: "sw-signal",
      asset: {
        src: `${ASSETS.renders}/terminus-novelty.webp`,
        alt: "Close crop of the terminus novelty cap",
        width: 1600,
        height: 1600,
        caption: "Doubleshot legend, no printing, no coating.",
      },
    },
    {
      id: "rnd-kits",
      title: "Kit layout",
      view: "exploded",
      credit: "Atelier Rendu",
      order: 50,
      asset: {
        src: `${ASSETS.renders}/kit-layout.webp`,
        alt: "All three kits laid out side by side",
        width: 2400,
        height: 1400,
        caption: "Base, Extension and Novelty kits at 1:1.",
      },
    },
    {
      id: "rnd-desk",
      title: "Board in situ",
      view: "in-situ",
      credit: "MilkyWay Studio",
      order: 60,
      swatchId: "sw-brass",
      asset: {
        src: `${ASSETS.renders}/board-in-situ.webp`,
        alt: "Board on a desk",
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
  intro:
    "Moulded pulp trays in an unbleached carton. No foam, no plastic clamshells.",
  components: [
    {
      id: "pkg-tray",
      name: "Moulded cap tray",
      material: "Moulded paper pulp",
      dimensions: { widthMm: 330, heightMm: 122, depthMm: 24, weightG: 88 },
      image: {
        src: `${ASSETS.packaging}/moulded-tray.webp`,
        alt: "Moulded pulp cap tray",
        width: 1600,
        height: 1200,
      },
      vendorId: "vnd-packaging",
    },
    {
      id: "pkg-carton",
      name: "Outer carton",
      material: "Unbleached E-flute corrugate",
      dimensions: { widthMm: 344, heightMm: 136, depthMm: 62, weightG: 165 },
      image: {
        src: `${ASSETS.packaging}/outer-carton.webp`,
        alt: "Unbleached outer carton",
        width: 1600,
        height: 1200,
      },
      print: "1/0 flexo, line black",
      vendorId: "vnd-packaging",
    },
    {
      id: "pkg-sleeve",
      name: "Line map sleeve",
      material: "300gsm uncoated stock",
      dimensions: { widthMm: 342, heightMm: 134, depthMm: 2, weightG: 38 },
      image: {
        src: `${ASSETS.packaging}/line-map-sleeve.webp`,
        alt: "Printed line map sleeve",
        width: 1600,
        height: 1200,
      },
      print: "2/0 screen, Signal Orange and line black",
      vendorId: "vnd-print",
    },
  ],
  notes: [
    "92% post-consumer recycled content across all components.",
    "Kerbside recyclable in full; no separation required.",
    "Trays nest four deep for vendor-to-buyer reshipping.",
  ],
};

/* ---------------------------------------------------------------------------
 * Vendors
 *
 * A group buy runs through regional storefronts. `url` is omitted where a
 * vendor is confirmed but has not published a listing yet.
 * ------------------------------------------------------------------------- */

const vendors: Vendor[] = [
  {
    id: "vnd-milkyway",
    name: "MilkyWay",
    role: "manufacturer",
    region: "global",
    location: "Dongguan, CN",
    status: "confirmed",
    url: "https://milkyway.example",
    notes: "Doubleshot tooling and production.",
  },
  {
    id: "vnd-eu",
    name: "Kesselhaus Keys",
    role: "vendor",
    region: "europe",
    location: "Leipzig, DE",
    status: "confirmed",
    url: "https://kesselhaus.example",
    serves: ["EU", "UK", "CH", "NO"],
  },
  {
    id: "vnd-na",
    name: "Meridian Supply",
    role: "vendor",
    region: "north-america",
    location: "Portland, US",
    status: "confirmed",
    url: "https://meridian-supply.example",
    serves: ["US", "CA", "MX"],
  },
  {
    id: "vnd-asia",
    name: "Interchange Works",
    role: "vendor",
    region: "asia",
    location: "Singapore, SG",
    status: "confirmed",
    // Listing not published yet — the section prints a pending state.
    serves: ["SG", "MY", "JP", "KR", "TW"],
  },
  {
    id: "vnd-oce",
    name: "Southline Keys",
    role: "vendor",
    region: "oceania",
    location: "Melbourne, AU",
    status: "pending",
    serves: ["AU", "NZ"],
    notes: "Allocation still being confirmed.",
  },
  {
    id: "vnd-sa",
    name: "Terminal Sur",
    role: "vendor",
    region: "south-america",
    location: "São Paulo, BR",
    status: "confirmed",
    url: "https://terminalsur.example",
    serves: ["BR", "AR", "CL"],
  },
  {
    id: "vnd-print",
    name: "Kesselhaus Druck",
    // Not a sales channel — it must not appear in the regional vendor scan.
    role: "logistics",
    region: "europe",
    location: "Leipzig, DE",
    status: "confirmed",
    notes: "Sleeve print only; not a sales channel.",
  },
  {
    id: "vnd-packaging",
    name: "Pulp & Board Co.",
    role: "logistics",
    region: "europe",
    location: "Ghent, BE",
    status: "confirmed",
    url: "https://pulpandboard.example",
  },
];

/* ---------------------------------------------------------------------------
 * Specification
 * ------------------------------------------------------------------------- */

const info: ProductInfo = {
  heading: "Specification",
  intro: "Figures are from the approved production sample, not the prototypes.",
  materials: ["ABS, doubleshot", "No coating", "MX-compatible cross stem"],
  groups: [
    {
      id: "inf-caps",
      heading: "Caps",
      line: "primary",
      rows: [
        { label: "Profile", value: "Cherry" },
        { label: "Material", value: "ABS" },
        { label: "Legends", value: "Doubleshot" },
        { label: "Wall thickness", value: "1.5 mm" },
        { label: "Stem", value: "MX cross" },
      ],
    },
    {
      id: "inf-coverage",
      heading: "Coverage",
      line: "secondary",
      rows: [
        { label: "Kits", value: "03" },
        { label: "Caps, all kits", value: "128" },
        { label: "Layouts", value: "ANSI, ISO, 40s" },
        { label: "Boards", value: "60% – TKL" },
      ],
    },
    {
      id: "inf-terms",
      heading: "Group buy",
      line: "secondary",
      rows: [
        { label: "Minimum", value: "300 sets" },
        { label: "Extras", value: "Vendor discretion" },
        { label: "Estimated ship", value: "Q2 2027" },
        { label: "Region", value: "Six vendors" },
      ],
    },
  ],
};

/* ---------------------------------------------------------------------------
 * Lifecycle
 *
 * `current` is the single status key. Stage states are derived from it in
 * `lib/lifecycle.ts` — do not author them here.
 * ------------------------------------------------------------------------- */

const lifecycle: Lifecycle = {
  heading: "Programme",
  current: "production",
  updatedOn: "2026-09-03",
  stages: [
    {
      id: "preparing",
      index: 1,
      label: "Interest check",
      description:
        "Renders published, layout coverage set against the response.",
      startedOn: "2026-01-12",
      completedOn: "2026-02-20",
    },
    {
      id: "sampling",
      index: 2,
      label: "Prototypes",
      description:
        "Three colour passes; Signal Orange approved off the second.",
      startedOn: "2026-02-21",
      completedOn: "2026-04-30",
      vendorIds: ["vnd-milkyway"],
    },
    {
      id: "tooling",
      index: 3,
      label: "Tooling",
      description: "Doubleshot moulds cut and revised; first shot signed off.",
      startedOn: "2026-05-04",
      completedOn: "2026-07-17",
      vendorIds: ["vnd-milkyway"],
    },
    {
      id: "production",
      index: 4,
      label: "Production",
      description: "Full run in moulding. Novelty kit follows the base kits.",
      startedOn: "2026-08-10",
      vendorIds: ["vnd-milkyway"],
    },
    {
      id: "assembly",
      index: 5,
      label: "Sorting and packing",
      description: "Caps sorted to kit, trayed and boxed.",
      vendorIds: ["vnd-milkyway", "vnd-packaging"],
    },
    {
      id: "fulfilment",
      index: 6,
      label: "Vendor shipping",
      description: "Freight to the regional vendors, then out to buyers.",
      vendorIds: ["vnd-eu", "vnd-na", "vnd-asia", "vnd-oce", "vnd-sa"],
    },
    {
      id: "completed",
      index: 7,
      label: "Delivered",
      description: "Run closed. Tooling held for a possible round two.",
    },
  ],
};

/* ---------------------------------------------------------------------------
 * Root
 * ------------------------------------------------------------------------- */

export const project: Project = {
  copy,
  thanks,
  meta: {
    name: "MW LINE A",
    code: "MW-LA",
    tagline: "A transit map for your keyboard",
    description:
      "MW LINE A is a doubleshot keycap set drawn from transit diagrams — terminus, interchange and depot novelties on a warm grey base. Manufactured by MilkyWay, run as a regional group buy.",
    studio: "MilkyWay",
    year: "2026–2027",
    locale: "en",
  },
  colors,
  logos,
  hero: {
    eyebrow: "LINE A / 01",
    headline: "A transit map for your keyboard",
    subhead: "Doubleshot ABS. Cherry profile. Three kits.",
    lead: "MW LINE A runs from interest check to doorstep on a single page. Every figure below is the working figure — when the run moves, this document moves with it.",
    keyline: [
      { label: "Programme", value: "2026–2027" },
      { label: "Phase", value: "Production" },
      { label: "Kits", value: "03" },
      { label: "Colourways", value: "05" },
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
