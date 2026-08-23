import { SiteHeader } from "@/components/SiteHeader";
import { ChatSkeleton } from "@/components/Skeletons";

export default function MessagesLoading() {
  return (
    <div className="site">
      <SiteHeader current="messages" signedIn />
      <main style={{ 
        display: "flex", 
        flexDirection: "column", 
        height: "calc(100vh - 64px)",
        overflow: "hidden" 
      }}>
        <div style={{ flexGrow: 1, display: "flex", overflow: "hidden" }}>
          <ChatSkeleton />
        </div>
      </main>
    </div>
  );
}
