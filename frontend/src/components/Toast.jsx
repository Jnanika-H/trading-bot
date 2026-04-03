/**
 * Toast.jsx
 * Lightweight toast notification system.
 * Usage: wrap your app in <ToastProvider />, then call useToast() anywhere.
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'

const ToastContext = createContext(null)

let toastId = 0

/**
 * Individual toast item.
 */
function ToastItem({ toast, onDismiss }) {
  useEffect(() => {
    const t = setTimeout(() => onDismiss(toast.id), toast.duration ?? 4000)
    return () => clearTimeout(t)
  }, [toast, onDismiss])

  const styles = {
    success: 'border-accent-buy/40 bg-accent-buy/5 text-accent-buy',
    error:   'border-accent-sell/40 bg-accent-sell/5 text-accent-sell',
    info:    'border-accent-blue/40 bg-accent-blue/5 text-accent-blue',
    warning: 'border-accent-gold/40 bg-accent-gold/5 text-accent-gold',
  }

  const icons = { success: '✓', error: '⚠', info: 'ℹ', warning: '!' }

  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 rounded border font-mono text-xs animate-slide-up shadow-lg max-w-sm w-full ${
        styles[toast.type] ?? styles.info
      }`}
    >
      <span className="mt-0.5 font-bold">{icons[toast.type] ?? 'ℹ'}</span>
      <p className="flex-1 leading-relaxed text-text-primary">{toast.message}</p>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-text-muted hover:text-text-primary transition-colors ml-1 text-base leading-none"
      >
        ×
      </button>
    </div>
  )
}

/**
 * Provider — place at root of your component tree.
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback(({ message, type = 'info', duration = 4000 }) => {
    const id = ++toastId
    setToasts((prev) => [...prev, { id, message, type, duration }])
  }, [])

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      {/* Portal-like container fixed to bottom-right */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-50 pointer-events-none">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem toast={t} onDismiss={dismiss} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

/**
 * Hook to trigger toasts from any child component.
 * @returns {Function} addToast({ message, type, duration })
 */
export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>')
  return ctx
}
