import pytest

from octareader.warning_profile import create_profile


def test_create_profile():
    profile = create_profile(["alto_azucar", "alto_grasas_saturadas"])
    assert profile == {
        "alto_azucar": 1,
        "alto_sodio": 0,
        "alto_grasas_saturadas": 1,
        "contiene_grasas_trans": 0,
    }


def test_unknown_class_raises():
    with pytest.raises(ValueError):
        create_profile(["unknown"])
