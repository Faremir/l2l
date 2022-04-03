import json
import random

import names

ASSIGNMENT_TYPE = 'initial_assignment'
STEP_TYPES = ['searching', 'reading', 'looking', 'listening', 'writing']
ATTR_TYPES = {
    'searching': 'visual',
    'reading':   'visual',
    'writing':   'interactive',
    'listening': 'emotional',
    'looking':   'static',
}
KEYWORDS = [names.get_first_name() for _ in range(100)]
WRITINGS = [
    f"{names.get_first_name()} {names.get_first_name()} {names.get_first_name()} "
    f"{names.get_first_name()}" for _ in range(55)
]


class Serializable:

    def __repr__(self):
        return self.to_json()

    def encode(self):
        return vars(self)

    def to_json(self, indent=None):
        return json.dumps(self, default=lambda o: o.encode(), indent=indent)


class Step(Serializable):
    type = ""
    value = ""
    time = 0
    comment = ""

    def __init__(self):
        self.type = ""
        self.value = ""
        self.time = 0
        self.comment = ""


class Assignment(Serializable):
    name = ""
    success_rate = ""
    steps = []

    def __init__(self):
        self.name = ""
        self.success_rate = ""
        self.steps = []


class LP(Serializable):
    name = ""
    user_id = ""
    visual_value = 0
    static_value = 0
    emotional_value = 0
    interactive_value = 0
    overall_success_rate = 0
    assignments = []

    def __init__(self):
        self.name = ""
        self.user_id = ""
        self.visual_value = 0
        self.static_value = 0
        self.emotional_value = 0
        self.interactive_value = 0
        self.overall_success_rate = 0
        self.assignments = []


class LPList(Serializable):

    def __init__(self, lplist):
        self.lps = lplist


class Factory:

    def generate_step(self):
        step = Step()
        choice_type = random.choice(STEP_TYPES)
        step.type = choice_type
        if choice_type == 'searching':
            step.value = random.choice(KEYWORDS)
        elif choice_type in ('looking', 'listening'):
            step.value = "HTTPS://" + random.choice(KEYWORDS)
        elif choice_type == 'reading':
            step.value = random.randint(1, 10)
        elif choice_type == 'writing':
            step.value = random.choice(KEYWORDS)
        step.time = random.randint(15, 183)
        step.attr_type = ATTR_TYPES[step.type]
        return step

    def generate_steps(self):
        for _ in range(60):
            yield self.generate_step()

    @staticmethod
    def generate_names():
        for _ in range(15):
            yield names.get_full_name()

    def generate_lp(self):
        names_list = list(self.generate_names())
        steps_list = list(self.generate_steps())
        step_id = 1
        for step in steps_list:
            step.id = step_id
            step_id += 1
        lp_list = []
        for i in range(25):
            new = LP()
            new.lp_name = "LP " + str(i)
            user_name = random.choice(names_list)
            new.name = user_name
            new.user_id = names_list.index(user_name)
            new.visual_value = random.randint(0, 4)
            new.static_value = random.randint(0, 4)
            new.emotional_value = random.randint(0, 4)
            new.interactive_value = random.randint(0, 4)
            new.overall_success_rate = random.randint(0, 10) * 10
            assignment = Assignment()
            assignment.name = ASSIGNMENT_TYPE
            assignment.success_rate = new.overall_success_rate
            for n in range(0, random.randint(1, 10)):
                new_step = random.choice(steps_list)
                if not any(step for step in assignment.steps if step.value == new_step.value):
                    assignment.steps.append(new_step)
            new.assignments.append(assignment)
            lp_list.append(new)

        random.shuffle(lp_list)
        lplist = LPList(lp_list)
        return str(lplist)
