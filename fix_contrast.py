
import re

files = [
    "components/AuthForm.tsx",
    "components/Avatar.tsx",
    "components/ChatInterface.tsx",
    "components/DiscoverGrid.tsx",
    "components/OnboardingForm.tsx",
    "components/WorkspaceBoard.tsx"
]

for filepath in files:
    with open(filepath, "r", encoding="utf-8") as f:
        c = f.read()

    # Buttons with brand background should have white text
    c = c.replace("color: \"#000\"", "color: \"#ffffff\"")
    c = c.replace("color: \"#000000\"", "color: \"var(--ink)\"")
    
    # Borders
    c = c.replace("border: \"2px solid #000000\"", "border: \"1px solid var(--border)\"")
    c = c.replace("border: \"1px solid #000000\"", "border: \"1px solid var(--border)\"")
    c = c.replace("border: 1px solid #000000;", "border: 1px solid var(--border);")
    c = c.replace("border-right: 1px solid #000000;", "border-right: 1px solid var(--border);")
    c = c.replace("border-bottom: 1px solid #000000;", "border-bottom: 1px solid var(--border);")
    c = c.replace("borderLeft: isActive ? \"4px solid #000000\"", "borderLeft: isActive ? \"4px solid var(--brand)\"")
    
    # Box shadows
    c = c.replace("boxShadow: \"4px 4px 0px #000000\"", "boxShadow: \"var(--shadow-card)\"")
    c = c.replace("boxShadow: isActive ? \"0 0 16px #000000\" : \"none\"", "boxShadow: isActive ? \"var(--shadow-card-hover)\" : \"none\"")
    c = c.replace("boxShadow: isMe ? \"0 4px 24px #000000\" : \"none\"", "boxShadow: \"none\"")
    c = c.replace("boxShadow: \"2px 2px 0px #000000\"", "boxShadow: \"var(--shadow-sm)\"")
    
    # Backgrounds
    c = c.replace("background: \"#000000\"", "background: \"var(--ink)\"")
    c = c.replace("background: inputText.trim() ? \"#000000\" : \"var(--surface)\"", "background: inputText.trim() ? \"var(--brand)\" : \"var(--surface)\"")
    c = c.replace("background: selectedTemplate.key === t.key ? \"#000000\"", "background: selectedTemplate.key === t.key ? \"var(--brand)\"")
    c = c.replace("background: \"#000\"", "background: \"var(--surface-2)\"")
    
    # Specific elements in AuthForm
    c = c.replace("background: \"#000000\"", "background: \"var(--border)\"")  # for the lines
    
    # Drag and drop in WorkspaceBoard
    c = c.replace("borderColor = \"#000000\"", "borderColor = \"var(--brand)\"")
    c = c.replace("border: \"2px dashed #000000\"", "border: \"2px dashed var(--border)\"")

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(c)


