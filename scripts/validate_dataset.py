from __future__ import annotations

import argparse
from collections import Counter
from pathlib import Path

VALID_CLASS_IDS = {0, 1, 2, 3}


def validate_label(path: Path) -> tuple[int, list[str]]:
    count = 0
    errors: list[str] = []

    for line_no, raw in enumerate(path.read_text(encoding="utf-8").splitlines(), start=1):
        line = raw.strip()
        if not line:
            continue
        parts = line.split()
        if len(parts) != 5:
            errors.append(f"{path}:{line_no}: expected 5 fields, got {len(parts)}")
            continue

        try:
            class_id = int(parts[0])
            coords = list(map(float, parts[1:]))
        except ValueError:
            errors.append(f"{path}:{line_no}: non-numeric YOLO label")
            continue

        if class_id not in VALID_CLASS_IDS:
            errors.append(f"{path}:{line_no}: invalid class id {class_id}")
        if any(v < 0.0 or v > 1.0 for v in coords):
            errors.append(f"{path}:{line_no}: coordinates must be normalized to [0,1]")

        count += 1

    return count, errors


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("labels_dir")
    args = parser.parse_args()

    labels_dir = Path(args.labels_dir)
    files = sorted(labels_dir.rglob("*.txt"))
    if not files:
        print("No label files found.")
        return

    total_boxes = 0
    all_errors: list[str] = []
    classes = Counter()

    for path in files:
        for raw in path.read_text(encoding="utf-8").splitlines():
            parts = raw.split()
            if parts:
                try:
                    classes[int(parts[0])] += 1
                except ValueError:
                    pass
        count, errors = validate_label(path)
        total_boxes += count
        all_errors.extend(errors)

    print(f"Label files: {len(files)}")
    print(f"Boxes: {total_boxes}")
    print(f"Class counts: {dict(sorted(classes.items()))}")

    if all_errors:
        print("\nErrors:")
        for error in all_errors:
            print(f"- {error}")
        raise SystemExit(1)

    print("Dataset labels passed validation.")


if __name__ == "__main__":
    main()
