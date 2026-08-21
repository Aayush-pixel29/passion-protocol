"""
Synthetic 3D Image Asset Generator for Passion Protocol (Milestone 1)
Generates and converts all 22 required image assets into public/images/
"""

import os
import math
import random
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance

TARGET_DIR = r"d:\passion-protocol\public\images"
BRAIN_DIR = r"C:\Users\Aayush\.gemini\antigravity\brain\4cd56a2b-9254-4507-a766-ad39f9fd2fc0"
os.makedirs(TARGET_DIR, exist_ok=True)

# 1. Convert brain AI generated images to target PNGs
ai_mappings = {
    "hero-network-matrix.png": "hero_network_matrix",
    "hero-synergy-orbit.png": "hero_synergy_orbit",
    "bento-vibe-engine.png": "bento_vibe_engine",
    "bento-roles-complement.png": "bento_roles_complement",
    "bento-project-incubator.png": "bento_project_incubator",
    "bento-privacy-shield.png": "bento_privacy_shield",
    "bento-smart-contracts.png": "bento_smart_contracts",
    "role-software-coder.png": "role_software_coder",
    "role-creative-designer.png": "role_creative_designer",
    "role-hardware-maker.png": "role_hardware_maker",
}

for png_name, prefix in ai_mappings.items():
    matched = [f for f in os.listdir(BRAIN_DIR) if f.startswith(prefix) and f.endswith(".jpg")]
    if matched:
        src = os.path.join(BRAIN_DIR, sorted(matched)[-1])
        dest = os.path.join(TARGET_DIR, png_name)
        img = Image.open(src).convert("RGBA")
        img.save(dest, "PNG", optimize=True)
        print(f"Converted AI asset: {png_name} ({img.size[0]}x{img.size[1]})")

# Helpers for procedural high-fidelity synthetic graphics
def create_base_canvas(width, height, bg_color=(9, 10, 16, 255)):
    img = Image.new("RGBA", (width, height), bg_color)
    draw = ImageDraw.Draw(img)
    # Add subtle cosmic grid / vignette
    for x in range(0, width, 40):
        draw.line([(x, 0), (x, height)], fill=(255, 255, 255, 6), width=1)
    for y in range(0, height, 40):
        draw.line([(0, y), (width, y)], fill=(255, 255, 255, 6), width=1)
    return img

def add_radial_glow(img, cx, cy, radius, color, max_alpha=120):
    glow = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(glow)
    steps = 30
    for r in range(steps, 0, -1):
        rad = int(radius * (r / steps))
        alpha = int(max_alpha * (1 - (r / steps) ** 1.5))
        c = (color[0], color[1], color[2], alpha)
        draw.ellipse([cx - rad, cy - rad, cx + rad, cy + rad], fill=c)
    glow = glow.filter(ImageFilter.GaussianBlur(radius=8))
    img.paste(Image.alpha_composite(img, glow), (0, 0))

def add_starfield(img, num_stars=150):
    draw = ImageDraw.Draw(img)
    random.seed(42)
    w, h = img.size
    for _ in range(num_stars):
        x = random.randint(0, w)
        y = random.randint(0, h)
        size = random.choice([1, 1, 1, 2, 3])
        brightness = random.randint(100, 255)
        hue_tint = random.choice([(255, 255, 255), (147, 197, 253), (216, 180, 254), (110, 231, 183)])
        color = (hue_tint[0], hue_tint[1], hue_tint[2], brightness)
        if size == 1:
            draw.point((x, y), fill=color)
        else:
            draw.ellipse([x - size, y - size, x + size, y + size], fill=color)

