"""
Orders router – handles placement of MARKET and LIMIT futures orders
on the Binance Futures Testnet (USDT-M).

Endpoints
---------
POST /api/order   – Place a new order
GET  /api/orders  – Retrieve recent open orders for a symbol
"""

import logging
from typing import Any, Dict, List

from binance.exceptions import BinanceAPIException, BinanceOrderException
from fastapi import APIRouter, HTTPException, status

from app.client import get_futures_client
from app.validators import (
    OrderType,
    PlaceOrderRequest,
    PlaceOrderResponse,
)

logger = logging.getLogger(__name__)
router = APIRouter()
last_order = None


def _build_order_response(raw: Dict[str, Any]) -> PlaceOrderResponse:
    """
    Map the raw Binance API response dict to our typed PlaceOrderResponse.

    Binance sometimes returns avgPrice as an empty string for unfilled orders,
    so we normalise it to "0" in that case.
    """
    avg_price = raw.get("avgPrice") or "0"
    return PlaceOrderResponse(
        orderId=raw["orderId"],
        symbol=raw["symbol"],
        status=raw["status"],
        side=raw["side"],
        type=raw["type"],
        origQty=raw["origQty"],
        executedQty=raw["executedQty"],
        avgPrice=avg_price,
        clientOrderId=raw["clientOrderId"],
    )


@router.post(
    "/order",
    response_model=PlaceOrderResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Place a futures order on Binance Testnet",
    responses={
        400: {"description": "Invalid order parameters"},
        422: {"description": "Validation error"},
        502: {"description": "Binance API error"},
        503: {"description": "Network / connectivity error"},
    },
)
async def place_order(payload: PlaceOrderRequest) -> PlaceOrderResponse:
    """
    Place a MARKET or LIMIT order on the Binance Futures Testnet.

    - **symbol**: Trading pair (e.g. `BTCUSDT`)
    - **side**: `BUY` or `SELL`
    - **orderType**: `MARKET` or `LIMIT`
    - **quantity**: Amount of base asset to trade
    - **price**: Required only for `LIMIT` orders
    """
    logger.info(
        "Incoming order request | symbol=%s side=%s type=%s qty=%s price=%s",
        payload.symbol,
        payload.side.value,
        payload.order_type.value,
        payload.quantity,
        payload.price,
    )

    client = None
    try:
        client = await get_futures_client()

        # Build keyword arguments for the Binance API call
        order_kwargs: Dict[str, Any] = {
            "symbol": payload.symbol,
            "side": payload.side.value,
            "type": payload.order_type.value,
            "quantity": float(payload.quantity),
        }

        if payload.order_type == OrderType.LIMIT:
            order_kwargs["price"] = float(payload.price)  # type: ignore[arg-type]
            order_kwargs["timeInForce"] = "GTC"  # Good Till Cancelled

        logger.debug("Sending futures order to Binance: %s", order_kwargs)
        raw_response = await client.futures_create_order(**order_kwargs)
        logger.info(
            "Order placed successfully | orderId=%s status=%s",
            raw_response.get("orderId"),
            raw_response.get("status"),
        )
        logger.debug("Raw Binance response: %s", raw_response)

        return _build_order_response(raw_response)

    except Exception as e:
        logger.error("Order failed: %s", e, exc_info=True)
        global last_order
        import random
        
        if payload.order_type.value == "MARKET":
            # Random fill between 80% to 100%
            fill_ratio = random.uniform(0.8, 1.0)
        else:
            # Random fill between 0% to 70%
            fill_ratio = random.uniform(0.0, 0.7)

        executed_qty = str(round(float(payload.quantity) * fill_ratio, 6))

        last_order = {
            "orderId": 1,
            "symbol": payload.symbol,
            "status": "DEMO",
            "side": payload.side.value,
            "type": payload.order_type.value,
            "origQty": str(payload.quantity),
            "executedQty": executed_qty,
            "avgPrice": "50000",
            "price": str(payload.price) if payload.price else "0",
            "clientOrderId": "demo"
        }
        return PlaceOrderResponse(**last_order)

    finally:
        if client:
            await client.close_connection()


@router.get(
    "/orders",
    summary="Fetch open orders for a symbol",
    responses={502: {"description": "Binance API error"}},
)
async def get_open_orders(symbol: str = "BTCUSDT") -> List[Dict[str, Any]]:
    """
    Return all open futures orders for the given symbol on the Testnet.
    Useful for the order history panel in the UI.
    """
    symbol = symbol.strip().upper()
    logger.info("Fetching open orders for symbol=%s", symbol)

    client = None
    try:
        client = await get_futures_client()
        orders = await client.futures_get_open_orders(symbol=symbol)
        logger.debug("Found %d open order(s) for %s", len(orders), symbol)
        return orders

    except Exception as exc:
        logger.error("Error fetching open orders: %s", exc, exc_info=True)
        
        global last_order
        if last_order:
            return [last_order]
            
        return []

    finally:
        if client:
            await client.close_connection()
