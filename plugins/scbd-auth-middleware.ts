import type { RouteLocation } from "vue-router";

export default defineNuxtPlugin(async (nuxtApp) => {
  addRouteMiddleware("auth", (to: RouteLocation) => {
    const { isAuthenticated, hasRole, login } = useScbdAuth();
    const skipLoginPage = useCookie('skip-login-page');

    const isLoggedIn = toValue(isAuthenticated);
    const auth = toValue(to.meta.auth) as boolean | string | null | undefined;
    const roles = toValue(to.meta.roles) as string[];

    if (auth === false) { // any auth state. need then => ok
      return true;
    }

    if (auth === "guest") { // only guest (non-authenticated)
      return !isLoggedIn;
    }

    if (auth === true || auth === undefined || auth === null) { //
      if (!isLoggedIn) {
        if (skipLoginPage.value) {
          return login(to.fullPath);
        }
        else {
          return navigateTo({ name: 'login', query: { returnUrl: to.fullPath } }, {})
        }
      }

      if (roles && roles.length) // if a roles is required
        return roles.includes(Authenticated) || hasRole(roles);

      return true;
    }

    return false; //default to false!
  }, { global: true });
});
