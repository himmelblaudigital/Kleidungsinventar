// Basis-URL der PHP/MySQL-API. In Produktion i.d.R. leer lassen (gleicher Origin,
// API unter /api/... auf demselben Server). Für abweichende Deployments kann
// VITE_API_URL gesetzt werden (z.B. "https://api.deine-domain.de").
const API_BASE = import.meta.env.VITE_API_URL || ''

async function parseResponse(response) {
  const text = await response.text()
  let data = null
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    // Antwort war kein JSON (z.B. Server-Fehlerseite)
  }

  if (!response.ok) {
    const message = data?.error || `Anfrage fehlgeschlagen (${response.status})`
    throw new Error(message)
  }

  return data
}

export async function apiRequest(path, { method = 'GET', body, isFormData = false } = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    credentials: 'include',
    headers: isFormData ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : (isFormData ? body : JSON.stringify(body)),
  })

  return parseResponse(response)
}
