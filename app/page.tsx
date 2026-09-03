import LineRoute, { type RouteStation } from "@/components/line/LineRoute";
import StickyIdentity from "@/components/layout/StickyIdentity";
import SectionStop from "@/components/layout/SectionStop";
import IntroSection from "@/components/sections/IntroSection";
import KitsSection from "@/components/sections/KitsSection";
import ColorsSection from "@/components/sections/ColorsSection";
import RendersSection from "@/components/sections/RendersSection";
import VendorsSection from "@/components/sections/VendorsSection";
import TerminusSection from "@/components/sections/TerminusSection";
import { project } from "@/data/project";
import type { StationId } from "@/types/project";

/**
 * MW LINE A — the route.
 *
 * Six stations, in order, each holding its own viewport stage. A server
 * component: the only client code is the route, the identity, the stop
 * wrappers, and the two galleries that open a lightbox.
 *
 * The station list in `data/project.ts` is the sequence. Adding a stop means
 * adding it there and rendering it here — the route markers, the labels and
 * the spacing all follow from that one list.
 */

/** Stations are spaced evenly down the document. */
const routeStations: RouteStation[] = project.stations.map(
  (station, index, all) => ({
    id: station.id,
    label: station.label,
    progress: all.length > 1 ? index / (all.length - 1) : 0,
    line: station.line,
  }),
);

const stationById = (id: StationId) => {
  const station = project.stations.find((candidate) => candidate.id === id);
  if (!station)
    throw new Error(`Station "${id}" is missing from project.stations`);
  return station;
};

export default function Page() {
  return (
    <>
      <StickyIdentity
        manufacturerLabel={project.meta.studio ?? project.meta.name}
        projectLabel={project.meta.name}
      />
      <LineRoute stations={routeStations} showLabels />

      <main className="relative">
        <SectionStop mode="stop">
          <IntroSection
            intro={project.intro}
            meta={project.meta}
            copy={project.copy}
          />
        </SectionStop>

        <SectionStop mode="stop">
          <KitsSection
            kits={project.kits}
            swatches={project.swatches}
            station={stationById("kits")}
            copy={project.copy}
          />
        </SectionStop>

        <SectionStop mode="stop">
          <ColorsSection
            swatches={project.swatches}
            station={stationById("colors")}
            copy={project.copy}
          />
        </SectionStop>

        <SectionStop mode="stop">
          <RendersSection
            renders={project.renders}
            station={stationById("renders")}
            copy={project.copy}
          />
        </SectionStop>

        <SectionStop mode="stop">
          <VendorsSection
            vendors={project.vendors}
            station={stationById("vendors")}
            copy={project.copy}
          />
        </SectionStop>

        <SectionStop mode="stop">
          <TerminusSection
            terminus={project.terminus}
            station={stationById("terminus")}
            copy={project.copy}
          />
        </SectionStop>
      </main>
    </>
  );
}
