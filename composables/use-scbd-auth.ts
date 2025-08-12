import type { AuthUser } from '../types/scbd-auth-user';
import { useScbdAuthConfig } from './use-scbd-auth-config';

export function useScbdAuth() {
    const token = useState<string | null>('auth:token')
    const user = useState<AuthUser | null>('auth:user')

    const { loginUrl, logoutUrl, profileUrl } = useScbdAuthConfig();

    return {
        token: computed(() => token.value),
        user: computed(() => user.value),
        isAuthenticated: computed(() => user.value?.isAuthenticated === true),

        login(returnTo: Ref<string> | string | null = null) {
            navigateToAndReturn(loginUrl, returnTo)
        },

        logout(returnTo: Ref<string> | string | null = null) {
            navigateToAndReturn(logoutUrl, returnTo)
        },

        profile(returnTo: Ref<string> | string | null = null) {
            navigateToAndReturn(profileUrl, returnTo)
        },

        hasRole(roleOrRoles: Ref<string[]> | Ref<string> | string[] | string) {

            const testRoles = toValue(roleOrRoles);

            if (!testRoles?.length) return false;

            const roles: string[] = user.value?.roles || [];

            if (typeof testRoles == 'string') {
                return roles.some((r) => r === testRoles);
            }

            return roles.some((r) => testRoles.includes(r));
        },
    }
}

// ===========================
//
// ===========================
function navigateToAndReturn(url: string | Ref<string>, returnTo: Ref<string> | string | null): void {

    returnTo = returnTo || location.href;

    const nextUrl = new URL(toValue(url), location.origin);
    const returnUrl = new URL(toValue(returnTo), location.origin);

    nextUrl.searchParams.set('returnUrl', returnUrl.href);

    navigateTo(nextUrl.href, { external: true });
}