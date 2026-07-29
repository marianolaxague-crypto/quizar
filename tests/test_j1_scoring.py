import unittest

from backend.scoring import load_quiz_data, score_brujula


def responses_for_axis_sign(sign_by_axis):
    data = load_quiz_data("j1")
    responses = {}
    for question in data["questions"]:
        weights = question["weights"]
        chosen_axis = next((axis for axis, weight in weights.items() if weight != 0), None)
        if chosen_axis is None:
            continue

        desired_sign = sign_by_axis.get(chosen_axis)
        weight = weights[chosen_axis]
        if desired_sign == "positive":
            choose_a = weight > 0
        elif desired_sign == "negative":
            choose_a = weight < 0
        else:
            continue

        if choose_a:
            responses[question["id"]] = {"value": 1, "a_is_left": True}
        else:
            responses[question["id"]] = {"value": 4, "a_is_left": True}
    return responses


class J1ScoringExtremeTests(unittest.TestCase):
    def test_j1_metadata_matches_question_bank(self):
        data = load_quiz_data("j1")

        self.assertEqual(data["version"], "6.1")
        self.assertEqual(data["total_questions"], len(data["questions"]))
        self.assertEqual(data["total_questions"], 19)

    def test_institutionalist_answers_map_to_negative_inst(self):
        result = score_brujula(
            responses_for_axis_sign({"econ": "positive", "social": "positive", "inst": "negative"})
        )

        self.assertLess(result["inst"], -15)
        self.assertFalse(result["archetype_data"]["anti_establishment"])
        self.assertIn("Institucionalista", result["archetype_data"]["subtitle"])

    def test_anti_establishment_answers_map_to_positive_inst(self):
        result = score_brujula(
            responses_for_axis_sign({"econ": "positive", "social": "positive", "inst": "positive"})
        )

        self.assertGreater(result["inst"], 15)
        self.assertTrue(result["archetype_data"]["anti_establishment"])
        self.assertIn("Anti-establishment", result["archetype_data"]["subtitle"])

    def test_expected_quadrants_from_clear_extremes(self):
        cases = [
            ({"econ": "positive", "social": "positive", "inst": "negative"}, "PC"),
            ({"econ": "positive", "social": "negative", "inst": "negative"}, "PP"),
            ({"econ": "negative", "social": "positive", "inst": "negative"}, "EC"),
            ({"econ": "negative", "social": "negative", "inst": "negative"}, "EP"),
        ]

        for poles, expected_profile in cases:
            with self.subTest(poles=poles):
                result = score_brujula(responses_for_axis_sign(poles))
                self.assertEqual(result["profile"], expected_profile)


if __name__ == "__main__":
    unittest.main()
