"""
Request and response models for the Orders API.

Uses Pydantic v2 for strict validation with descriptive error messages.
"""

from decimal import Decimal
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field, field_validator, model_validator


# ── Enumerations ───────────────────────────────────────────────────────────────


class OrderSide(str, Enum):
    BUY = "BUY"
    SELL = "SELL"


class OrderType(str, Enum):
    MARKET = "MARKET"
    LIMIT = "LIMIT"


# ── Request model ──────────────────────────────────────────────────────────────


class PlaceOrderRequest(BaseModel):
    """Validated payload for placing a futures order."""

    symbol: str = Field(
        default="BTCUSDT",
        description="Trading pair symbol, e.g. BTCUSDT",
        min_length=2,
        max_length=20,
    )
    side: OrderSide = Field(..., description="BUY or SELL")
    order_type: OrderType = Field(..., alias="orderType", description="MARKET or LIMIT")
    quantity: Decimal = Field(..., gt=0, description="Order quantity (must be positive)")
    price: Optional[Decimal] = Field(
        default=None,
        gt=0,
        description="Limit price (required for LIMIT orders, ignored for MARKET)",
    )

    model_config = {"populate_by_name": True}

    @field_validator("symbol", mode="before")
    @classmethod
    def normalise_symbol(cls, v: str) -> str:
        """Strip whitespace and uppercase the symbol."""
        return v.strip().upper()

    @model_validator(mode="after")
    def price_required_for_limit(self) -> "PlaceOrderRequest":
        """Ensure LIMIT orders always carry a price."""
        if self.order_type == OrderType.LIMIT and self.price is None:
            raise ValueError("Price is required for LIMIT orders.")
        return self


# ── Response models ────────────────────────────────────────────────────────────


class PlaceOrderResponse(BaseModel):
    """Structured response returned after a successful order placement."""

    orderId: int = Field(..., description="Binance order ID")
    symbol: str
    status: str = Field(..., description="Order status from Binance (e.g. FILLED, NEW)")
    side: str
    type: str
    origQty: str = Field(..., description="Original requested quantity")
    executedQty: str = Field(..., description="Quantity actually executed so far")
    avgPrice: str = Field(..., description="Average fill price (0 for unfilled MARKET orders)")
    clientOrderId: str


class ErrorResponse(BaseModel):
    """Standard error payload."""

    detail: str
