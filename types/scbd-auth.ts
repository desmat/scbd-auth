import type { AuthUser } from './scbd-auth-user'

export type TokenInvalidationReason = 'inactivity' | 'serverExpiration'

export interface TokenInvalidationPayload {
  reason: TokenInvalidationReason
}

export interface IScbdAuth {
  token: ComputedRef<string | null>
  user: ComputedRef<AuthUser | null>
  isAuthenticated: ComputedRef<boolean>
  getAuthorizationToken(): Promise<string | null>
  login(returnTo?: Ref<string> | string | null): void
  logout(returnTo?: Ref<string> | string | null): void
  profile(returnTo?: Ref<string> | string | null): void
  hasRole(roleOrRoles: Ref<string[]> | Ref<string> | string[] | string): boolean
}
