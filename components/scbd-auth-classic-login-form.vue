<template>
  <div>
    <h1 class="text-center">
      Login
    </h1>
    <CForm @submit.prevent="handleSubmit">
      <div class="mb-3">
        <CFormLabel for="classic-email">Email</CFormLabel>
        <CFormInput
          id="classic-email"
          v-model="email"
          type="email"
          autocomplete="email"
          required
          :disabled="isSubmitting"
        />
      </div>
      <div class="mb-3">
        <CFormLabel for="classic-password">Password</CFormLabel>
        <CFormInput
          id="classic-password"
          v-model="password"
          type="password"
          autocomplete="current-password"
          required
          :disabled="isSubmitting"
        />
      </div>
      <div class="mb-3">
        <CFormCheck
          id="classic-remember-me"
          v-model="rememberMe"
          label="Remember me"
        />
      </div>
      <CAlert
        v-if="errorMessage"
        color="danger"
      >
        {{ errorMessage }}
      </CAlert>
      <CButton
        type="submit"
        color="primary"
        class="w-100"
        :disabled="isSubmitting"
      >
        <span v-if="isSubmitting">Signing in...</span>
        <span v-else>
          Sign In
          <font-awesome-icon
            icon="key"
            class="ps-1"
          />
        </span>
      </CButton>
    </CForm>
  </div>
</template>

<script
  setup
  lang="ts"
>
const STORAGE_KEY_REMEMBER_EMAIL = 'classic:rememberEmail'

const { signIn } = useScbdAuthClassic()
const { query } = useRoute()

const email = ref(localStorage.getItem(STORAGE_KEY_REMEMBER_EMAIL) || '')
const password = ref('')
const rememberMe = ref(!!localStorage.getItem(STORAGE_KEY_REMEMBER_EMAIL))
const isSubmitting = ref(false)
const errorMessage = ref<string | null>(null)

const returnUrl = computed(() => query.returnUrl as string || '/')

async function handleSubmit(): Promise<void> {
  isSubmitting.value = true
  errorMessage.value = null

  try {
    if (rememberMe.value) {
      localStorage.setItem(STORAGE_KEY_REMEMBER_EMAIL, email.value)
    } else {
      localStorage.removeItem(STORAGE_KEY_REMEMBER_EMAIL)
    }

    await signIn(email.value, password.value)
    await navigateTo(returnUrl.value)
  } catch (err: unknown) {
    errorMessage.value = err instanceof Error ? err.message : 'Sign in failed'
    password.value = ''
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.card-body .row {
  padding: 0.5rem;
}
</style>
