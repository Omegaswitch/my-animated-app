/**
 * MW LINE A — content model.
 *
 * The page is one route with six stations. Every layout reads from the
 * `Project` object in `data/project.ts` and renders nothing it is not given;
 * no component holds copy of its own. Optional fields (`?`) are omitted
 * rather than blank — a section given nothing renders nothing.
 */

/* ---------------------------------------------------------------------------
 * Primitives
 * ------------------------------------------------------------------------- */

/** Six-digit hex, including the leading `#`. */
export type Hex = `#${string}`;

/** Calendar date, `YYYY-MM-DD`. Stored as a string so data stays serialisable. */
export type ISODate = string;

/** Which of the two parallel tracks an element belongs to. */
export type LineRef = "primary" | "secondary";

export interface ImageAsset {
  src: string;
  /** Empty string marks the image as decorative. */
  alt: string;
  width: number;
  height: number;
  caption?: string;
}

/* ---------------------------------------------------------------------------
 * Meta
 * ------------------------------------------------------------------------- */

export interface Meta {
  name: string;
  /** Short machine code used in diagram contexts, e.g. "MW-LA". */
  code: string;
  tagline: string;
  description: string;
  studio?: string;
  /** Community invite. Omit and the hero button is not rendered. */
  discordUrl?: string;
  year: string;
  url?: string;
  locale: string;
}

export interface Palette {
  ground: Hex;
  paper: Hex;
  linePrimary: Hex;
  lineSecondary: Hex;
  ink: Hex;
}

/* ---------------------------------------------------------------------------
 * Stations
 *
 * The route is authored, not inferred. Each stop names itself and declares
 * which track its disc sits on, so `LineRoute` and the sections stay in step.
 * ------------------------------------------------------------------------- */

export type StationId =
  "intro" | "kits" | "colors" | "renders" | "vendors" | "terminus";

export interface Station {
  id: StationId;
  /** Printed beside the disc on the route. */
  label: string;
  /** Stop number, 1-indexed. */
  index: number;
  /** Which track the disc is stroked in. The terminus marks both. */
  line: LineRef;
}

/* ---------------------------------------------------------------------------
 * Station 1 — intro
 * ------------------------------------------------------------------------- */

export interface FactPair {
  label: string;
  value: string;
}

export interface Intro {
  eyebrow?: string;
  headline: string;
  subhead?: string;
  lead: string;
  keyline?: FactPair[];
}

/* ---------------------------------------------------------------------------
 * Station 2 — kits
 * ------------------------------------------------------------------------- */

export interface Kit {
  id: string;
  /** SKU or internal code. */
  code: string;
  name: string;
  summary: string;
  line: LineRef;
  /** Minor units (cents) to avoid float drift; omit while unpriced. */
  priceMinor?: number;
  currency?: string;
  image?: ImageAsset;
}

/* ---------------------------------------------------------------------------
 * Station 3 — colours
 * ------------------------------------------------------------------------- */

export interface ProductSwatch {
  id: string;
  /** Reference name, e.g. "Pantone 447 C". */
  name: string;
  /** Internal code. */
  code: string;
  hex: Hex;
  /** One line on where the colour sits in the set. */
  description?: string;
  /**
   * The keys this colour is locked to, across every kit — the row rule.
   *
   * The set is row-locked rather than kit-locked: each kit uses all five
   * colours, and which key gets which is decided by the row it sits in. So
   * the mapping is authored here, once, and not repeated per kit.
   */
  appliesTo?: string;
  /** Legend colour printed on this cap. Omitted on the legend colours. */
  legendHex?: Hex;
  legendName?: string;
}

/** A physical chip shot next to the digital swatch. */
export interface ColorSample {
  id: string;
  label: string;
  image: ImageAsset;
  caption?: string;
}

/* ---------------------------------------------------------------------------
 * Station 4 — renders
 * ------------------------------------------------------------------------- */

export type RenderView =
  "front" | "three-quarter" | "top" | "detail" | "exploded" | "in-situ";

export interface RenderItem {
  id: string;
  title: string;
  view: RenderView;
  asset: ImageAsset;
  /** Board the render depicts, e.g. "65% board". */
  model?: string;
  /** Who made the render. */
  credit?: string;
  swatchId?: string;
  /** Ordering weight within the gallery; lower sorts first. */
  order: number;
}

export interface RenderGallery {
  heading: string;
  intro?: string;
  items: RenderItem[];
}

/* ---------------------------------------------------------------------------
 * Station 5 — vendors
 * ------------------------------------------------------------------------- */

export type VendorRegion =
  "north-america" | "europe" | "asia" | "oceania" | "south-america" | "africa";

export interface Vendor {
  id: string;
  name: string;
  region: VendorRegion;
  /** Storefront. Omitted while a vendor has not published a listing. */
  url?: string;
  /** Territories served, printed beneath the name. */
  serves?: string[];
}

/* ---------------------------------------------------------------------------
 * Station 6 — terminus
 *
 * The group buy runs through five stages. `current` is the only authored
 * status: everything before it is done, everything after is pending. Storing
 * a state per stage as well would let the two disagree.
 * ------------------------------------------------------------------------- */

export type GbStage =
  "preparing" | "group-buy" | "manufacturing" | "shipping" | "completed";

export type StageState = "complete" | "active" | "pending";

export interface Terminus {
  eyebrow: string;
  headline: string;
  message: string;
  /** Labels for each stage, in order of `GB_STAGE_ORDER`. */
  stageLabels: Record<GbStage, string>;
  /** The single status key the indicator is derived from. */
  current: GbStage;
  updatedOn: ISODate;
}

/**
 * The two marks at the top of the page. Either may be absent, in which case
 * that side falls back to its geometric placeholder.
 */
export interface Identity {
  manufacturer?: ImageAsset;
  project?: ImageAsset;
}

/** Studio credit printed at the terminus. */
export interface DesignerCredit {
  id: string;
  name: string;
  asset: ImageAsset;
}

/* ---------------------------------------------------------------------------
 * Copy
 *
 * Every user-facing string the layouts would otherwise hard-code. Components
 * render what they are given and invent no text of their own.
 * ------------------------------------------------------------------------- */

export interface ProjectCopy {
  renderView: Record<RenderView, string>;
  vendorRegion: Record<VendorRegion, string>;
  lineNames: Record<LineRef, string>;
  labels: {
    /** Beside the intro's origin marker. */
    origin: string;
    credit: string;
    /** Heads the row rule in the colour detail. */
    appliedTo: string;
    /** Precedes the legend colour's name. */
    legend: string;
    samples: string;
    designedBy: string;
    discord: string;
    previous: string;
    next: string;
    zoomIn: string;
    zoomOut: string;
    close: string;
    listingPending: string;
    opensInNewTab: string;
    stage: string;
    updated: string;
    /** Printed on an asset frame while the artwork is missing. */
    assetPlaceholder: string;
  };
}

/* ---------------------------------------------------------------------------
 * Root
 * ------------------------------------------------------------------------- */

export interface Project {
  meta: Meta;
  colors: Palette;
  copy: ProjectCopy;
  identity: Identity;
  stations: Station[];
  intro: Intro;
  kits: Kit[];
  swatches: ProductSwatch[];
  /** Standing line above the palette: how the five are applied. */
  colourNote: string;
  samples: ColorSample[];
  renders: RenderGallery;
  designers: DesignerCredit[];
  vendors: Vendor[];
  terminus: Terminus;
}
