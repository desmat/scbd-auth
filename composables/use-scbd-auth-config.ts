import type { AuthConfig } from '../types/scbd-auth-config';

export function useScbdAuthConfig(): AuthConfig {
    const { authApiUrl } = useRuntimeConfig().public;

    return {
        iframeUrl:  computed<string>(()=>`${authApiUrl}/app/authorize.html`),
        loginUrl:   computed<string>(()=>`${authApiUrl}/signin`),
        logoutUrl:  computed<string>(()=>`${authApiUrl}/signout`),
        profileUrl: computed<string>(()=>`${authApiUrl}/profile`),
        currenUserUrl: computed<string>(()=>`${authApiUrl}/api/v2013/authentication/user`),
    }
}