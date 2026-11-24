import { Layers } from 'lucide-react';
import { useState } from 'react';
import { AssetManifestModal } from './AssetManifestModal';

export function DevToolsOverlay() {
  const [manifestOpen, setManifestOpen] = useState(false);

  if (!import.meta.env.DEV) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setManifestOpen(true)}
        className="fixed bottom-4 right-4 z-40 hidden lg:inline-flex items-center gap-2 px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider bg-[var(--apex-surface)] border border-[var(--apex-border)] text-[var(--apex-text-secondary)] hover:text-[var(--apex-text-primary)] hover:border-[#F28C28] rounded-sm cursor-pointer"
      >
        <Layers size={13} className="text-[#F28C28]" />
        <span>Asset Manifest</span>
      </button>

      <AssetManifestModal
        open={manifestOpen}
        onClose={() => setManifestOpen(false)}
      />
    </>
  );
}
