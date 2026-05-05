import type { AuthUser } from './scbd-auth-user'

export interface IScbdAuth {
  token: ComputedRef<string | null>
  user: ComputedRef<AuthUser | null>
  isAuthenticated: ComputedRef<boolean>
  login(returnTo?: Ref<string> | string | null): void
  logout(returnTo?: Ref<string> | string | null): void
  profile(returnTo?: Ref<string> | string | null): void
  hasRole(roleOrRoles: Ref<string[]> | Ref<string> | string[] | string): boolean
}
