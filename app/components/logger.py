import logging
import os
from datetime import datetime
from logging.handlers import BaseRotatingHandler


class DailyRotatingFileHandler(BaseRotatingHandler):
    """Rotating file handler that rotates the file every day."""

    def __init__(self, dir_name, base_filename, encoding=None):
        """
        :param dir_name: Directory to store monthly folders
        """
        self.dir_name = dir_name  # Directory to store monthly folders
        self.base_filename = base_filename  # Base name for log files
        self.encoding = encoding
        self.current_date = None
        filename = self._get_filename()  # Initial filename
        os.makedirs(os.path.dirname(filename), exist_ok=True)  # Ensure directory exists
        BaseRotatingHandler.__init__(self, filename, 'a', encoding, delay=True)

    def _get_filename(self):
        """Generate a filename based on the current date."""
        now = datetime.now()
        month_dir = now.strftime('%Y-%m')  # Format: YYYY-MM
        date_str = now.strftime('%Y-%m-%d')  # Format: YYYY-MM-DD
        self.current_date = date_str
        filename = f"{self.base_filename}_{date_str}.log"
        full_path = os.path.join(self.dir_name, month_dir, filename)
        return full_path

    def shouldRollover(self, record):  # noqa
        """Determine if we should rollover to a new file."""
        now = datetime.now().strftime('%Y-%m-%d')
        return self.current_date != now  # True if the date has changed

    def doRollover(self):  # noqa
        """Roll over to a new log file."""
        self.stream.close()
        self.baseFilename = self._get_filename()
        self.stream = self._open()


# Create base 'logs' directory if it doesn't exist
base_log_dir = 'logs'
if not os.path.exists(base_log_dir):
    os.makedirs(base_log_dir)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Use the custom handler
handler = DailyRotatingFileHandler(base_log_dir, 'fastapi', encoding='utf-8')
formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')  # noqa
handler.setFormatter(formatter)
logger.addHandler(handler)

# Ensure that logging of each log level gets propagated to the root logger
logger.propagate = True
