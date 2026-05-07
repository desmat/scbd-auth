<template>
  <div>
    <h1 class="text-center">
      Login
    </h1>
    <div class="row">
      <div class="col">
        Kronos is now using CBD Secretariat Single Signin system.
        You will be redirected to the SCBD signin page.
      </div>
    </div>
    <div class="row">
      <div class="col">
        <CButton
          class="w-100"
          color="primary"
          @click="login(returnUrl)"
        >
          Login using SCBD
          <font-awesome-icon
            icon="key"
            class="ps-1"
          />
        </CButton>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <CFormCheck
          id="skipLoginPage-sso"
          v-model="skipLoginPage"
          label="Do not show me this page again"
        />
      </div>
    </div>
  </div>
</template>

<script
  setup
  lang="ts"
>
const { login } = useScbdAuthSso()
const { query } = useRoute()
const skipLoginPage = useCookie('skip-login-page')

const returnUrl = computed(() => query.returnUrl as string || '/')
</script>
