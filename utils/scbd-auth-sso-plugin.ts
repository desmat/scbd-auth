import type { NuxtApp } from "#app";
import { AnonymousUser } from "~/data/AnonymousUser";
import type { AuthUser } from "../types/scbd-auth-user";
import { useScbdAuthSession } from "../composables/use-scbd-auth-session";

import { initAuhtIFrame, getToken, getUser } from "./scbd-auth-scheme";

const defineNuxtPlugin = async (nuxtApp: NuxtApp) => {  
  const token = useState('auth:token', ()=>ref<string|null>(null))
  const user  = useState('auth:user',  ()=>ref<AuthUser|null>(AnonymousUser))
  const session = useScbdAuthSession()

  // Skip plugin when rendering error page
  if (nuxtApp.payload.error) {
    return;
  }

  const frame = await initAuhtIFrame();

  const authToken = await getToken(frame);

  token.value = authToken?.authenticationToken || null;
  session.start(authToken?.expiration);
  user .value = await getUser(token);
};

export const scbdAuthSsoPlugin = async (nuxtApp: any) => {
  addRouteMiddleware("auth", scbdAuthMiddleware(useScbdAuthSso), { global: true });
  return defineNuxtPlugin(nuxtApp);
};
