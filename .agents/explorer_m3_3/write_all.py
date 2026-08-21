# -*- coding: utf-8 -*-
import os

target = r"d:\passion-protocol\.agents\explorer_m3_3\handoff.md"
with open(target, "w", encoding="utf-8") as f:
    f.write("") # truncate

def append_part(p):
    with open(target, "a", encoding="utf-8") as f:
        f.write(p)
