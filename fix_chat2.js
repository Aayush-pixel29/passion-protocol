const fs = require("fs");
let c = fs.readFileSync("components/features/messages/ChatInterface.tsx", "utf8");

// We need to inject NotificationFeed into the sidebar.
c = c.replace(`import { sendMessage, proposePartnership, acceptContract, declineContract } from "@/lib/actions";`, 
  `import { sendMessage, proposePartnership, acceptContract, declineContract } from "@/lib/actions";\nimport { NotificationFeed } from "./NotificationFeed";`);

c = c.replace(/<div className="chat-sidebar"[\s\S]*?<div style=\{\{ padding: "24px"/, 
  `<div className="chat-sidebar" style={{ width: 320, borderRight: "1px solid var(--border)", background: "rgba(255, 255, 255, 0.4)", display: "flex", flexDirection: "column" }}>
        <NotificationFeed currentUserId={currentUserId} />
        <div style={{ padding: "24px"`);

// Strip out the contracts.map() rendering from the chat feed
// We can just find `{contracts.map...` and remove it up to its closing brace.
// Since regex is tricky for nested blocks, I will just do a string replacement.
const contractBlockRegex = /\{contracts\.map\(\(ctr\) => \([\s\S]*?\}\)\}/;
c = c.replace(contractBlockRegex, "");

fs.writeFileSync("components/features/messages/ChatInterface.tsx", c);
console.log("ChatInterface modified!");

