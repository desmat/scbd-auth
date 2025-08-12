import type { AuthToken } from "../types/scbd-auth-token";
import type { AuthUser } from "../types/scbd-auth-user";

import { initAuhtIFrame, getToken, getUser } from "../utils/scbd-auth-scheme";

const Anonymous = ():AuthUser => ({
    userID: 1,
    name: "anonymous",
    email: "@anonymous",
    isAuthenticated: false,
    isEmailVerified: false,
    roles: []
});

export default defineNuxtPlugin(async (nuxtApp) => {
  
  const token = useState('auth:token', ()=>ref<string|null>(null))
  const user  = useState('auth:user',  ()=>ref<AuthUser|null>(toValue(Anonymous)))

  // Skip plugin when rendering error page
  if (nuxtApp.payload.error) {
    return;
  }

  const frame = await initAuhtIFrame();

  token.value = (await getToken(frame))?.authenticationToken || null;
  user .value = await getUser(token);
});

