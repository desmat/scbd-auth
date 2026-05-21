import { AnonymousUser } from '~/data/AnonymousUser';
import type { AuthUser } from '../types/scbd-auth-user'
import { getUser } from './scbd-auth-scheme'
import { STORAGE_KEY_EXPIRATION, STORAGE_KEY_TOKEN, useScbdAuthSession } from '../composables/use-scbd-auth-session'

const defineNuxtPlugin = async (nuxtApp: any) => {
  const token = useState('auth:token', () => ref<string | null>(null))
  const user = useState('auth:user', () => ref<AuthUser | null>(AnonymousUser))
  const session = useScbdAuthSession()

  if (nuxtApp.payload.error) return

  const storedToken = localStorage.getItem(STORAGE_KEY_TOKEN)
  const storedExpiration = localStorage.getItem(STORAGE_KEY_EXPIRATION)

  if (!storedToken || !storedExpiration) {
    session.clearTimers()
    user.value = AnonymousUser
    return
  }

  if (new Date(storedExpiration) <= new Date()) {
    token.value = storedToken
    await session.invalidate('serverExpiration')
    return
  }

  token.value = storedToken

  try {
    session.start(storedExpiration)
    const fetchedUser = await getUser(token)
    user.value = fetchedUser ?? AnonymousUser
  } catch {
    localStorage.removeItem(STORAGE_KEY_TOKEN)
    localStorage.removeItem(STORAGE_KEY_EXPIRATION)
    token.value = null
    user.value = AnonymousUser
    session.clearTimers()
  }
};

export const scbdAuthClassicPlugin = async (nuxtApp: any) => {
  addRouteMiddleware("auth", scbdAuthMiddleware(useScbdAuthClassic), { global: true });
  return defineNuxtPlugin(nuxtApp);
};
