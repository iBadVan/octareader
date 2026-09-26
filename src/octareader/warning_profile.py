from __future__ import annotations

from typing import Iterable, Mapping

CLASSES = (
    "alto_azucar",
    "alto_sodio",
    "alto_grasas_saturadas",
    "contiene_grasas_trans",
)


def create_profile(detected_classes: Iterable[str]) -> dict[str, int]:
    """Convert detected class names into a fixed four-element binary profile."""
    detected = set(detected_classes)
    unknown = detected.difference(CLASSES)
    if unknown:
        raise ValueError(f"Unknown warning classes: {sorted(unknown)}")
    return {name: int(name in detected) for name in CLASSES}


def normalize_profile(profile: Mapping[str, int | bool]) -> dict[str, int]:
    """Validate and normalize a profile to {class: 0|1}."""
    missing = set(CLASSES).difference(profile)
    extra = set(profile).difference(CLASSES)
    if missing or extra:
        raise ValueError(
            f"Invalid profile keys; missing={sorted(missing)}, extra={sorted(extra)}"
        )

    normalized: dict[str, int] = {}
    for key in CLASSES:
        value = int(profile[key])
        if value not in (0, 1):
            raise ValueError(f"{key} must be binary, got {profile[key]!r}")
        normalized[key] = value
    return normalized
