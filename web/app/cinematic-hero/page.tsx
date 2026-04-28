import { CinematicHero } from "@/components/ui/cinematic-landing-hero";
import { CinematicLandingSections } from "@/components/cinematic-landing-sections";

export default function CinematicHeroPage() {
  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-background">
      <CinematicHero />
      <CinematicLandingSections />
    </main>
  );
}
