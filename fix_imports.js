const fs = require("fs");
let c = fs.readFileSync("components/features/discover/DiscoverGrid.tsx", "utf8");
c = c.replace(/import \{ AvatarSVG \} from "\.\/Avatar";/g, `import { AvatarSVG } from "@/components/ui/Avatar";`);
fs.writeFileSync("components/features/discover/DiscoverGrid.tsx", c);

c = fs.readFileSync("components/features/onboarding/OnboardingForm.tsx", "utf8");
c = c.replace(/import \{ AvatarSVG \} from "\.\/Avatar";/g, `import { AvatarSVG } from "@/components/ui/Avatar";`);
fs.writeFileSync("components/features/onboarding/OnboardingForm.tsx", c);
console.log("Imports fixed");

