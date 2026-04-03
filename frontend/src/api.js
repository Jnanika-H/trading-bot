/**
 * api.js – centralised API client for the trading bot backend.
 * All fetch calls go through here so base URL and error handling are consistent.
 */

const BASE_URL = '/api'

/**
 * Generic fetch wrapper that throws a structured error on non-2xx responses.
 * @param {string} path  - API path (e.g. '/order')
 * @param {RequestInit} options - fetch options
 * @returns {Promise<any>} Parsed JSON body
 */
async function apiFetch(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })

  const data = await res.json().catch(() => ({ detail: 'Invalid JSON response from server' }))

  if (!res.ok) {
    // FastAPI validation errors come back as { detail: [...] }
    const message =
      typeof data.detail === 'string'
        ? data.detail
        : Array.isArray(data.detail)
        ? data.detail.map((e) => `${e.loc?.slice(-1)[0] ?? 'field'}: ${e.msg}`).join(' | ')
        : 'An unknown error occurred'
    throw new Error(message)
  }

  return data
}

/**
 * Place a futures order.
 * @param {{ symbol, side, orderType, quantity, price? }} payload
 */
export async function placeOrder(payload) {
  return apiFetch('/order', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

/**
 * Fetch open orders for a symbol.
 * @param {string} symbol
 */
export async function getOpenOrders(symbol = 'BTCUSDT') {
  return apiFetch(`/orders?symbol=${encodeURIComponent(symbol)}`)
}
