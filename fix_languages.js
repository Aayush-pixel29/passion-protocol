const fs = require("fs");
let c = fs.readFileSync("components/OnboardingForm.tsx", "utf8");

const languagesSelect = `              <label style={{ marginTop: 24, display: "block" }}>
                <span className="label">Spoken Language</span>
                <select name="spoken_languages" className="input glass" style={{ background: "rgba(255,255,255,0.9)", color: "#000", width: "100%" }}>
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                  <option value="Chinese">Chinese</option>
                  <option value="Japanese">Japanese</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Arabic">Arabic</option>
                  <option value="Portuguese">Portuguese</option>
                  <option value="Russian">Russian</option>
                </select>
              </label>

              <div style={{ display: "flex", gap: 16, marginTop: 32 }}>`;

c = c.replace(/<div style=\{\{ display: "flex", gap: 16, marginTop: 32 \}\}>/, languagesSelect);

fs.writeFileSync("components/OnboardingForm.tsx", c);
console.log("Added spoken language select to OnboardingForm!");

