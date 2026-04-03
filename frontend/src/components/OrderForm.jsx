/**
 * OrderForm.jsx
 * The primary order entry form. Handles validation, loading state,
 * and delegates submission to the parent via onSubmit prop.
 */

import React, { useState } from 'react'

const SYMBOLS = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT']

const defaultForm = {
  symbol: 'BTCUSDT',
  side: 'BUY',
  orderType: 'MARKET',
  quantity: '',
  price: '',
}

/**
 * @param {{ onSubmit: Function, loading: boolean }} props
 */
export default function OrderForm({ onSubmit, loading }) {
  const [form, setForm] = useState(defaultForm)
  const [errors, setErrors] = useState({})

  const isLimit = form.orderType === 'LIMIT'
  const isBuy = form.side === 'BUY'

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  function validate() {
    const errs = {}
    if (!form.symbol.trim()) errs.symbol = 'Symbol is required.'
    const qty = parseFloat(form.quantity)
    if (!form.quantity || isNaN(qty) || qty <= 0) errs.quantity = 'Quantity must be a positive number.'
    if (isLimit) {
      const price = parseFloat(form.price)
      if (!form.price || isNaN(price) || price <= 0) errs.price = 'Price must be a positive number for LIMIT orders.'
    }
    return errs
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }

    const payload = {
      symbol: form.symbol.trim().toUpperCase(),
      side: form.side,
      orderType: form.orderType,
      quantity: parseFloat(form.quantity),
      ...(isLimit && { price: parseFloat(form.price) }),
    }

    onSubmit(payload)
  }

  const accentColor = isBuy ? 'accent-buy' : 'accent-sell'
  const glowClass = isBuy ? 'glow-buy' : 'glow-sell'
  const borderClass = isBuy ? 'glow-border-buy' : 'glow-border-sell'

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {/* Symbol */}
      <div>
        <label className="block text-xs font-mono text-text-secondary uppercase tracking-widest mb-2">
          Symbol
        </label>
        <div className="flex gap-2 flex-wrap">
          {SYMBOLS.map((sym) => (
            <button
              key={sym}
              type="button"
              onClick={() => setForm((p) => ({ ...p, symbol: sym }))}
              className={`font-mono text-xs px-3 py-1.5 rounded border transition-all duration-150 ${
                form.symbol === sym
                  ? 'border-accent-blue bg-accent-blue/10 text-accent-blue'
                  : 'border-border text-text-secondary hover:border-border-light hover:text-text-primary'
              }`}
            >
              {sym}
            </button>
          ))}
        </div>
        <input
          type="text"
          name="symbol"
          value={form.symbol}
          onChange={handleChange}
          placeholder="Custom symbol…"
          className={`mt-2 w-full bg-surface-2 border rounded px-3 py-2 font-mono text-sm text-text-primary placeholder-text-muted outline-none transition-colors ${
            errors.symbol ? 'border-accent-sell' : 'border-border focus:border-accent-blue'
          }`}
        />
        {errors.symbol && <p className="text-accent-sell text-xs mt-1 font-mono">{errors.symbol}</p>}
      </div>

      {/* Side */}
      <div>
        <label className="block text-xs font-mono text-text-secondary uppercase tracking-widest mb-2">
          Side
        </label>
        <div className="grid grid-cols-2 gap-2">
          {['BUY', 'SELL'].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setForm((p) => ({ ...p, side: s }))}
              className={`py-3 rounded font-mono font-semibold text-sm tracking-wider transition-all duration-200 border ${
                form.side === s
                  ? s === 'BUY'
                    ? 'bg-accent-buy/20 border-accent-buy text-accent-buy shadow-[0_0_16px_rgba(0,200,150,0.2)]'
                    : 'bg-accent-sell/20 border-accent-sell text-accent-sell shadow-[0_0_16px_rgba(240,62,62,0.2)]'
                  : 'bg-surface-2 border-border text-text-secondary hover:border-border-light'
              }`}
            >
              {s === 'BUY' ? '↑ BUY' : '↓ SELL'}
            </button>
          ))}
        </div>
      </div>

      {/* Order Type */}
      <div>
        <label className="block text-xs font-mono text-text-secondary uppercase tracking-widest mb-2">
          Order Type
        </label>
        <div className="grid grid-cols-2 gap-2">
          {['MARKET', 'LIMIT'].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setForm((p) => ({ ...p, orderType: t, price: '' }))}
              className={`py-2.5 rounded font-mono text-sm tracking-wider transition-all duration-150 border ${
                form.orderType === t
                  ? 'bg-accent-blue/10 border-accent-blue text-accent-blue'
                  : 'bg-surface-2 border-border text-text-secondary hover:border-border-light'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity */}
      <div>
        <label className="block text-xs font-mono text-text-secondary uppercase tracking-widest mb-2">
          Quantity
        </label>
        <div className="relative">
          <input
            type="number"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            placeholder="0.001"
            step="any"
            min="0"
            className={`w-full bg-surface-2 border rounded px-3 py-2.5 font-mono text-sm text-text-primary placeholder-text-muted outline-none transition-colors pr-16 ${
              errors.quantity ? 'border-accent-sell' : 'border-border focus:border-accent-blue'
            }`}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-text-muted">
            {form.symbol.replace('USDT', '')}
          </span>
        </div>
        {errors.quantity && <p className="text-accent-sell text-xs mt-1 font-mono">{errors.quantity}</p>}
      </div>

      {/* Price (LIMIT only) */}
      {isLimit && (
        <div className="animate-fade-in">
          <label className="block text-xs font-mono text-text-secondary uppercase tracking-widest mb-2">
            Limit Price
          </label>
          <div className="relative">
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="0.00"
              step="any"
              min="0"
              className={`w-full bg-surface-2 border rounded px-3 py-2.5 font-mono text-sm text-text-primary placeholder-text-muted outline-none transition-colors pr-16 ${
                errors.price ? 'border-accent-sell' : 'border-border focus:border-accent-blue'
              }`}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-text-muted">
              USDT
            </span>
          </div>
          {errors.price && <p className="text-accent-sell text-xs mt-1 font-mono">{errors.price}</p>}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className={`mt-2 w-full py-3.5 rounded font-mono font-semibold text-sm tracking-widest transition-all duration-200 border relative overflow-hidden ${
          loading
            ? 'bg-surface-2 border-border text-text-muted cursor-not-allowed'
            : isBuy
            ? 'bg-accent-buy/20 border-accent-buy text-accent-buy hover:bg-accent-buy/30 shadow-[0_0_20px_rgba(0,200,150,0.2)] hover:shadow-[0_0_28px_rgba(0,200,150,0.35)]'
            : 'bg-accent-sell/20 border-accent-sell text-accent-sell hover:bg-accent-sell/30 shadow-[0_0_20px_rgba(240,62,62,0.2)] hover:shadow-[0_0_28px_rgba(240,62,62,0.35)]'
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            PLACING ORDER…
          </span>
        ) : (
          `PLACE ${form.side} ${form.orderType}`
        )}
      </button>
    </form>
  )
}
