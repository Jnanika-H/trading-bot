/**
 * App.jsx
 * Root component. Composes the layout:
 *   ┌─────────────────────────────────────────┐
 *   │              StatusBar                  │
 *   ├───────────────┬─────────────────────────┤
 *   │  OrderForm    │   OrderHistory          │
 *   │  OrderResult  │   (open orders panel)   │
 *   └───────────────┴─────────────────────────┘
 */

import React, { useState, useCallback } from 'react'
import { placeOrder } from './api'
import StatusBar from './components/StatusBar'
import OrderForm from './components/OrderForm'
import OrderResult from './components/OrderResult'
import OrderHistory from './components/OrderHistory'
import { ToastProvider, useToast } from './components/Toast'

/** Inner app — needs to be inside ToastProvider to use useToast */
function TradingApp() {
  const addToast = useToast()

  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [activeSymbol, setActiveSymbol] = useState('BTCUSDT')
  const [historyRefresh, setHistoryRefresh] = useState(0)

  const handlePlaceOrder = useCallback(
    async (payload) => {
      setLoading(true)
      setResult(null)
      setError(null)
      setActiveSymbol(payload.symbol)

      try {
        const data = await placeOrder(payload)
        setResult(data)
        addToast({
          message: `${payload.side} ${payload.orderType} order placed — ID #${data.orderId}`,
          type: 'success',
        })
        // Trigger history refresh after a short delay so Binance state settles
        setTimeout(() => setHistoryRefresh((n) => n + 1), 800)
      } catch (err) {
        setError(err.message)
        addToast({ message: err.message, type: 'error', duration: 6000 })
      } finally {
        setLoading(false)
      }
    },
    [addToast]
  )

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <StatusBar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6">
        {/* Page title */}
        <div className="mb-6">
          <h1 className="text-lg font-mono font-semibold text-text-primary tracking-wide">
            Order Terminal
          </h1>
          <p className="text-xs font-mono text-text-muted mt-1">
            USDT-M Futures · Binance Testnet
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
          {/* ── Left column: form + result ───────────────────────────── */}
          <div className="flex flex-col gap-4">
            {/* Order Form card */}
            <div className="rounded-lg border border-border bg-surface-1 p-5">
              <div className="flex items-center gap-2 mb-5 pb-4 border-b border-border">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-buy animate-pulse-slow" />
                <h2 className="text-xs font-mono font-semibold text-text-primary uppercase tracking-widest">
                  New Order
                </h2>
              </div>
              <OrderForm onSubmit={handlePlaceOrder} loading={loading} />
            </div>

            {/* Result card */}
            {(result || error) && (
              <div className="rounded-lg border border-border bg-surface-1 p-5 animate-fade-in">
                <h2 className="text-xs font-mono font-semibold text-text-primary uppercase tracking-widest mb-1 pb-3 border-b border-border">
                  Last Response
                </h2>
                <OrderResult result={result} error={error} />

                {/* Raw JSON toggle */}
                {result && <RawJson data={result} />}
              </div>
            )}
          </div>

          {/* ── Right column: order history ──────────────────────────── */}
          <div className="rounded-lg border border-border bg-surface-1 p-5 min-h-[400px]">
            <OrderHistory symbol={activeSymbol} refreshTrigger={historyRefresh} />

            {/* Disclaimer */}
            <div className="mt-6 pt-4 border-t border-border">
              <p className="text-[10px] font-mono text-text-muted leading-relaxed">
                ⚠ This terminal operates exclusively on the Binance Futures{' '}
                <span className="text-accent-gold">Testnet</span>. No real funds are at risk.
                All data is simulated.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-4 px-6">
        <p className="text-center text-[10px] font-mono text-text-muted">
          FUTURES BOT · BINANCE TESTNET · BUILD v1.0.0
        </p>
      </footer>
    </div>
  )
}

/**
 * Collapsible raw JSON section shown below the structured result.
 */
function RawJson({ data }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="mt-3">
      <button
        onClick={() => setOpen((o) => !o)}
        className="text-[10px] font-mono text-text-muted hover:text-text-secondary transition-colors uppercase tracking-wider"
      >
        {open ? '▾ Hide' : '▸ Show'} raw JSON
      </button>
      {open && (
        <pre className="mt-2 p-3 rounded bg-surface text-[10px] font-mono text-text-secondary overflow-x-auto border border-border animate-fade-in">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  )
}

export default function App() {
  return (
    <ToastProvider>
      <TradingApp />
    </ToastProvider>
  )
}
