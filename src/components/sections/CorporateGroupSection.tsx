
import { BusinessDirectorySection } from "../corporate/BusinessDirectorySection";
import { IndustriesSection } from "../corporate/IndustriesSection";
import { BusinessEnquirySection } from "../corporate/BusinessEnquirySection";
import { CorporateFooter } from "../corporate/CorporateFooter";
import { AboutGroupSection } from "../corporate/AboutGroupSection";

interface CorporateGroupSectionProps {
  onJumpToBusinessScene: (sceneIndex: number) => void;
  onNavigateSection?: (id: string) => void;
}

export function CorporateGroupSection({
  onJumpToBusinessScene,
  onNavigateSection,
}: CorporateGroupSectionProps) {
  return (
    <div className="relative z-20 border-t border-[var(--apex-border)] apex-theme-bg text-[var(--apex-text-primary)]">
      <AboutGroupSection />

      <BusinessDirectorySection onJumpToBusinessScene={onJumpToBusinessScene} />

      <IndustriesSection />

      <BusinessEnquirySection />

      <CorporateFooter onNavigateSection={onNavigateSection} />
    </div>
  );
}
