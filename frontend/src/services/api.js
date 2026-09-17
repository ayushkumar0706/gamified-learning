const configuredBaseUrl = import.meta.env.VITE_BASE_URL

if (!configuredBaseUrl) {
  throw new Error('VITE_BASE_URL is not configured. Set it in the frontend deployment environment and rebuild.')
}

const BASE_URL = `${configuredBaseUrl.replace(/\/$/, '').replace(/\/api$/, '')}/api`

async function request(endpoint, options = {}) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    if (data?.errors?.length) {
      throw new Error(data.errors.map((e) => e.msg).join(', '))
    }
    
    throw new Error(data?.message || 'Something went wrong')
  }

  return data
}

export const api = {
  get: (endpoint) => request(endpoint),
  post: (endpoint, body) => request(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint, body) => request(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (endpoint) => request(endpoint, { method: 'DELETE' }),
}