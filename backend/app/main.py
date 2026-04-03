"""
Binance Futures Testnet Trading Bot - FastAPI Backend
Entry point for the application server.
"""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.logging_config import setup_logging
from app.orders import router as orders_router

# Initialize structured logging before anything else
setup_logging()
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application lifecycle: startup and shutdown events."""
    logger.info("🚀 Binance Futures Testnet Trading Bot starting up...")
    yield
    logger.info("🛑 Trading Bot shutting down.")


app = FastAPI(
    title="Binance Futures Testnet Trading Bot",
    description="REST API for placing MARKET and LIMIT orders on Binance Futures Testnet (USDT-M)",
    version="1.0.0",
    lifespan=lifespan,
)

# Allow React dev server and production builds
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount the orders router
app.include_router(orders_router, prefix="/api", tags=["Orders"])


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Catch-all handler for unexpected server errors."""
    logger.error("Unhandled exception on %s: %s", request.url.path, exc, exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "An unexpected server error occurred. Check logs for details."},
    )


@app.get("/health", tags=["Health"])
async def health_check():
    """Simple liveness probe."""
    return {"status": "ok", "service": "binance-futures-testnet-bot"}
