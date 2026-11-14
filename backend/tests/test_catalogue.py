"""Research scenarios remain finite, deterministic, and explicit about provenance."""
from math import isfinite

from app.catalogue import SCENARIO_COUNT, case_index, evaluate_case


def test_catalogue_count():
    assert SCENARIO_COUNT == 4800


def test_sampled_cases_are_executable():
    for case_id in range(1, SCENARIO_COUNT + 1, 37):
        case = evaluate_case(case_id, 63.0, 3.1)
        assert case["synthetic"] is True
        assert isfinite(case["expected_flux_lmh"])
        assert case["expected_flux_lmh"] >= 0


def test_catalogue_index_is_bounded():
    cases = case_index(5)
    assert len(cases) == 5
    assert cases[0]["case_id"] == 1


def test_catalogue_same_inputs_same_outputs():
    a = evaluate_case(300, 65, 2.5)
    b = evaluate_case(300, 65, 2.5)
    assert a == b
