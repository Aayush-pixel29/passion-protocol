import { SiteHeader } from "@/components/SiteHeader";
import { DiscoverSkeleton } from "@/components/Skeletons";

export default function DiscoverLoading() {
  return (
    <div className="site">
      <SiteHeader current="discover" signedIn />
      <main className="wrap">
        <div className="page-intro spread">
          <div>
            <div className="badge-pill" style={{ marginBottom: 12 }}>
              <span style={{ color: "#ff3d6e" }}>⚡</span>
              <span>DISCOVER OPERATORS</span>
            </div>
            <h2>
              People who match your <span className="gradient-text">vibe</span>
            </h2>
            <p className="sub" style={{ opacity: 0.5 }}>Loading your matches...</p>
          </div>
        </div>
        <DiscoverSkeleton />
      </main>
    </div>
  );
}
