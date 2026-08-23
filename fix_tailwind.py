
import os
import re

files = [
    "components/WorkspaceBoard.tsx",
    "components/DiscoverGrid.tsx"
]

for filepath in files:
    with open(filepath, "r", encoding="utf-8") as f:
        c = f.read()
    
    c = re.sub(r"className=\"hover:border-.*?\"", "", c)
    
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(c)

