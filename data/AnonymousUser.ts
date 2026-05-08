import type { AuthUser } from "~/types/scbd-auth-user";

export const AnonymousUser: AuthUser = {
  userID: 1,
  name: "anonymous",
  email: "@anonymous",
  isAuthenticated: false,
  isEmailVerified: false,
  roles: []
};
