import { AnonymousUser } from '~/data/AnonymousUser'
import type { TokenInvalidationReason } from '../types/scbd-auth'
import type { AuthUser } from '../types/scbd-auth-user'

export const STORAGE_KEY_TOKEN = 'classic:token'
export const STORAGE_KEY_EXPIRATION = 'classic:tokenExpiration'

let inactivityTimer: ReturnType<typeof setTimeout> | null = null
let expirationTimer: ReturnType<typeof setTimeout> | null = null
let invalidating = false

export function useScbdAuthSession() {
  const token = useState<string | null>('auth:token')
  const user = useState<AuthUser | null>('auth:user')
  const tokenExpiration = useState<Date | null>('auth:tokenExpiration')

  const { authApiUrl, inactivityMinutes } = useScbdAuthConfig()
  const nuxtApp = useNuxtApp()

  function clearTimers(): void {
    if (inactivityTimer) clearTimeout(inactivityTimer)
    if (expirationTimer) clearTimeout(expirationTimer)

    inactivityTimer = null
    expirationTimer = null
  }

  function clearAuthStorage(): void {
    if (!import.meta.client) return

    localStorage.removeItem(STORAGE_KEY_TOKEN)
    localStorage.removeItem(STORAGE_KEY_EXPIRATION)
  }

  function clearAuthState(): void {
    token.value = null
    tokenExpiration.value = null
    user.value = AnonymousUser
  }

  async function deleteToken(authenticationToken: string | null): Promise<void> {
    if (!authenticationToken) return

    try {
      const response = await fetch(`${toValue(authApiUrl)}/api/v2013/authentication/token`, {
        method: 'DELETE',
        headers: {
          Authorization: authenticationToken,
        },
      })

      if (!response.ok) {
        console.warn(`Auth token invalidation failed: ${response.status}`)
      }
    } catch (err) {
      console.warn('Auth token invalidation failed', err)
    }
  }

  async function invalidate(reason: TokenInvalidationReason): Promise<void> {
    if (invalidating) return

    invalidating = true

    const authenticationToken = token.value

    clearTimers()
    clearAuthStorage()
    clearAuthState()

    try {
      await deleteToken(authenticationToken)
    } finally {
      try {
        await (nuxtApp as any).callHook('scbd-auth:token-invalidated', { reason })
      } finally {
        invalidating = false
      }
    }
  }

  function resetInactivityTimer(): void {
    if (!import.meta.client || !token.value) return

    if (inactivityTimer) clearTimeout(inactivityTimer)

    inactivityTimer = setTimeout(() => {
      console.log('use-scbd-auth-session resetInactivityTimer setTimeout', { inactivityMinutes: toValue(inactivityMinutes) })
      invalidate('inactivity')
    }, toValue(inactivityMinutes) * 60 * 1000)
  }

  function setServerExpiration(expiration: Date | string | null | undefined): void {
    if (!import.meta.client) return

    if (expirationTimer) clearTimeout(expirationTimer)
    expirationTimer = null

    if (!expiration || !token.value) {
      tokenExpiration.value = null
      return
    }

    const expiresAt = expiration instanceof Date ? expiration : new Date(expiration)

    if (Number.isNaN(expiresAt.getTime())) {
      tokenExpiration.value = null
      return
    }

    tokenExpiration.value = expiresAt

    const timeUntilExpiration = expiresAt.getTime() - Date.now()

    if (timeUntilExpiration <= 0) {
      invalidate('serverExpiration')
      return
    }

    expirationTimer = setTimeout(() => {
      console.log('use-scbd-auth-session setServerExpiration setTimeout', { timeUntilExpiration })

      invalidate('serverExpiration')
    }, timeUntilExpiration)
  }

  function start(expiration: Date | string | null | undefined): void {
    clearTimers()

    if (!import.meta.client || !token.value) return

    setServerExpiration(expiration)
    resetInactivityTimer()
  }

  async function getAuthorizationToken(): Promise<string | null> {
    const authenticationToken = toValue(token)

    if (!authenticationToken) return null

    const expiresAt = tokenExpiration.value

    if (expiresAt && expiresAt.getTime() <= Date.now()) {
      await invalidate('serverExpiration')
      return null
    }

    resetInactivityTimer()

    return authenticationToken
  }

  return {
    tokenExpiration: computed(() => tokenExpiration.value),
    clearTimers,
    getAuthorizationToken,
    invalidate,
    resetInactivityTimer,
    start,
  }
}
