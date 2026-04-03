"""
Logging configuration for the Trading Bot backend.
Outputs structured logs to both console and a rotating file.
"""

import logging
import logging.handlers
import os
from pathlib import Path


def setup_logging() -> None:
    """
    Configure application-wide logging.

    - Console handler: INFO level with color-friendly format.
    - File handler: DEBUG level with full detail, rotates at 10 MB, keeps 5 backups.
    - Log directory is created automatically if it doesn't exist.
    """
    log_dir = Path("logs")
    log_dir.mkdir(exist_ok=True)

    log_format = (
        "%(asctime)s | %(levelname)-8s | %(name)s:%(lineno)d | %(message)s"
    )
    date_format = "%Y-%m-%d %H:%M:%S"

    root_logger = logging.getLogger()
    root_logger.setLevel(logging.DEBUG)

    # ── Console handler ────────────────────────────────────────────────────────
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.INFO)
    console_handler.setFormatter(logging.Formatter(log_format, datefmt=date_format))

    # ── Rotating file handler ──────────────────────────────────────────────────
    file_handler = logging.handlers.RotatingFileHandler(
        filename=log_dir / "app.log",
        maxBytes=10 * 1024 * 1024,  # 10 MB
        backupCount=5,
        encoding="utf-8",
    )
    file_handler.setLevel(logging.DEBUG)
    file_handler.setFormatter(logging.Formatter(log_format, datefmt=date_format))

    # Avoid adding duplicate handlers on hot-reload
    if not root_logger.handlers:
        root_logger.addHandler(console_handler)
        root_logger.addHandler(file_handler)

    # Silence noisy third-party loggers
    logging.getLogger("urllib3").setLevel(logging.WARNING)
    logging.getLogger("httpx").setLevel(logging.WARNING)
