import json
from typing import Callable, Optional

from .LearningProcess import LearningProcess
from .TestGenerator import Factory


class L2l_Parser:
    attr_differences = {}

    def __init__(self, lp_list):
        self.lp_list = lp_list
        pass

    @staticmethod
    def get_json_to_object(data: str, from_dict: Optional[Callable] = None) -> Optional[object]:
        """
        Return object from JSON string.

        :param data: JSON string
        :param from_dict: method on object mapping dictionary to attributes

        :return: Object if success else None
        """
        if not data:
            return None
        try:
            return json.loads(data, object_hook=from_dict)
        except json.decoder.JSONDecodeError:
            return None

    def prepare_test(self):
        plf = Factory()
        test_data = plf.generate_lp()

        items = self.get_json_to_object(test_data)
        items = items.get('lps') or []
        for item_data in items:
            encoded_item = json.dumps(item_data)

            print(encoded_item)
            process = self.get_json_to_object(encoded_item, LearningProcess.from_dict)
            process.process_steps()
            self.lp_list.append(process)
        return json.dumps(str([lp.name for lp in self.lp_list]))

    def parse(self, data):
        process = self.get_json_to_object(data, LearningProcess.from_dict)
        process.process_steps()
        result = self.determine_closest(process, 5)
        self.lp_list.append(process)
        return json.dumps(str([ob.__dict__ for ob in result]))

    def determine_closest(self, current_process: Optional[object], max_limit: int):
        attr_differences = self.get_attr_diff(current_process)
        result = sorted(
                self.lp_list, key=lambda lp: (attr_differences[lp.name], lp.overall_success_rate),
                reverse=True)
        result = [lp for lp in result if lp.user_id != current_process.user_id]
        total = len(result)
        limit = max_limit if max_limit <= total else total

        return result[:limit]

    def get_attr_diff(self, current_process: Optional[object]):
        attr_differences = {}
        for process in self.lp_list:
            v_diff = abs(current_process.visual_value - process.visual_value)
            s_diff = abs(current_process.static_value - process.static_value)
            e_diff = abs(current_process.emotional_value - process.emotional_value)
            i_diff = abs(current_process.interactive_value - process.interactive_value)
            attr_differences[process.name] = -(v_diff + s_diff + e_diff + i_diff)
        return attr_differences
