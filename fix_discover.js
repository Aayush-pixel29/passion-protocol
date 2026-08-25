const fs = require("fs");
let c = fs.readFileSync("components/DiscoverGrid.tsx", "utf8");

const languagesHtml = `              {card.profile.spoken_languages && card.profile.spoken_languages.length > 0 && (
                <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                  <span style={{ fontSize: 10, color: "var(--muted)", fontFamily: "var(--font-mono)", textTransform: "uppercase" }}>Languages:</span>
                  {card.profile.spoken_languages.map(lang => (
                    <span key={lang} style={{ padding: "4px 8px", background: "var(--surface-2)", border: "1px solid var(--stroke)", borderRadius: 12, fontSize: 11, color: "var(--ink)" }}>{lang}</span>
                  ))}
                </div>
              )}
              {card.project ? (`;

c = c.replace(/\{card\.project \? \(/, languagesHtml);

fs.writeFileSync("components/DiscoverGrid.tsx", c);
console.log("Added spoken languages to DiscoverGrid!");

