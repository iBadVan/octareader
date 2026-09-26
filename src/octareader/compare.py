from __future__ import annotations

from typing import Mapping

from .warning_profile import CLASSES, normalize_profile


def compare_profiles(
    product_a: Mapping[str, int | bool],
    product_b: Mapping[str, int | bool],
) -> dict[str, dict[str, int | bool]]:
    """Compare two warning profiles without inferring nutrient magnitudes."""
    a = normalize_profile(product_a)
    b = normalize_profile(product_b)

    comparison: dict[str, dict[str, int | bool]] = {}
    for warning in CLASSES:
        comparison[warning] = {
            "product_a": a[warning],
            "product_b": b[warning],
            "same": a[warning] == b[warning],
        }
    return comparison
