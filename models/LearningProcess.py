"""Module for Magento Currency object mapping."""
__version__ = "1.0"

import math

from .DecodedJSONObj import JsonDecObj


class LearningProcess(JsonDecObj):
    """Representation of Magento Currency."""

    def process_steps(self):
        types = ['static_value', 'visual_value', 'emotional_value', 'interactive_value']

        print(
            "ORIG:", self.static_value, self.visual_value, self.emotional_value,
            self.interactive_value)
        for assignment in self.assignments:
            total = len(assignment.steps)
            for attrtype in types:
                attr_sum = sum(steps.attr_type == attrtype for steps in assignment.steps)
                bonus = 0
                if attr_sum and total:
                    bonus = math.ceil(
                            (attr_sum / total) * 5 * (self.overall_success_rate / 100))
                current = getattr(self, attrtype, 0)
                setattr(self, attrtype, current + bonus)
        print(
            "NEW:", self.static_value, self.visual_value, self.emotional_value,
            self.interactive_value)
