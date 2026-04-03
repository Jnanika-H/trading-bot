/**
 * OrderResult.jsx
 * Displays the structured response from a successfully placed order,
 * or an error state with descriptive messaging.
 */

import React from 'react'

/**
 * A single key-value row in the result table.
 */
function Row({ label, value, valueClass = '' }) {
  return (
    <div className="flex justify-between items-start gap-4 py-2 border-b border-border/50 last:border-0">
      <span className="text-xs font-mono text-text-secondary uppercase tracking-wider whitespace-nowrap">{label}</span>
      <span className={`text-xs font-mono text-right break-all ${valueClass || 'text-text-primary'}`}>{value}</span>
    </div>
  )
}

/**
 * Status badge with colour coding.
 */
function StatusBadge({ status }) {
  const colours = {
    FILLED: 'bg-accent-buy/10 text-accent-buy border-accent-buy/30',
    NEW: 'bg-accent-blue/10 text-accent-blue border-accent-blue/30',
    PARTIALLY_FILLED: 'bg-accent-gold/10 text-accent-gold border-accent-gold/30',
    CANCELLED: 'bg-text-muted/10 text-text-muted border-text-muted/30',
  }
  const cls = colours[status] || 'bg-surface-3 text-text-secondary border-border'
  return (
    <span className={`text-xs font-mono px-2 py-0.5 rounded border ${cls}`}>
      {status}
    </span>
  )
}

/**
 * @param {{ result: object|null, error: string|null }} props
 */
export default function OrderResult({ result, error }) {
  if (!result && !error) return null

  if (error) {
    return (
      <div className="animate-slide-up mt-4 p-4 rounded border border-accent-sell/40 bg-accent-sell/5">
        <div className="flex items-start gap-3">
          <span className="text-accent-sell text-lg mt-0.5">⚠</span>
          <div>
            <p className="text-xs font-mono font-semibold text-accent-sell uppercase tracking-wider mb-1">
              Order Failed
            </p>
            <p className="text-sm text-text-secondary font-sans leading-relaxed">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  const isBuy = result.side === 'BUY'
  const fillPct =
    result.origQty && result.executedQty
      ? ((parseFloat(result.executedQty) / parseFloat(result.origQty)) * 100).toFixed(1)
      : '0'

  return (
    <div
      className={`animate-slide-up mt-4 p-4 rounded border ${
        isBuy ? 'border-accent-buy/40 bg-accent-buy/5' : 'border-accent-sell/40 bg-accent-sell/5'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3 pb-3 border-b border-border/50">
        <div className="flex items-center gap-2">
          <span className={`text-base ${isBuy ? 'text-accent-buy' : 'text-accent-sell'}`}>
            {isBuy ? '↑' : '↓'}
          </span>
          <p className="text-xs font-mono font-semibold text-text-primary uppercase tracking-wider">
            Order Confirmed
          </p>
        </div>
        <StatusBadge status={result.status} />
      </div>

      {/* Details */}
      <div className="space-y-0">
        <Row label="Order ID" value={`#${result.orderId}`} valueClass="text-accent-blue" />
        <Row label="Symbol" value={result.symbol} />
        <Row
          label="Side"
          value={result.side}
          valueClass={isBuy ? 'text-accent-buy font-semibold' : 'text-accent-sell font-semibold'}
        />
        <Row label="Type" value={result.type} />
        <Row label="Qty Requested" value={result.origQty} />
        <Row
          label="Qty Executed"
          value={`${result.executedQty} (${fillPct}%)`}
          valueClass={parseFloat(fillPct) === 100 ? 'text-accent-buy' : 'text-accent-gold'}
        />
        <Row
          label="Avg Price"
          value={
            parseFloat(result.avgPrice) > 0
              ? `$${parseFloat(result.avgPrice).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
              : '—'
          }
        />
        <Row label="Client Order ID" value={result.clientOrderId} valueClass="text-text-muted text-xs" />
      </div>

      {/* Fill bar */}
      <div className="mt-3 pt-3 border-t border-border/50">
        <div className="flex justify-between text-xs font-mono text-text-muted mb-1">
          <span>Fill</span>
          <span>{fillPct}%</span>
        </div>
        <div className="h-1 bg-surface-3 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${isBuy ? 'bg-accent-buy' : 'bg-accent-sell'}`}
            style={{ width: `${fillPct}%` }}
          />
        </div>
      </div>
    </div>
  )
}
