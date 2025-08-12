<template>
  <h1>logged in page</h1>
  <h2>auth required</h2>
  <RouterLink to="/">To index page</RouterLink>
</template>

<script
  setup
  lang="ts"
>
console.log('loggedin.vue load')

definePageMeta({
  roles: [Authenticated],
});

</script>
