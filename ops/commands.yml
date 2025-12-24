import glob, os, yaml

def read(p):
    with open(p, "r", encoding="utf-8") as f: return f.read()

def write(p, s):
    os.makedirs(os.path.dirname(p) or ".", exist_ok=True)
    with open(p, "w", encoding="utf-8") as f: f.write(s)

cfg = yaml.safe_load(open("ops/commands.yml", "r", encoding="utf-8"))
jobs = cfg.get("jobs", [])

changed = 0
for j in jobs:
    if j.get("type") != "replace_text":
        continue

    files = j.get("files")
    if not files:
        pattern = j.get("glob", "**/*.html")
        files = glob.glob(pattern, recursive=True)

    find = j["find"]
    rep = j["replace"]

    for p in files:
        if p.startswith(".github/") or p.startswith("ops/") or p.startswith("scripts/"):
            continue
        if not os.path.isfile(p):
            continue
        t = read(p)
        if find in t:
            write(p, t.replace(find, rep))
            changed += 1

print(f"changed_files={changed}")
