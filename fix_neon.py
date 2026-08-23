
import os
import re

files = [
    "components/ChatInterface.tsx",
    "components/DiscoverGrid.tsx",
    "components/OnboardingForm.tsx",
    "components/WorkspaceBoard.tsx"
]

def de_neon(text):
    # Remove purple neon
    text = re.sub(r"rgba\(180,\s*77,\s*255,\s*[\d.]+\)", "\"#ffffff\"", text)
    # Remove emerald neon
    text = re.sub(r"rgba\(0,\s*255,\s*179,\s*[\d.]+\)", "\"#ffffff\"", text)
    # Remove cyan neon
    text = re.sub(r"rgba\(6,\s*182,\s*212,\s*[\d.]+\)", "\"#ffffff\"", text)
    # Remove dark neon background
    text = re.sub(r"rgba\(8,\s*8,\s*16,\s*[\d.]+\)", "\"#ffffff\"", text)
    # Replace weird white low opacity with solid #f4f4f5
    text = re.sub(r"rgba\(255,\s*255,\s*255,\s*0\.0[235]\)", "\"#f4f4f5\"", text)
    # Replace linear gradients
    text = re.sub(r"linear-gradient\(.*?\)", "\"#ffffff\"", text)
    # Replace glows
    text = re.sub(r"0 4px 24px \"#ffffff\"", "\"none\"", text)
    text = re.sub(r"0 8px 32px \"#ffffff\"", "\"none\"", text)
    text = re.sub(r"0 0 16px \"#ffffff\"", "\"none\"", text)
    
    return text

for filepath in files:
    with open(filepath, "r", encoding="utf-8") as f:
        c = f.read()
    
    c = de_neon(c)
    
    # Just to be safe, replace extra quotes generated
    c = c.replace("\"\"#ffffff\"\"", "\"#ffffff\"")
    c = c.replace("\"\"#f4f4f5\"\"", "\"#f4f4f5\"")
    c = c.replace("\"\"none\"\"", "\"none\"")
    
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(c)

