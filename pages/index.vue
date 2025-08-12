<template>
  <h1>index page</h1>
  <h2>no auth required</h2>
  <RouterLink to="loggedin">To logged in page</RouterLink>
</template>

<script setup lang="ts">
console.log('index.vue load')

definePageMeta({
  auth: false,
});
</script>
