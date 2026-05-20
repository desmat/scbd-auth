# SCBD Auth

Everything needed to implement authentication/authorization in a Nuxt project. SSO and classic are available.

## Local build

Make sure to install dependencies:

```bash
# install dependencies
yarn install
# build
yarn build
```

## Setup in a Nuxt project

Add the layer to your project

```ts
// nuxt.config.ts

export default defineNuxtConfig({
  ...
  extends: [
    'github:scbd/auth'
  ],
  ...
})
```

Make sure Auth API URL is available to the environment

```
# .env (for example)

NUXT_PUBLIC_AUTH_API_URL=...
# Optional. When omitted, inactivity invalidation is disabled.
NUXT_PUBLIC_AUTH_INACTIVITY_MINUTES=30
```

Add plugin to initialize

```ts
// app/plugins/scbd-auth.ts

// standard
export default defineNuxtPlugin(scbdAuthSsoPlugin) 

// classic
// export default defineNuxtPlugin(scbdAuthClassicPlugin)
```

Create a login page (example with composition approach)

```html
<!-- app/pages/login.vue -->

<template>
  ...
    <div v-if="!isAuthenticated">
      <!-- standard --> 
      <ScbdAuthSsoLoginForm />

      <!-- classic -->
      <!-- <ScbdAuthClassicLoginForm /> -->
    </div>
    <div v-else>
      ...
      <div>
        You are logged in as {{ user?.name }}
      </div>
      ...
      <CButton @click="logout('/')">
        Logout
      </CButton>
    </div>
  ...
</template>     

<script setup lang="ts">
const { isAuthenticated, logout, user } = useScbdAuthSso() // or useScbdAuthClassic()
...
</script>
```

## Auth token lifetime

The layer can invalidate authenticated sessions after inactivity when `NUXT_PUBLIC_AUTH_INACTIVITY_MINUTES` is configured. When omitted, inactivity invalidation is disabled and only the server-provided token expiration is enforced.

Inactivity is reset only when an authenticated HTTP client reads the token through `getAuthorizationToken()`. Direct `token` reads remain available for compatibility, but should not be used for HTTP authorization injection.

```ts
const { getAuthorizationToken } = useScbdAuthClassic() // or useScbdAuthSso()

const authorizationToken = async () => {
  return await getAuthorizationToken()
}
```

When a token is invalidated, the layer calls `DELETE {authApiUrl}/api/v2013/authentication/token`, clears its auth localStorage keys, and fires the Nuxt hook `scbd-auth:token-invalidated` with `{ reason: 'inactivity' | 'serverExpiration' }`.
