from __future__ import annotations

import argparse
import json
import time
from pathlib import Path

from ultralytics import YOLO

from .warning_profile import create_profile


def run_inference(weights: str, source: str, conf: float = 0.25) -> dict:
    """Run YOLO inference and return detected classes + warning profile + latency."""
    model = YOLO(weights)

    start = time.perf_counter()
    results = model.predict(source=source, conf=conf, verbose=False)
    elapsed_ms = (time.perf_counter() - start) * 1000.0

    if not results:
        detected_classes: list[str] = []
    else:
        result = results[0]
        names = result.names
        class_ids = []
        if result.boxes is not None and result.boxes.cls is not None:
            class_ids = [int(x) for x in result.boxes.cls.cpu().tolist()]
        detected_classes = sorted({names[class_id] for class_id in class_ids})

    return {
        "source": str(Path(source)),
        "detected_classes": detected_classes,
        "profile": create_profile(detected_classes),
        "processing_time_ms": round(elapsed_ms, 2),
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="OctaReader YOLO inference")
    parser.add_argument("--weights", required=True, help="Path to YOLO weights")
    parser.add_argument("--source", required=True, help="Image path")
    parser.add_argument("--conf", type=float, default=0.25)
    args = parser.parse_args()

    output = run_inference(args.weights, args.source, args.conf)
    print(json.dumps(output, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
