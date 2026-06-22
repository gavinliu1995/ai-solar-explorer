"use client";

export default function CockpitFrame() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-32 bg-[linear-gradient(to_bottom,rgba(2,6,23,0.68),rgba(2,6,23,0.08),transparent)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-cyan-200/20 shadow-[0_0_18px_rgba(103,232,249,0.2)]" />
      <div className="absolute left-0 top-0 h-full w-28 bg-[linear-gradient(to_right,rgba(2,6,23,0.72),rgba(2,6,23,0.22),transparent)]" />
      <div className="absolute right-0 top-0 h-full w-28 bg-[linear-gradient(to_left,rgba(2,6,23,0.72),rgba(2,6,23,0.22),transparent)]" />

      <div className="absolute bottom-0 left-1/2 h-[19vh] w-[74vw] -translate-x-1/2 rounded-t-[42%] border-t border-cyan-200/12 bg-[radial-gradient(ellipse_at_top,rgba(15,23,42,0.82),rgba(2,6,23,0.94)_68%,rgba(0,0,0,0.98))] shadow-[0_-18px_60px_rgba(2,6,23,0.78)]" />
      <div className="absolute bottom-0 left-0 h-[34vh] w-[28vw] origin-bottom-left -skew-x-12 border-r border-cyan-200/10 bg-[linear-gradient(55deg,rgba(2,6,23,0.98),rgba(15,23,42,0.78),rgba(15,23,42,0.18))]" />
      <div className="absolute bottom-0 right-0 h-[34vh] w-[28vw] origin-bottom-right skew-x-12 border-l border-cyan-200/10 bg-[linear-gradient(305deg,rgba(2,6,23,0.98),rgba(15,23,42,0.78),rgba(15,23,42,0.18))]" />

      <div className="absolute bottom-[9vh] left-[7vw] h-20 w-36 border border-cyan-200/10 bg-black/28 backdrop-blur-sm" />
      <div className="absolute bottom-[9vh] right-[7vw] h-20 w-36 border border-cyan-200/10 bg-black/28 backdrop-blur-sm" />
      <div className="absolute bottom-[9vh] left-[7vw] h-px w-36 bg-cyan-200/20" />
      <div className="absolute bottom-[9vh] right-[7vw] h-px w-36 bg-cyan-200/20" />

      <div className="absolute left-[14vw] top-16 h-px w-[18vw] bg-gradient-to-r from-transparent via-cyan-100/18 to-transparent" />
      <div className="absolute right-[14vw] top-16 h-px w-[18vw] bg-gradient-to-r from-transparent via-cyan-100/18 to-transparent" />
    </div>
  );
}
