import type { AuthUser } from '../types/scbd-auth-user'
import { getUser } from '../utils/scbd-auth-scheme'

const STORAGE_KEY_TOKEN = 'classic:token'
const STORAGE_KEY_EXPIRATION = 'classic:tokenExpiration'

const Anonymous = (): AuthUser => ({
  userID: 1,
  name: 'anonymous',
  email: '@anonymous',
  isAuthenticated: false,
  isEmailVerified: false,
  roles: []
})

export default defineNuxtPlugin(async (nuxtApp) => {
  const { authMode } = useRuntimeConfig().public

  if (authMode !== 'classic') return

  const token = useState('auth:token', () => ref<string | null>(null))
  const user = useState('auth:user', () => ref<AuthUser | null>(Anonymous()))

  if (nuxtApp.payload.error) return

  const storedToken = localStorage.getItem(STORAGE_KEY_TOKEN)
  const storedExpiration = localStorage.getItem(STORAGE_KEY_EXPIRATION)

  if (!storedToken || !storedExpiration) {
    user.value = Anonymous()
    return
  }

  if (new Date(storedExpiration) <= new Date()) {
    localStorage.removeItem(STORAGE_KEY_TOKEN)
    localStorage.removeItem(STORAGE_KEY_EXPIRATION)
    user.value = Anonymous()
    return
  }

  token.value = storedToken

  try {
    const fetchedUser = await getUser(token)
    user.value = fetchedUser ?? Anonymous()
  } catch {
    localStorage.removeItem(STORAGE_KEY_TOKEN)
    localStorage.removeItem(STORAGE_KEY_EXPIRATION)
    token.value = null
    user.value = Anonymous()
  }
})
