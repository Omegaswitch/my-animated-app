// TEMPORARY — verification harness. Delete once the real page is built.
import LineRoute, { type RouteStation } from "@/components/line/LineRoute";
import StickyIdentity from "@/components/layout/StickyIdentity";
import HeroSection from "@/components/sections/HeroSection";
import KitsSection from "@/components/sections/KitsSection";
import ColorsSection from "@/components/sections/ColorsSection";
import RendersSection from "@/components/sections/RendersSection";
import { project } from "@/data/project";

const stations: RouteStation[] = project.lifecycle.stages.map((stage, index, all) => ({
  id: stage.id,
  label: stage.label,
  progress: index / (all.length - 1),
  line: index % 2 === 0 ? "primary" : "secondary",
}));

export default function PreviewPage() {
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

        {project.lifecycle.stages.map((stage) => (
          <section
            key={stage.id}
            className="relative z-10 flex min-h-screen flex-col justify-center pl-16 pr-6 lg:ml-[50%] lg:pl-16 lg:pr-16"
          >
            <p className="text-[10px] uppercase tracking-[0.3em]">
              Station {String(stage.index).padStart(2, "0")}
            </p>
            <h2 className="mt-3 text-5xl tracking-tight">{stage.label}</h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed">{stage.description}</p>
          </section>
        ))}
      </main>
    </>
  );
}
