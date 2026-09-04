import Route from "@/components/line/Route";
import StickyIdentity from "@/components/layout/StickyIdentity";
import IntroSection from "@/components/sections/IntroSection";
import KitsSection from "@/components/sections/KitsSection";
import ColorsSection from "@/components/sections/ColorsSection";
import RendersSection from "@/components/sections/RendersSection";
import VendorsSection from "@/components/sections/VendorsSection";
import TerminusSection from "@/components/sections/TerminusSection";
import { project } from "@/data/project";
import type { StationId } from "@/types/project";

/**
 * MW LINE A.
 *
 * Native document scrolling, start to finish. No sticky panes, no inflated
 * track heights, nothing that holds the page while the wheel spins. Each
 * station is a plain full-height section.
 *
 * Two fixed elements ride above it: the route, which bypasses each station
 * card rather than running under it, and one disc, whose position down the
 * screen is the document's scroll progress.
 * Galleries are picked through with arrows, pills and the arrow keys rather
 * than by scrolling past them.
 */

const stationById = (id: StationId) => {
  const station = project.stations.find((candidate) => candidate.id === id);
  if (!station)
    throw new Error(`Station "${id}" is missing from project.stations`);
  return station;
};

export default function Page() {
  return (
    <>
      <Route />
      <StickyIdentity
        manufacturerLabel={project.meta.studio ?? project.meta.name}
        projectLabel={project.meta.name}
        identity={project.identity}
      />

      <main className="relative z-20">
        <IntroSection
          intro={project.intro}
          meta={project.meta}
          station={stationById("intro")}
          copy={project.copy}
        />

        <KitsSection
          kits={project.kits}
          station={stationById("kits")}
          copy={project.copy}
        />

        <ColorsSection
          swatches={project.swatches}
          samples={project.samples}
          note={project.colourNote}
          station={stationById("colors")}
          copy={project.copy}
        />

        <RendersSection
          renders={project.renders}
          station={stationById("renders")}
          copy={project.copy}
        />

        <VendorsSection
          vendors={project.vendors}
          station={stationById("vendors")}
          copy={project.copy}
        />

        <TerminusSection
          terminus={project.terminus}
          station={stationById("terminus")}
          designers={project.designers}
          copy={project.copy}
        />
      </main>
    </>
  );
}