# 11. role-business-growth.png (1024x1024, 1:1)
def generate_role_business_growth():
    w, h = 1024, 1024
    img = create_base_canvas(w, h)
    add_starfield(img, 80)
    add_radial_glow(img, 512, 512, 400, (245, 158, 11), max_alpha=80)
    add_radial_glow(img, 512, 400, 300, (6, 182, 212), max_alpha=60)
    
    layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    
    # 3D Isometric Golden Amber and Cyan Glass Pillars
    pillars = [
        (320, 680, 70, 180, (245, 158, 11, 200), (251, 191, 36, 240)),
        (420, 640, 70, 260, (217, 119, 6, 200), (245, 158, 11, 240)),
        (520, 580, 70, 360, (6, 182, 212, 200), (56, 189, 248, 240)),
        (620, 500, 70, 480, (14, 165, 233, 200), (125, 211, 252, 240)),
    ]
    for px, py, pw, ph, col_side, col_top in pillars:
        # Front face
        draw.rectangle([px, py - ph + pw//2, px + pw, py], fill=col_side, outline=(255, 255, 255, 180), width=2)
        # Top isometric face
        top_poly = [(px, py - ph + pw//2), (px + pw//2, py - ph), (px + pw, py - ph + pw//2), (px + pw//2, py - ph + pw)]
        draw.polygon(top_poly, fill=col_top, outline=(255, 255, 255, 220))
    
    # Glowing upward trend vector line with spark nodes
    trend_pts = [(355, 490), (455, 370), (555, 210), (655, 100)]
    for i in range(len(trend_pts) - 1):
        draw.line([trend_pts[i], trend_pts[i+1]], fill=(255, 255, 255, 240), width=6)
        draw.line([trend_pts[i], trend_pts[i+1]], fill=(6, 182, 212, 200), width=12)
    for tx, ty in trend_pts:
        draw.ellipse([tx - 16, ty - 16, tx + 16, ty + 16], fill=(255, 255, 255, 255), outline=(245, 158, 11, 255), width=3)
    
    img = Image.alpha_composite(img, layer)
    img.save(os.path.join(TARGET_DIR, "role-business-growth.png"), "PNG", optimize=True)
    print("Generated: role-business-growth.png")

# 12. role-marketing-writer.png (1024x1024, 1:1)
def generate_role_marketing_writer():
    w, h = 1024, 1024
    img = create_base_canvas(w, h)
    add_starfield(img, 80)
    add_radial_glow(img, 512, 512, 420, (139, 92, 246), max_alpha=90)
    add_radial_glow(img, 450, 400, 320, (6, 182, 212), max_alpha=70)
    
    layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    
    # 3D Stylized Holographic Fountain Pen Nib
    nib_poly = [(512, 220), (620, 480), (580, 680), (444, 680), (404, 480)]
    draw.polygon(nib_poly, fill=(22, 25, 45, 230), outline=(139, 92, 246, 240), width=4)
    draw.line([(512, 220), (512, 540)], fill=(6, 182, 212, 255), width=4)
    draw.ellipse([496, 524, 528, 556], fill=(255, 61, 110, 255), outline=(255, 255, 255, 255), width=2)
    
    # Glowing cursive particle waves emerging from nib tip
    wave_pts = []
    for t in range(0, 360, 5):
        rad = math.radians(t)
        x = 512 + int(math.sin(rad * 2) * (180 + t * 0.5))
        y = 220 - int(t * 0.4) if 220 - int(t * 0.4) > 50 else 50
        wave_pts.append((x, y))
    
    for pt in wave_pts:
        draw.ellipse([pt[0] - 4, pt[1] - 4, pt[0] + 4, pt[1] + 4], fill=(6, 182, 212, 200))
    
    img = Image.alpha_composite(img, layer)
    img.save(os.path.join(TARGET_DIR, "role-marketing-writer.png"), "PNG", optimize=True)
    print("Generated: role-marketing-writer.png")

# 13. role-general-builder.png (1024x1024, 1:1)
def generate_role_general_builder():
    w, h = 1024, 1024
    img = create_base_canvas(w, h)
    add_starfield(img, 90)
    add_radial_glow(img, 512, 512, 420, (16, 185, 129), max_alpha=80)
    add_radial_glow(img, 512, 512, 300, (255, 61, 110), max_alpha=60)
    
    layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    
    # Polyhedral Crystal Cube with Multifaceted Rays
    cx, cy, sz = 512, 512, 180
    nodes = [
        (cx, cy - sz), (cx + int(sz * 0.866), cy - sz//2), (cx + int(sz * 0.866), cy + sz//2),
        (cx, cy + sz), (cx - int(sz * 0.866), cy + sz//2), (cx - int(sz * 0.866), cy - sz//2),
        (cx, cy)
    ]
    # Faces
    faces = [
        ([0, 1, 6], (255, 61, 110, 160)),
        ([1, 2, 6], (139, 92, 246, 160)),
        ([2, 3, 6], (6, 182, 212, 160)),
        ([3, 4, 6], (16, 185, 129, 160)),
        ([4, 5, 6], (245, 158, 11, 160)),
        ([5, 0, 6], (236, 72, 153, 160)),
    ]
    for face_idxs, col in faces:
        poly = [nodes[i] for i in face_idxs]
        draw.polygon(poly, fill=col, outline=(255, 255, 255, 200), width=3)
    
    # Radiant rainbow rays emitting outwards
    for i in range(12):
        ang = i * (math.pi / 6)
        x2 = cx + int(math.cos(ang) * 380)
        y2 = cy + int(math.sin(ang) * 380)
        draw.line([(cx, cy), (x2, y2)], fill=(255, 255, 255, 100), width=3)
    
    img = Image.alpha_composite(img, layer)
    img.save(os.path.join(TARGET_DIR, "role-general-builder.png"), "PNG", optimize=True)
    print("Generated: role-general-builder.png")

# 14-19: Co-Founder Avatars (1024x1024, 1:1)
def generate_avatar(filename, name_role, primary_color, secondary_color, skin_tone, hair_color, has_glasses=False, has_headband=False, has_headphones=False):
    w, h = 1024, 1024
    img = create_base_canvas(w, h, bg_color=(12, 14, 24, 255))
    add_starfield(img, 40)
    add_radial_glow(img, 512, 512, 450, primary_color, max_alpha=90)
    add_radial_glow(img, 512, 350, 320, secondary_color, max_alpha=70)
    
    layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    
    # 3D Avatar Silhouette & Character Styling
    # Glowing circular pedestal / aura ring
    draw.ellipse([212, 212, 812, 812], outline=(primary_color[0], primary_color[1], primary_color[2], 180), width=6)
    draw.ellipse([224, 224, 800, 800], outline=(secondary_color[0], secondary_color[1], secondary_color[2], 120), width=2)
    
    # Torso / Shoulders
    draw.chord([260, 560, 764, 1000], start=0, end=180, fill=(24, 28, 48, 255), outline=(primary_color[0], primary_color[1], primary_color[2], 200), width=4)
    # Collar / Neon trim
    draw.polygon([(460, 620), (512, 700), (564, 620)], fill=(secondary_color[0], secondary_color[1], secondary_color[2], 220))
    
    # Neck & Head
    draw.rectangle([470, 480, 554, 580], fill=skin_tone)
    draw.ellipse([360, 260, 664, 540], fill=skin_tone, outline=(secondary_color[0], secondary_color[1], secondary_color[2], 180), width=3)
    
    # Hair
    draw.chord([348, 220, 676, 420], start=180, end=360, fill=hair_color)
    draw.ellipse([348, 250, 400, 420], fill=hair_color)
    draw.ellipse([624, 250, 676, 420], fill=hair_color)
    
    # Eyes & Eyebrows
    draw.line([(420, 370), (460, 368)], fill=hair_color, width=4)
    draw.line([(564, 368), (604, 370)], fill=hair_color, width=4)
    draw.ellipse([430, 385, 454, 405], fill=(30, 30, 40, 255))
    draw.ellipse([570, 385, 594, 405], fill=(30, 30, 40, 255))
    draw.point((440, 392), fill=(255, 255, 255, 255))
    draw.point((580, 392), fill=(255, 255, 255, 255))
    
    # Smile
    draw.arc([472, 440, 552, 480], start=10, end=170, fill=(180, 60, 80, 255), width=4)
    
    # Accessories
    if has_glasses:
        draw.ellipse([410, 370, 474, 420], outline=(6, 182, 212, 255), width=4)
        draw.ellipse([550, 370, 614, 420], outline=(6, 182, 212, 255), width=4)
        draw.line([(474, 395), (550, 395)], fill=(6, 182, 212, 255), width=4)
    
    if has_headband:
        draw.rectangle([348, 280, 676, 320], fill=(16, 185, 129, 255), outline=(255, 255, 255, 200), width=2)
    
    if has_headphones:
        # Headphone band
        draw.arc([330, 210, 694, 520], start=180, end=360, fill=(255, 61, 110, 255), width=12)
        draw.ellipse([320, 340, 370, 440], fill=(30, 30, 45, 255), outline=(255, 61, 110, 255), width=4)
        draw.ellipse([654, 340, 704, 440], fill=(30, 30, 45, 255), outline=(255, 61, 110, 255), width=4)
        
    img = Image.alpha_composite(img, layer)
    img.save(os.path.join(TARGET_DIR, filename), "PNG", optimize=True)
    print(f"Generated avatar: {filename}")

# 20. empty-discover-deck.png (1920x1080, 16:9)
def generate_empty_discover_deck():
    w, h = 1920, 1080
    img = create_base_canvas(w, h)
    add_starfield(img, 200)
    add_radial_glow(img, 960, 540, 550, (139, 92, 246), max_alpha=80)
    add_radial_glow(img, 960, 540, 380, (6, 182, 212), max_alpha=70)
    
    layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    
    # Concentric Holographic Radar Sonar Rings
    cx, cy = 960, 540
    for r in [120, 220, 320, 420, 520]:
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=(6, 182, 212, 100), width=2)
    
    # Radar sweep line & crosshairs
    draw.line([(cx - 560, cy), (cx + 560, cy)], fill=(139, 92, 246, 80), width=2)
    draw.line([(cx, cy - 560), (cx, cy + 560)], fill=(139, 92, 246, 80), width=2)
    draw.line([(cx, cy), (cx + 380, cy - 380)], fill=(6, 182, 212, 200), width=4)
    
    # Distant floating constellation blips
    blips = [(cx + 180, cy - 140), (cx - 240, cy + 180), (cx + 310, cy + 220), (cx - 160, cy - 260)]
    for bx, by in blips:
        draw.ellipse([bx - 8, by - 8, bx + 8, by + 8], fill=(255, 61, 110, 255), outline=(255, 255, 255, 255), width=2)
        draw.ellipse([bx - 20, by - 20, bx + 20, by + 20], outline=(255, 61, 110, 120), width=2)
        
    img = Image.alpha_composite(img, layer)
    img.save(os.path.join(TARGET_DIR, "empty-discover-deck.png"), "PNG", optimize=True)
    print("Generated: empty-discover-deck.png")

# 21. empty-messages-chat.png (1920x1080, 16:9)
def generate_empty_messages_chat():
    w, h = 1920, 1080
    img = create_base_canvas(w, h)
    add_starfield(img, 180)
    add_radial_glow(img, 960, 540, 500, (139, 92, 246), max_alpha=90)
    add_radial_glow(img, 960, 480, 360, (255, 61, 110), max_alpha=70)
    
    layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    
    # 3D Floating Translucent Glass Message Envelopes & Chat Bubbles
    # Left Bubble
    b1_poly = [(720, 360), (900, 360), (900, 480), (760, 480), (720, 520)]
    draw.polygon(b1_poly, fill=(22, 26, 46, 220), outline=(139, 92, 246, 240), width=3)
    draw.line([(750, 400), (870, 400)], fill=(139, 92, 246, 180), width=4)
    draw.line([(750, 430), (840, 430)], fill=(139, 92, 246, 180), width=4)
    
    # Right Bubble
    b2_poly = [(1020, 420), (1200, 420), (1200, 580), (1160, 540), (1020, 540)]
    draw.polygon(b2_poly, fill=(22, 26, 46, 220), outline=(6, 182, 212, 240), width=3)
    draw.line([(1050, 460), (1170, 460)], fill=(6, 182, 212, 180), width=4)
    draw.line([(1050, 490), (1140, 490)], fill=(6, 182, 212, 180), width=4)
    
    # Neon Connection Beam / Particle Spark
    draw.line([(900, 420), (1020, 480)], fill=(255, 61, 110, 240), width=4)
    draw.ellipse([950, 440, 970, 460], fill=(255, 255, 255, 255), outline=(255, 61, 110, 255), width=3)
    
    img = Image.alpha_composite(img, layer)
    img.save(os.path.join(TARGET_DIR, "empty-messages-chat.png"), "PNG", optimize=True)
    print("Generated: empty-messages-chat.png")

# 22. cta-nebula-backdrop.png (1920x1080, 16:9)
def generate_cta_nebula_backdrop():
    w, h = 1920, 1080
    img = create_base_canvas(w, h, bg_color=(6, 7, 12, 255))
    add_starfield(img, 300)
    
    # Swirling vortex of electric violet, hot magenta, and cyan
    add_radial_glow(img, 600, 400, 700, (139, 92, 246), max_alpha=110)
    add_radial_glow(img, 1300, 600, 650, (255, 61, 110), max_alpha=100)
    add_radial_glow(img, 960, 540, 500, (6, 182, 212), max_alpha=90)
    add_radial_glow(img, 960, 540, 250, (255, 255, 255), max_alpha=70)
    
    # Add subtle fractal stardust streak
    draw = ImageDraw.Draw(img)
    for i in range(100):
        ang = (i / 100) * 4 * math.pi
        rad = 80 + i * 5
        x = int(960 + math.cos(ang) * rad)
        y = int(540 + math.sin(ang) * (rad * 0.5))
        c = (255, 255, 255, int(180 * (1 - i/100)))
        draw.ellipse([x - 2, y - 2, x + 2, y + 2], fill=c)
        
    img.save(os.path.join(TARGET_DIR, "cta-nebula-backdrop.png"), "PNG", optimize=True)
    print("Generated: cta-nebula-backdrop.png")

# Execute remaining asset generators
generate_role_business_growth()
generate_role_marketing_writer()
generate_role_general_builder()

# Avatars
generate_avatar("avatar-alex-coder.png", "Alex Coder", (139, 92, 246), (6, 182, 212), (235, 195, 170), (45, 35, 30), has_glasses=True)
generate_avatar("avatar-maya-designer.png", "Maya Designer", (255, 61, 110), (139, 92, 246), (240, 205, 185), (35, 25, 35))
generate_avatar("avatar-david-hardware.png", "David Hardware", (16, 185, 129), (6, 182, 212), (225, 190, 165), (60, 45, 35), has_headband=True)
generate_avatar("avatar-elena-growth.png", "Elena Growth", (6, 182, 212), (245, 158, 11), (235, 200, 180), (120, 75, 40))
generate_avatar("avatar-carlos-writer.png", "Carlos Writer", (255, 61, 110), (139, 92, 246), (210, 165, 140), (40, 30, 25), has_headphones=True)
generate_avatar("avatar-priya-fintech.png", "Priya Fintech", (6, 182, 212), (245, 158, 11), (195, 145, 115), (25, 20, 20))

# Empty states & CTA
generate_empty_discover_deck()
generate_empty_messages_chat()
generate_cta_nebula_backdrop()

print("\n--- ALL 22 ASSETS PROCESSED SUCCESSFULLY ---")
