import type { AuthToken } from '../types/scbd-auth-token'

export async function signIn(authApiUrl: string, email: string, password: string): Promise<AuthToken> {
  const url = `${authApiUrl}/api/v2013/authentication/token`

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })

  if (response.status === 403) {
    throw new Error('Invalid email or password')
  }

  if (!response.ok) {
    throw new Error(`Authentication failed: ${response.status}`)
  }

  const data = await response.json()

  return {
    authenticationToken: `Bearer ${data.authenticationToken}`,
    expiration: new Date(data.expiration)
  }
}
