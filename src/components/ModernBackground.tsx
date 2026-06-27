import { type ReactNode } from "react";

type ModernBackgroundProps = {
  children: ReactNode;
};

const ModernBackground = ({ children }: ModernBackgroundProps) => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f6f2e8] text-stone-950">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(28,25,23,0.055)_1px,transparent_1px),linear-gradient(180deg,rgba(28,25,23,0.055)_1px,transparent_1px)] bg-[size:56px_56px]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(246,242,232,0.92),rgba(255,255,255,0.5)_42%,rgba(232,240,238,0.78))]" />
      <div className="relative">{children}</div>
    </div>
  );
};

export default ModernBackground;
