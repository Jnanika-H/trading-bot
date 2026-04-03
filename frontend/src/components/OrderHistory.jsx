/**
 * OrderHistory.jsx
 * Fetches and displays open orders for a given symbol from the backend.
 * Supports manual refresh.
 */

import React, { useState, useEffect, useCallback } from 'react'
import { getOpenOrders } from '../api'

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <span className="text-3xl mb-3 opacity-30">📋</span>
      <p className="text-xs font-mono text-text-muted uppercase tracking-wider">No open orders</p>
    </div>
  )
}

function OrderRow({ order }) {
  const isBuy = order.side === 'BUY'
  const fillPct =
    order.origQty && order.executedQty
      ? ((parseFloat(order.executedQty) / parseFloat(order.origQty)) * 100).toFixed(1)
      : '0'

  return (
    <div className="p-3 rounded border border-border bg-surface-1 hover:border-border-light transition-colors duration-150">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded ${
              isBuy ? 'bg-accent-buy/10 text-accent-buy' : 'bg-accent-sell/10 text-accent-sell'
            }`}
          >
            {isBuy ? '↑' : '↓'} {order.side}
          </span>
          <span className="text-xs font-mono text-text-secondary">{order.type}</span>
        </div>
        <span className="text-xs font-mono text-accent-blue">#{order.orderId}</span>
      </div>
      <div className="grid grid-cols-3 gap-2 text-xs font-mono">
        <div>
          <p className="text-text-muted uppercase text-[10px] tracking-wider">Qty</p>
          <p className="text-text-primary mt-0.5">{order.origQty}</p>
        </div>
        <div>
          <p className="text-text-muted uppercase text-[10px] tracking-wider">Price</p>
          <p className="text-text-primary mt-0.5">
            {parseFloat(order.price) > 0 ? `$${parseFloat(order.price).toLocaleString()}` : 'MKT'}
          </p>
        </div>
        <div>
          <p className="text-text-muted uppercase text-[10px] tracking-wider">Filled</p>
          <p className={`mt-0.5 ${parseFloat(fillPct) > 0 ? 'text-accent-gold' : 'text-text-primary'}`}>
            {fillPct}%
          </p>
        </div>
      </div>
      {/* Mini fill bar */}
      <div className="mt-2 h-0.5 bg-surface-3 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${isBuy ? 'bg-accent-buy' : 'bg-accent-sell'}`}
          style={{ width: `${fillPct}%` }}
        />
      </div>
    </div>
  )
}

/**
 * @param {{ symbol: string, refreshTrigger: number }} props
 */
export default function OrderHistory({ symbol, refreshTrigger }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getOpenOrders(symbol)
      setOrders(data)
      setLastUpdated(new Date())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [symbol])

  // Fetch on mount and whenever a new order is placed
  useEffect(() => {
    fetchOrders()
  }, [fetchOrders, refreshTrigger])

  const timeStr = lastUpdated
    ? lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : null

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xs font-mono font-semibold text-text-primary uppercase tracking-widest">
            Open Orders
          </h2>
          {timeStr && (
            <p className="text-[10px] font-mono text-text-muted mt-0.5">Updated {timeStr}</p>
          )}
        </div>
        <button
          onClick={fetchOrders}
          disabled={loading}
          title="Refresh orders"
          className="p-1.5 rounded border border-border text-text-muted hover:border-border-light hover:text-text-primary transition-all duration-150 disabled:opacity-40"
        >
          <svg
            className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 4v5h.582M20 20v-5h-.581M4.582 9A8 8 0 0120 15M19.418 15A8 8 0 014 9"
            />
          </svg>
        </button>
      </div>

      {/* Content */}
      {error ? (
        <div className="p-3 rounded border border-accent-sell/30 bg-accent-sell/5">
          <p className="text-xs font-mono text-accent-sell">{error}</p>
        </div>
      ) : loading && orders.length === 0 ? (
        <div className="flex items-center justify-center py-10">
          <svg className="animate-spin h-5 w-5 text-text-muted" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      ) : orders.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="flex flex-col gap-2 overflow-y-auto">
          {orders.map((order) => (
            <OrderRow key={order.orderId} order={order} />
          ))}
        </div>
      )}
    </div>
  )
}
