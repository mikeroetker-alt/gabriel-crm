from __future__ import annotations

import base64
from pathlib import Path

ROOT = Path(__file__).resolve().parent

ASSETS = {
    "Final_Stack_Month_1_to_3_Projections.xlsx.b64": "Final_Stack_Month_1_to_3_Projections.xlsx",
}

for encoded_name, output_name in ASSETS.items():
    encoded_path = ROOT / encoded_name
    output_path = ROOT / output_name

    if not encoded_path.exists():
        raise FileNotFoundError(f"Missing encoded asset: {encoded_path}")

    raw = base64.b64decode(encoded_path.read_text(encoding="utf-8").strip())
    output_path.write_bytes(raw)
    print(f"Decoded {encoded_name} -> {output_name} ({len(raw):,} bytes)")
