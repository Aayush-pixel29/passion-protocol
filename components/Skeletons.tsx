"use client";

/**
 * Skeleton components for loading states.
 * These render immediately while server components fetch data,
 * giving the user instant visual feedback instead of a blank screen.
 */

export function SkeletonCard() {
  return (
    <div 
      className="glass-panel" 
      style={{ 
        padding: 24, 
        height: 280,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        animation: "pulse 1.5s ease-in-out infinite"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--surface-inset)" }} />
        <div style={{ flex: 1 }}>
          <div style={{ height: 16, width: "60%", background: "var(--surface-inset)", borderRadius: 4, marginBottom: 6 }} />
          <div style={{ height: 12, width: "80%", background: "var(--surface-inset)", borderRadius: 4 }} />
        </div>
        <div style={{ width: 48, height: 28, borderRadius: 14, background: "var(--surface-inset)" }} />
      </div>
      <div style={{ height: 12, width: "100%", background: "var(--surface-inset)", borderRadius: 4 }} />
      <div style={{ height: 12, width: "70%", background: "var(--surface-inset)", borderRadius: 4 }} />
      <div style={{ flexGrow: 1 }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <div style={{ height: 12, background: "var(--surface-inset)", borderRadius: 4 }} />
        <div style={{ height: 12, background: "var(--surface-inset)", borderRadius: 4 }} />
        <div style={{ height: 12, background: "var(--surface-inset)", borderRadius: 4 }} />
        <div style={{ height: 12, background: "var(--surface-inset)", borderRadius: 4 }} />
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <div style={{ height: 36, flex: 1, borderRadius: 8, background: "var(--surface-inset)" }} />
        <div style={{ height: 36, flex: 1, borderRadius: 8, background: "var(--surface-inset)" }} />
      </div>
    </div>
  );
}

export function DiscoverSkeleton() {
  return (
    <div>
      {/* Filter bar skeleton */}
      <div style={{ 
        display: "flex", 
        flexWrap: "wrap", 
        gap: 12, 
        marginBottom: 24, 
        padding: "16px 20px",
        background: "var(--surface-card)",
        border: "1px solid var(--stroke)",
        borderRadius: "var(--radius-sm)",
        animation: "pulse 1.5s ease-in-out infinite"
      }}>
        <div style={{ height: 40, flex: "1 1 200px", minWidth: 200, background: "var(--surface-inset)", borderRadius: 8 }} />
        <div style={{ display: "flex", gap: 6 }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} style={{ height: 32, width: 80, borderRadius: 16, background: "var(--surface-inset)" }} />
          ))}
        </div>
      </div>
      {/* Cards grid skeleton */}
      <div className="match-grid">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}

export function ChatSkeleton() {
  return (
    <div style={{ display: "flex", flexGrow: 1, width: "100%", height: "100%", animation: "pulse 1.5s ease-in-out infinite" }}>
      {/* Sidebar skeleton */}
      <div style={{ width: 300, borderRight: "1px solid var(--stroke)", padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
        {[1, 2, 3].map(i => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--surface-inset)" }} />
            <div style={{ flex: 1 }}>
              <div style={{ height: 14, width: "70%", background: "var(--surface-inset)", borderRadius: 4, marginBottom: 4 }} />
              <div style={{ height: 10, width: "50%", background: "var(--surface-inset)", borderRadius: 4 }} />
            </div>
          </div>
        ))}
      </div>
      {/* Chat area skeleton */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--dim)" }}>
        <div style={{ height: 16, width: 200, background: "var(--surface-inset)", borderRadius: 4 }} />
      </div>
    </div>
  );
}

export function WorkspacesSkeleton() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24, animation: "pulse 1.5s ease-in-out infinite" }}>
      {[1, 2, 3].map(i => (
        <div key={i} className="glass-panel" style={{ padding: 24, height: 220 }}>
          <div style={{ height: 20, width: "40%", background: "var(--surface-inset)", borderRadius: 4, marginBottom: 8 }} />
          <div style={{ height: 24, width: "70%", background: "var(--surface-inset)", borderRadius: 4, marginBottom: 4 }} />
          <div style={{ height: 14, width: "50%", background: "var(--surface-inset)", borderRadius: 4, marginBottom: 20 }} />
          <div style={{ height: 1, background: "var(--stroke-subtle)", marginBottom: 16 }} />
          <div style={{ height: 12, width: "30%", background: "var(--surface-inset)", borderRadius: 4, marginBottom: 4 }} />
          <div style={{ height: 14, width: "90%", background: "var(--surface-inset)", borderRadius: 4, marginBottom: 20 }} />
          <div style={{ height: 1, background: "var(--stroke-subtle)", marginBottom: 16 }} />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ height: 18, width: 60, background: "var(--surface-inset)", borderRadius: 4 }} />
            <div style={{ height: 18, width: 120, background: "var(--surface-inset)", borderRadius: 4 }} />
          </div>
        </div>
      ))}
    </div>
  );
}
