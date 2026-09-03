import LineRoute, { type RouteStation } from "@/components/line/LineRoute";
import StickyIdentity from "@/components/layout/StickyIdentity";
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
const stations: RouteStation[] = project.lifecycle.stages.map((stage, index, all) => ({
  id: stage.id,
  label: stage.label,
  progress: all.length > 1 ? index / (all.length - 1) : 0,
  line: index % 2 === 0 ? "primary" : "secondary",
}));

export default function Page() {
  return (
    <>
      <StickyIdentity
        manufacturerLabel={project.meta.studio ?? project.meta.name}
        projectLabel={project.meta.name}
      />
      <LineRoute stations={stations} showLabels />

      <main className="relative">
        <HeroSection hero={project.hero} meta={project.meta} />
        <KitsSection kits={project.kits} swatches={project.swatches} />
        <ColorsSection
          swatches={project.swatches}
          kits={project.kits}
          renders={project.renders}
          vendors={project.vendors}
        />
        <RendersSection renders={project.renders} />
        <ProductInfoSection info={project.info} />
        <PackagingSection packaging={project.packaging} vendors={project.vendors} />
        <ProjectStatus lifecycle={project.lifecycle} />
        <VendorsSection vendors={project.vendors} />
        <ThankYouSection meta={project.meta} logos={project.logos} />
      </main>
    </>
  );
}
