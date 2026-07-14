// Start: Siber Draft Recovery Modal (Strategy 3 — Zero-DB Drafts)
"use client";

import NeonButton from "@/components/ui/NeonButton";
import NeonCard from "@/components/ui/NeonCard";

interface DraftRecoveryModalProps {
  onRecover: () => void;
  onDiscard: () => void;
}

export default function DraftRecoveryModal({
  onRecover,
  onDiscard,
}: DraftRecoveryModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <NeonCard
        title="Draf Diimbas"
        icon="🗂️"
        accent="cyan"
        className="w-full max-w-md"
      >
        <p className="text-sm text-gray-300 mb-4">
          Draf lama dikesan, mahu pulihkan?
        </p>
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <NeonButton variant="ghost" size="md" onClick={onDiscard}>
            Buang
          </NeonButton>
          <NeonButton variant="primary" size="md" onClick={onRecover}>
            Pulihkan Draf
          </NeonButton>
        </div>
      </NeonCard>
    </div>
  );
}
// End: Siber Draft Recovery Modal