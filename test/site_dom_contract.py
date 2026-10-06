import re
from pathlib import Path

html = Path("site/index.html").read_text()
ids = set(re.findall(r'\bid="([^"]+)"', html))
missing = []

for path in Path("site/js").glob("*.js"):
    source = path.read_text()
    for value in re.findall(r'getElementById\("([^"]+)"\)', source):
        if value not in ids:
            missing.append(f"{path}: {value}")

assert not missing, "Missing DOM ids:\n" + "\n".join(missing)
print(f"site DOM contract OK — {len(ids)} HTML ids checked")
