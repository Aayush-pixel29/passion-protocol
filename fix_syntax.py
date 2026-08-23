
import re
files = [
    "components/ChatInterface.tsx",
    "components/DiscoverGrid.tsx",
    "components/WorkspaceBoard.tsx"
]

for filepath in files:
    with open(filepath, "r", encoding="utf-8") as f:
        c = f.read()
    
    # Fix border: "1px solid "#ffffff"" -> border: "1px solid #ffffff"
    c = re.sub(r"\"(.*?)\"#ffffff\"(.*?)\"", r"\"\1#ffffff\2\"", c)
    c = re.sub(r"\"(.*?)\"#f4f4f5\"(.*?)\"", r"\"\1#f4f4f5\2\"", c)
    c = re.sub(r"\"(.*?)\"none\"(.*?)\"", r"\"\1none\2\"", c)
    
    # Just in case, simpler replacement for the exact errors
    c = c.replace("\"1px solid \"#ffffff\"\"", "\"1px solid #000000\"")
    c = c.replace("\"1px solid \"#f4f4f5\"\"", "\"1px solid #000000\"")
    c = c.replace("\"0 0 32px \"#ffffff\"\"", "\"none\"")
    c = c.replace("\"0 8px 32px \"#ffffff\"\"", "\"none\"")
    c = c.replace("\"0 4px 24px \"#ffffff\"\"", "\"none\"")
    c = c.replace("\"0 0 16px \"#ffffff\"\"", "\"none\"")
    
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(c)

