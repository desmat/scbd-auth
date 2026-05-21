import type { AuthConfig } from '../types/scbd-auth-config';

export function useScbdAuthConfig(): AuthConfig {
    const { authApiUrl, authInactivityMinutes } = useRuntimeConfig().public;
    const authApiBaseUrl = computed<string>(()=>String(authApiUrl || ''));

    return {
        authApiUrl: authApiBaseUrl,
        iframeUrl:  computed<string>(()=>`${authApiBaseUrl.value}/app/authorize.html`),
        loginUrl:   computed<string>(()=>`${authApiBaseUrl.value}/signin`),
        logoutUrl:  computed<string>(()=>`${authApiBaseUrl.value}/signout`),
        profileUrl: computed<string>(()=>`${authApiBaseUrl.value}/profile`),
        currenUserUrl: computed<string>(()=>`${authApiBaseUrl.value}/api/v2013/authentication/user`),
        inactivityMinutes: computed<number|null>(()=>{
            const parsedInactivityMinutes = Number(authInactivityMinutes);
            return parsedInactivityMinutes > 0 ? parsedInactivityMinutes : null;
        }),
    }
}
