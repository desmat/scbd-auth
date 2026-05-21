export interface AuthConfig {
  authApiUrl: ComputedRef<string>,
  iframeUrl: ComputedRef<string>,
  loginUrl: ComputedRef<string>,
  logoutUrl: ComputedRef<string>,
  profileUrl: ComputedRef<string>,
  currenUserUrl: ComputedRef<string>,
  inactivityMinutes: ComputedRef<number | null>,
}
