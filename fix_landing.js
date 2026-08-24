const fs = require("fs");
let c = fs.readFileSync("app/page.tsx", "utf8");

c = c.replace(/import \{ SynergyProof \} from "@\/components\/ui\/SynergyProof";/g, `import { LandingSimulator } from "@/components/features/landing/LandingSimulator";`);
c = c.replace(/<SynergyProof \/>/g, `<LandingSimulator />`);

fs.writeFileSync("app/page.tsx", c);
console.log("Landing page updated to use LandingSimulator!");

