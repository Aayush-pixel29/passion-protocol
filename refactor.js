const fs = require("fs");
const path = require("path");

const moves = {
  "components/AuthForm.tsx": "components/features/auth/AuthForm.tsx",
  "components/ChatInterface.tsx": "components/features/messages/ChatInterface.tsx",
  "components/DiscoverDeck.tsx": "components/features/discover/DiscoverDeck.tsx",
  "components/DiscoverGrid.tsx": "components/features/discover/DiscoverGrid.tsx",
  "components/OnboardingForm.tsx": "components/features/onboarding/OnboardingForm.tsx",
  "components/WorkspaceBoard.tsx": "components/features/workspace/WorkspaceBoard.tsx",
  "components/ProjectForm.tsx": "components/features/onboarding/ProjectForm.tsx",
  
  "components/LandingBentoGrid.tsx": "components/features/landing/LandingBentoGrid.tsx",
  "components/LandingFaq.tsx": "components/features/landing/LandingFaq.tsx",
  "components/LandingHeroPreview.tsx": "components/features/landing/LandingHeroPreview.tsx",
  "components/LandingSimulator.tsx": "components/features/landing/LandingSimulator.tsx",
  "components/SneakPeekMarquee.tsx": "components/features/landing/SneakPeekMarquee.tsx",
  
  "components/SiteHeader.tsx": "components/ui/SiteHeader.tsx",
  "components/Avatar.tsx": "components/ui/Avatar.tsx",
  "components/Skeletons.tsx": "components/ui/Skeletons.tsx",
  "components/DeleteAccountButton.tsx": "components/ui/DeleteAccountButton.tsx",
  "components/SynergyProof.tsx": "components/ui/SynergyProof.tsx",
  "components/SynergyProof.module.css": "components/ui/SynergyProof.module.css",
  "components/PaymentSettings.tsx": "components/features/profile/PaymentSettings.tsx",
};

// Ensure dirs exist
for (const dest of Object.values(moves)) {
  const dir = path.dirname(dest);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// Move files
for (const [src, dest] of Object.entries(moves)) {
  if (fs.existsSync(src)) {
    fs.renameSync(src, dest);
  }
}

// Update imports
function updateImportsInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      updateImportsInDir(fullPath);
    } else if (fullPath.endsWith(".tsx") || fullPath.endsWith(".ts")) {
      let content = fs.readFileSync(fullPath, "utf8");
      let changed = false;
      for (const [src, dest] of Object.entries(moves)) {
        const srcImport = "@/" + src.replace(/\.tsx$/, "").replace(/\.module\.css$/, ".module.css");
        const destImport = "@/" + dest.replace(/\.tsx$/, "").replace(/\.module\.css$/, ".module.css");
        if (content.includes(srcImport)) {
          content = content.replaceAll(srcImport, destImport);
          changed = true;
        }
        
        // Also handle relative imports if any
        const srcBase = path.basename(src).replace(/\.tsx$/, "");
        const destRelative = destImport.replace("@/components/", "");
        // This is a naive regex but it covers many cases
        const relativeRegex = new RegExp(`from [\\x27\\x22](\\.\\.\\/)+${srcBase}[\\x27\\x22]`, "g");
        if (relativeRegex.test(content)) {
          content = content.replace(relativeRegex, `from "@/components/${destRelative}"`);
          changed = true;
        }
      }
      if (changed) {
        fs.writeFileSync(fullPath, content);
        console.log("Updated imports in", fullPath);
      }
    }
  }
}

updateImportsInDir("app");
updateImportsInDir("components");

console.log("Refactor complete.");

