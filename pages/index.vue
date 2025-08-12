<template>
  <div style="padding: 1rem; text-align: center">
    <h1>index page</h1>
    <h2>auth required</h2>
    
    <div style="display: flex; flex-direction: row; gap: 1rem; justify-content: center;">
      <RouterLink to="/">index page</RouterLink>
      <RouterLink to="login">login page</RouterLink>
      <a :href="loginUrl">scbd loginUrl</a>
      <a :href="logoutUrl">scbd logoutUrl</a>
      <a :href="profileUrl">scbd profileUrl</a>
    </div>
  </div>
</template>

<script
  setup
  lang="ts"
>
definePageMeta({
  roles: [Authenticated],
});

const { loginUrl, logoutUrl, profileUrl } = useScbdAuthConfig();
</script>
