/**
 * StatusBar.jsx
 * Top navigation bar showing the testnet badge, live clock,
 * and backend health indicator.
 */

import React, { useState, useEffect } from 'react'

function useClock() {
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return time
}

function useHealthCheck() {
  const [status, setStatus] = useState('checking') // 'ok' | 'error' | 'checking'

  useEffect(() => {
    async function check() {
      try {
        const res = await fetch('/health')
        setStatus(res.ok ? 'ok' : 'error')
      } catch {
        setStatus('error')
      }
    }
    check()
    const id = setInterval(check, 30_000)
    return () => clearInterval(id)
  }, [])

  return status
}

export default function StatusBar() {
  const time = useClock()
  const health = useHealthCheck()

  const timeStr = time.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
  const dateStr = time.toLocaleDateString([], {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  })

  return (
    <header className="w-full border-b border-border bg-surface-1/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-between">
        {/* Left: brand */}
        <div className="flex items-center gap-3">
          <span className="text-accent-buy font-mono font-bold text-sm tracking-wider">
            ◈ FUTURES BOT
          </span>
          <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded border border-accent-gold/40 bg-accent-gold/10 text-accent-gold uppercase tracking-widest">
            Testnet
          </span>
        </div>

        {/* Right: status indicators */}
        <div className="flex items-center gap-4">
          {/* API health */}
          <div className="flex items-center gap-1.5">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                health === 'ok'
                  ? 'bg-accent-buy shadow-[0_0_6px_rgba(0,200,150,0.8)] animate-pulse-slow'
                  : health === 'error'
                  ? 'bg-accent-sell'
                  : 'bg-text-muted'
              }`}
            />
            <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider hidden sm:inline">
              {health === 'ok' ? 'API Online' : health === 'error' ? 'API Offline' : 'Connecting…'}
            </span>
          </div>

          {/* Clock */}
          <div className="text-right hidden sm:block">
            <p className="text-xs font-mono text-text-secondary tabular-nums">{timeStr}</p>
            <p className="text-[10px] font-mono text-text-muted">{dateStr}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
