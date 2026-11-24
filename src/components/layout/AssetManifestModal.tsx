import { X } from 'lucide-react';
import { ASSET_MANIFEST_LIST } from '../../experience/models/assetRegistry';

interface AssetManifestModalProps {
  open: boolean;
  onClose: () => void;
}

export function AssetManifestModal({ open, onClose }: AssetManifestModalProps) {
  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="asset-manifest-title"
      className="fixed inset-0 z-50 bg-[#0B0D10]/90 flex items-center justify-center p-4 md:p-8"
    >
      <div className="w-full max-w-3xl max-h-[85vh] overflow-y-auto bg-[#171C22] border border-white/15 rounded-sm p-6 md:p-8 text-[#F7F9FB]">
        <div className="flex items-start justify-between gap-4 pb-5 border-b border-white/10">
          <div>
            <p className="font-mono text-xs tracking-wider uppercase text-[#F28C28] mb-1">
              3D Asset Pipeline
            </p>
            <h2
              id="asset-manifest-title"
              className="font-display text-2xl font-bold tracking-tight"
            >
              GLB Asset Registry &amp; Development Placeholders
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close asset registry modal"
            className="w-10 h-10 inline-flex items-center justify-center rounded-sm bg-[#0B0D10] border border-white/10 text-[#B8C0C8] hover:text-[#F7F9FB] cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <p className="mt-4 text-sm text-[#B8C0C8] leading-relaxed">
          All five industrial products currently render via multi-part procedural
          PBR development placeholders so the WebGL scene operates with zero
          missing-file requests. Replace each entry in{' '}
          <code className="font-mono text-[#F7F9FB]">
            src/experience/models/assetRegistry.ts
          </code>{' '}
          with production <code className="font-mono text-[#F7F9FB]">.glb</code>{' '}
          files using the node specifications below.
        </p>

        <div className="mt-6 space-y-4">
          {ASSET_MANIFEST_LIST.map((asset) => (
            <div
              key={asset.id}
              className="bg-[#0B0D10] border border-white/10 rounded-sm p-4"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-display text-base font-semibold text-[#F7F9FB]">
                  {asset.title}
                </h3>
                <span className="font-mono text-xs text-[#F28C28]">
                  {asset.businessName}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs font-mono text-[#B8C0C8]">
                <span>Path: {asset.glbPath}</span>
                <span>·</span>
                <span>Mode: {asset.sourceMode}</span>
                <span>·</span>
                <span>Target Height: {asset.targetScaleHeight}m</span>
              </div>
              <p className="mt-2 text-xs text-[#B8C0C8]/80">
                Required Nodes: {asset.expectedNodes.join(', ')}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
