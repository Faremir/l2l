"""Module for Magento Currency object mapping."""
__version__ = "1.0"

from .DecodedJSONObj import JsonDecObj


class LearningProcess(JsonDecObj):
    """Representation of Magento Currency."""

    def prepare_data(self):
        """Prepare data for res.currency record."""
        return {}


class LearningProcesses(JsonDecObj):
    """Representation of Magento Currency."""

    def prepare_data(self):
        """Prepare data for res.currency record."""
        return {}