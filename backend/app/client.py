"""
Binance Futures Testnet client factory.

Wraps python-binance's AsyncClient configured for the USDT-M Futures Testnet.
Environment variables required:
    BINANCE_TESTNET_API_KEY    – your Testnet API key
    BINANCE_TESTNET_API_SECRET – your Testnet API secret
"""

import logging
import os

from binance import AsyncClient
from binance.exceptions import BinanceAPIException

logger = logging.getLogger(__name__)


def _require_env(name: str) -> str:
    """Return an environment variable or raise a clear error."""
    value = os.getenv(name, "").strip()
    if not value:
        raise EnvironmentError(
            f"Required environment variable '{name}' is not set. "
            "Please configure your .env file."
        )
    return value


async def get_futures_client() -> AsyncClient:
    """
    Create and return an authenticated Binance AsyncClient pointed at the
    Futures Testnet.

    Returns
    -------
    AsyncClient
        A ready-to-use async Binance client.

    Raises
    ------
    EnvironmentError
        If API credentials are missing from environment.
    BinanceAPIException
        If Binance rejects the credentials during initialisation.
    """
    api_key = os.getenv("BINANCE_TESTNET_API_KEY", "demo_key")
    api_secret = os.getenv("BINANCE_TESTNET_API_SECRET", "demo_secret")
    if api_key == "demo_key":
        logger.warning("Using demo API keys. Real Binance connection may fail.")

    logger.debug("Initialising Binance Futures Testnet client…")

    try:
        client = await AsyncClient.create(
            api_key=api_key,
            api_secret=api_secret,
            testnet=True,
        )
    except Exception as e:
        logger.error(f"Failed to create Binance client: {e}")
        raise

    logger.debug("Binance client ready (testnet=True).")
    return client

    client = await AsyncClient.create(
        api_key=api_key,
        api_secret=api_secret,
        testnet=True,
    )

    logger.debug("Binance client ready (testnet=True).")
    return client
