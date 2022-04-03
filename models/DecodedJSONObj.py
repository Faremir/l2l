"""
Decoded JSON object.

Providing generic functionality for transforming and mapping json data to python objects.
"""
__version__ = "1.0"

from abc import ABC, abstractmethod
from typing import Optional


class JsonDecObj(ABC):
    """Abstract JSON object."""

    @classmethod
    def from_dict(cls, entries: Optional[dict]):
        """
        Create instance from dictionary and map it to class attributes.

        :param entries: Dictionary data

        :return: Instance of current class
        """
        obj = cls()
        if entries and isinstance(entries, dict):
            obj.__dict__.update(entries)
        return obj

    def update(self, **entries) -> None:
        """
        Update current instance attributes with **kwargs.

        :param entries: New/Updated instance attributes.

        :return: None
        """
        self.__dict__.update(entries)

    def flatten_list(self, attr_name, key_name) -> None:
        """
        Flatten list of JsonDecObj to list of values.

        List format: [JsonDecObj(key_name: value), ...]
        Output format: list(value)

        :param attr_name: Current instance attribute containing list of JsonDecObjs
        :param key_name: Name of attribute containing output dictionary key
        :param value_name: Name of attribute containing output dictionary value

        :return: None
        """
        temp_attr = [getattr(attr, key_name) for attr in getattr(self, attr_name, JsonDecObj)]
        setattr(self, attr_name, temp_attr)

    def __getattr__(self, name):
        """Override without exceptions."""
        try:
            return super(JsonDecObj, self).__getattr__(self, name)
        except AttributeError:
            return None

    def __repr__(self):
        return str(self.__dict__)

