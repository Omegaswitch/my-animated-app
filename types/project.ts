/**
 * MW LINE A — content model.
 *
 * The page is a single data-driven document: every layout reads from the
 * `Project` object in `data/project.ts` and renders nothing it is not given.
 * Optional fields (`?`) are omitted rather than blank — a section that
 * receives no data does not render a placeholder.
 */

/* ---------------------------------------------------------------------------
 * Primitives
 * ------------------------------------------------------------------------- */

/** Six-digit hex, including the leading `#`. */
export type Hex = `#${string}`;

/** Calendar date, `YYYY-MM-DD`. Stored as a string so data stays serialisable. */
export type ISODate = string;

/**
 * Which of the two parallel lines an element is pinned to. The design system
 * runs a primary and a secondary line; data declares its own allegiance so
 * layouts never hard-code colour.
 */
export type LineRef = "primary" | "secondary";

export interface ImageAsset {
  src: string;
  /** Empty string marks the image as decorative. */
  alt: string;
  width: number;
  height: number;
  caption?: string;
}

export interface Link {
  label: string;
  href: string;
  external?: boolean;
}

/* ---------------------------------------------------------------------------
 * Meta
 * ------------------------------------------------------------------------- */

export interface Meta {
  /** Display name, e.g. "MW LINE A". */
  name: string;
  /** Short machine code used in tabular/diagram contexts, e.g. "MW-LA". */
  code: string;
  /** One line, sentence case, no trailing period. */
  tagline: string;
  description: string;
  client?: string;
  studio?: string;
  /** Programme year or range, e.g. "2026" or "2025–2026". */
  year: string;
  /** Canonical URL, used for metadata and share cards. */
  url?: string;
  locale: string;
}

/* ---------------------------------------------------------------------------
 * Colour
 * ------------------------------------------------------------------------- */

/**
 * The interface palette — the surface the document is printed on, not the
 * product finishes. Product colours live in `ProductSwatch`.
 */
export interface Palette {
  ground: Hex;
  linePrimary: Hex;
  lineSecondary: Hex;
  ink: Hex;
}

/* ---------------------------------------------------------------------------
 * Logos
 * ------------------------------------------------------------------------- */

export type LogoVariant = "wordmark" | "monogram" | "lockup" | "symbol";

export interface Logo {
  id: string;
  variant: LogoVariant;
  label: string;
  asset: ImageAsset;
  /** Minimum reproduction width in millimetres, for the spec sheet. */
  minWidthMm?: number;
  clearSpace?: string;
  notes?: string;
}

/* ---------------------------------------------------------------------------
 * Hero / intro
 * ------------------------------------------------------------------------- */

export interface Hero {
  /** Small label riding above the headline, e.g. "LINE A / 01". */
  eyebrow?: string;
  headline: string;
  subhead?: string;
  /** Lead paragraph, one or two sentences. */
  lead: string;
  /** Short label/value pairs printed as a diagram key beneath the lead. */
  keyline?: FactPair[];
  image?: ImageAsset;
  actions?: Link[];
}

export interface FactPair {
  label: string;
  value: string;
}

/* ---------------------------------------------------------------------------
 * Kits
 * ------------------------------------------------------------------------- */

export type KitAvailability = "in-development" | "sampling" | "released" | "archived";

export interface KitComponent {
  name: string;
  quantity: number;
  material?: string;
  note?: string;
}

export interface Kit {
  id: string;
  /** SKU or internal code, e.g. "LA-K01". */
  code: string;
  name: string;
  summary: string;
  line: LineRef;
  availability: KitAvailability;
  contents: KitComponent[];
  /** Minor units (cents) to avoid float drift; omit while unpriced. */
  priceMinor?: number;
  currency?: string;
  /** Swatch ids from `Project["swatches"]` this kit ships in. */
  swatchIds?: string[];
  image?: ImageAsset;
}

/* ---------------------------------------------------------------------------
 * Product colour swatches
 * ------------------------------------------------------------------------- */

export type SwatchFinish = "matte" | "satin" | "gloss" | "anodised" | "raw";

