import RouteBackbone from "@/components/line/RouteBackbone";
import StickyIdentity from "@/components/layout/StickyIdentity";
import StationStage from "@/components/layout/StationStage";
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
 * Six stations, each holding its own viewport stage.
 *
 * The spine is permanent — `RouteBackbone` is fixed to the viewport and never
 * fades. Stops are not: each station's disc lives inside its own stage, so
 * only the one you have reached is ever on screen. There is no column of
 * upcoming stops down the side of the page.
 *
 * A server component. The client code is the identity, the six stages, and
 * the two galleries that open a lightbox.
 */

const stationById = (id: StationId) => {
  const station = project.stations.find((candidate) => candidate.id === id);
  if (!station)
    throw new Error(`Station "${id}" is missing from project.stations`);
  return station;
};

const first = project.stations[0].id;
const last = project.stations[project.stations.length - 1].id;

export default function Page() {
  const stage = (id: StationId) => {
    const station = stationById(id);
    return { line: station.line, isFirst: id === first, isLast: id === last };
  };

  return (
    <>
      <RouteBackbone />
      <StickyIdentity
        manufacturerLabel={project.meta.studio ?? project.meta.name}
        projectLabel={project.meta.name}
      />

      <main className="relative">
        {/* One-viewport track: the intro scrolls naturally, with no held
            span to scroll through before the line starts moving. */}
        <StationStage {...stage("intro")} trackVh={100}>
          <IntroSection intro={project.intro} />
        </StationStage>

        <StationStage {...stage("kits")} trackVh={300}>
          <KitsSection
            kits={project.kits}
            swatches={project.swatches}
            station={stationById("kits")}
            copy={project.copy}
          />
        </StationStage>

        <StationStage {...stage("colors")} trackVh={300}>
          <ColorsSection
            swatches={project.swatches}
            kits={project.kits}
            station={stationById("colors")}
            copy={project.copy}
          />
        </StationStage>

        <StationStage {...stage("renders")} trackVh={300}>
          <RendersSection
            renders={project.renders}
            station={stationById("renders")}
            copy={project.copy}
          />
        </StationStage>

        <StationStage {...stage("vendors")}>
          <VendorsSection
            vendors={project.vendors}
            station={stationById("vendors")}
            copy={project.copy}
          />
        </StationStage>

        <StationStage {...stage("terminus")}>
          <TerminusSection
            terminus={project.terminus}
            station={stationById("terminus")}
            copy={project.copy}
          />
        </StationStage>
      </main>
    </>
  );
}
