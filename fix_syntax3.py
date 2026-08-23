
files = [
    "components/ChatInterface.tsx",
    "components/DiscoverGrid.tsx",
    "components/WorkspaceBoard.tsx"
]

for filepath in files:
    with open(filepath, "r", encoding="utf-8") as f:
        c = f.read()
    
    c = c.replace("\\\"", "\"")
    
    c = c.replace("\"\"#ffffff\"\"", "\"#ffffff\"")
    c = c.replace("\"\"#f4f4f5\"\"", "\"#f4f4f5\"")
    c = c.replace("\"\"none\"\"", "\"none\"")
    c = c.replace("\"1px solid \"#ffffff\"\"", "\"1px solid #000000\"")
    c = c.replace("\"1px solid \"#f4f4f5\"\"", "\"1px solid #000000\"")
    c = c.replace("\"0 0 32px \"#ffffff\"\"", "\"none\"")
    c = c.replace("\"0 8px 32px \"#ffffff\"\"", "\"none\"")
    c = c.replace("\"0 4px 24px \"#ffffff\"\"", "\"none\"")
    c = c.replace("\"0 0 16px \"#ffffff\"\"", "\"none\"")
    c = c.replace("\"1px solid #ffffff\"", "\"1px solid #000000\"")
    
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(c)

