
const fs = require("fs");
let c = fs.readFileSync("components/Avatar.tsx", "utf8");
c = c.replace(/const SKIN_COLORS = \[.*?\];/, "const SKIN_COLORS = [\"#ffffff\"];");
c = c.replace(/const HAIR_COLORS = \[.*?\];/, "const HAIR_COLORS = [\"#000000\"];");
c = c.replace(/const BG_COLORS = \[.*?\];/, "const BG_COLORS = [\"#f4f4f5\", \"#ffffff\", \"#e4e4e7\"];");
c = c.replace(/fill="#ffe033"/, "fill=\"#000000\"");
c = c.replace(/border: .*/, "border: \"2px solid #000000\", boxShadow: \"2px 2px 0px #000000\" }}");
c = c.replace(/className={\`rounded-full overflow-hidden \${className}\`}/, "className={`rounded-full overflow-hidden ${className}`}");
fs.writeFileSync("components/Avatar.tsx", c);

