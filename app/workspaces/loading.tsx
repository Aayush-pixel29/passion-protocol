import { SiteHeader } from "@/components/SiteHeader";
import { WorkspacesSkeleton } from "@/components/Skeletons";

export default function WorkspacesLoading() {
  return (
    <div className="site">
      <SiteHeader current="workspaces" signedIn />
      <main className="wrap">
        <div className="page-intro" style={{ marginBottom: 40 }}>
          <p className="kicker">Command Center</p>
          <h2>Your Active Workspaces</h2>
          <p className="sub" style={{ opacity: 0.5 }}>Loading workspaces...</p>
        </div>
        <WorkspacesSkeleton />
      </main>
    </div>
  );
}
