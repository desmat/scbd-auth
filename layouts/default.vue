<template>
  <client-only>
    <div style="width: 100vw; height: 10%; padding: 0.5rem; margin: -0.5rem 0 0.5rem -0.5rem; background: lightgrey;">
      <div style="display: flex; flex-direction: row; gap: 1rem;">
        <RouterLink to="/">To index page</RouterLink>
        <RouterLink to="login">To login page</RouterLink>
        <a :href="loginUrl">To scbd loginUrl</a>
        <a :href="logoutUrl">To scbd logoutUrl</a>
        <a :href="profileUrl">To scbd profileUrl</a>
      </div>
    </div>
    <div _style="padding: 0.5rem;">
      <!-- <p>Some default layout content shared across all pages</p> -->
      <slot />
    </div>
  </client-only>
</template>

<script
  setup
  lang="ts"
>
const { loginUrl, logoutUrl, profileUrl } = useScbdAuthConfig();
</script>