import LineRoute, { type RouteStation } from "@/components/line/LineRoute";
import StickyIdentity from "@/components/layout/StickyIdentity";
import SectionStop from "@/components/layout/SectionStop";
import HeroSection from "@/components/sections/HeroSection";
import KitsSection from "@/components/sections/KitsSection";
import ColorsSection from "@/components/sections/ColorsSection";
import RendersSection from "@/components/sections/RendersSection";
import ProductInfoSection from "@/components/sections/ProductInfoSection";
import PackagingSection from "@/components/sections/PackagingSection";
import ProjectStatus from "@/components/sections/ProjectStatus";
import VendorsSection from "@/components/sections/VendorsSection";
import ThankYouSection from "@/components/sections/ThankYouSection";
import { project } from "@/data/project";

/**
 * MW LINE A — the document.
 *
 * A server component. Everything on the page is rendered from `project`; the
 * only client code is the route, the identity and the two galleries that open
 * a lightbox.
 *
 * The order is the journey: what it is, what you can buy, what it looks like,
 * what it is made of, where the run has got to, where to buy it, and the
 * terminus.
 */

/**
 * Lifecycle phases become the stations on the rail, spaced evenly down the
 * document. They are markers of scroll position, not of programme progress —
 * the programme's real state is derived separately in `ProjectStatus`.
 */
const stations: RouteStation[] = project.lifecycle.stages.map(
  (stage, index, all) => ({
    id: stage.id,
    label: stage.label,
    progress: all.length > 1 ? index / (all.length - 1) : 0,
    line: index % 2 === 0 ? "primary" : "secondary",
  }),
);

export default function Page() {
  return (
    <>
      <StickyIdentity
        manufacturerLabel={project.meta.studio ?? project.meta.name}
        projectLabel={project.meta.name}
      />
      <LineRoute stations={stations} showLabels />

      <main className="relative">
        {/* Origin and terminus are not stops, and are deliberately unwrapped:
            both carry a marker positioned against the fixed rails, and `scale`
            transforms the whole subtree — pinning them would drag those
            markers off the line. */}
        <HeroSection
          hero={project.hero}
          meta={project.meta}
          copy={project.copy}
        />

        {/* `pass`: content is taller than the viewport. See SectionStop — a
            pinned pane would clip the overflow with no way to reach it. */}
        <SectionStop mode="pass">
          <KitsSection
            kits={project.kits}
            swatches={project.swatches}
            copy={project.copy}
          />
        </SectionStop>

        <SectionStop mode="pass">
          <ColorsSection
            swatches={project.swatches}
            kits={project.kits}
            renders={project.renders}
            vendors={project.vendors}
            copy={project.copy}
          />
        </SectionStop>

        <SectionStop mode="pass">
          <RendersSection renders={project.renders} copy={project.copy} />
        </SectionStop>

        {/* `stop`: these three fit the viewport, so they pin and hold. */}
        <SectionStop mode="stop">
          <ProductInfoSection info={project.info} copy={project.copy} />
        </SectionStop>

        {/* `pass`: adding the component images took this from 662px to
            1338px, past the viewport, so it can no longer pin without
            clipping. Drop the images and it can go back to `stop`. */}
        <SectionStop mode="pass">
          <PackagingSection
            packaging={project.packaging}
            vendors={project.vendors}
            copy={project.copy}
          />
        </SectionStop>

        <SectionStop mode="stop">
          <ProjectStatus lifecycle={project.lifecycle} copy={project.copy} />
        </SectionStop>

        <SectionStop mode="pass">
          <VendorsSection vendors={project.vendors} copy={project.copy} />
        </SectionStop>

        <ThankYouSection
          meta={project.meta}
          logos={project.logos}
          thanks={project.thanks}
          copy={project.copy}
        />
      </main>
    </>
  );
}
