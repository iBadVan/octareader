from octareader.compare import compare_profiles
from octareader.warning_profile import create_profile


def test_compare_profiles():
    a = create_profile(["alto_azucar", "alto_grasas_saturadas"])
    b = create_profile(["alto_sodio", "alto_grasas_saturadas"])
    result = compare_profiles(a, b)

    assert result["alto_azucar"]["product_a"] == 1
    assert result["alto_azucar"]["product_b"] == 0
    assert result["alto_grasas_saturadas"]["same"] is True