/**
 * External colour references. Any subset may be present — a finish matched to
 * a RAL chip may have no Pantone equivalent, and vice versa. The hex on the
 * swatch is always the on-screen truth; these are the physical references.
 */
export interface ColorReferences {
  pantone?: string;
  ral?: string;
}

export interface ProductSwatch {
  id: string;
  name: string;
  /** Internal colour code, e.g. "LA-CLAY". */
  code: string;
  hex: Hex;
  finish: SwatchFinish;
  references?: ColorReferences;
  available: boolean;
  /** Vendor id responsible for this finish. */
  vendorId?: string;
}

/* ---------------------------------------------------------------------------
 * Renders gallery
 * ------------------------------------------------------------------------- */

export type RenderView = "front" | "three-quarter" | "top" | "detail" | "exploded" | "in-situ";

export interface RenderItem {
  id: string;
  title: string;
  view: RenderView;
  asset: ImageAsset;
  /** Swatch id shown in the render, when it depicts a specific finish. */
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
 * Packaging
 * ------------------------------------------------------------------------- */

export interface Dimensions {
  widthMm: number;
  heightMm: number;
  depthMm: number;
  weightG?: number;
}

export interface PackagingComponent {
  id: string;
  name: string;
  material: string;
  dimensions: Dimensions;
  /** Print process, e.g. "1/0 screen, matte varnish". */
  print?: string;
  vendorId?: string;
}

export interface Packaging {
  heading: string;
  intro?: string;
  components: PackagingComponent[];
  /** Flat notes printed as a spec list, e.g. recycled content. */
  notes?: string[];
}

/* ---------------------------------------------------------------------------
 * Vendors
 * ------------------------------------------------------------------------- */

export type VendorRole =
  | "manufacturing"
  | "tooling"
  | "finishing"
  | "print"
  | "packaging"
  | "logistics";

export type VendorStatus = "engaged" | "quoting" | "contracted" | "dormant";

export interface Vendor {
  id: string;
  name: string;
  role: VendorRole;
  /** City, country. */
  location: string;
  status: VendorStatus;
  /** Typical turnaround in working days. */
  leadTimeDays?: number;
  contact?: Link;
  notes?: string;
}

/* ---------------------------------------------------------------------------
 * Dynamic product info
 * ------------------------------------------------------------------------- */

/**
 * Free-form spec tables. Groups render as labelled blocks so new rows can be
 * added without touching a layout.
 */
export interface InfoGroup {
  id: string;
  heading: string;
  rows: FactPair[];
  line?: LineRef;
}

export interface ProductInfo {
  heading: string;
  intro?: string;
  groups: InfoGroup[];
  dimensions?: Dimensions;
  materials?: string[];
}

/* ---------------------------------------------------------------------------
 * Lifecycle
 * ------------------------------------------------------------------------- */

/**
 * Ordered programme phases, `preparing` through `completed`. The union is the
 * source of truth for order — `LIFECYCLE_ORDER` in `data/project.ts` mirrors it
 * and is checked against this type at compile time.
 */
export type LifecyclePhase =
  | "preparing"
  | "sampling"
  | "tooling"
  | "production"
  | "assembly"
  | "fulfilment"
  | "completed";

/** Derived state for a stage, driving which line colour it renders in. */
export type StageState = "complete" | "active" | "upcoming";

export interface LifecycleStage {
  id: LifecyclePhase;
  /** Station number printed on the diagram, 1-indexed. */
  index: number;
  label: string;
  description?: string;
  state: StageState;
  startedOn?: ISODate;
  completedOn?: ISODate;
  /** Vendor ids active during this stage. */
  vendorIds?: string[];
}

export interface Lifecycle {
  heading: string;
  current: LifecyclePhase;
  updatedOn: ISODate;
  stages: LifecycleStage[];
}

/* ---------------------------------------------------------------------------
 * Root
 * ------------------------------------------------------------------------- */

export interface Project {
  meta: Meta;
  colors: Palette;
  logos: Logo[];
  hero: Hero;
  kits: Kit[];
  swatches: ProductSwatch[];
  renders: RenderGallery;
  packaging: Packaging;
  vendors: Vendor[];
  info: ProductInfo;
  lifecycle: Lifecycle;
}
