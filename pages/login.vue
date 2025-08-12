<template>
  <div class="app flex-row align-items-center">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-5">
          <div class="card-group">
            <div class="card">
              <div class="card-body">

                <div v-if="!isAuthenticated">
                  <h1 class="text-center">
                    Login
                  </h1>

                  <div class="row">
                    <div class="col">
                      Kronos is now using CBD Secretariat Single Signin system.
                      You will be redirected to the SCBD sigin page.
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
                        id="skipLoginPage-login"
                        label="Do not show me this page again"
                        v-model="skipLoginPage"
                      />
                    </div>
                  </div>

                </div>

                <div v-else>
                  <div class="row">
                    <div class="col text-center">
                      <h1 class="text-center">
                        Logged-in
                      </h1>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col text-center">
                      You are logged in as {{ user?.name }}
                    </div>
                  </div>
                  <div class="row">
                    <div class="col text-center">
                      <CButton
                        class="w-100 my-1"
                        color="success"
                        @click="navigateTo('/')"
                      >
                        Go to Dashboard
                        <font-awesome-icon
                          :icon="['fas', 'tachometer-alt']"
                          class="ps-1"
                        />
                      </CButton>
                      <CButton
                        class="w-100 my-1"
                        color="danger"
                        @click="logout('/')"
                      >
                        Logout
                        <font-awesome-icon
                          icon="sign-out-alt"
                          class="ps-1"
                        />
                      </CButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script
  setup
  lang="ts"
>
definePageMeta({
  auth: false,
  icon: ['fas', 'sign-in-alt'],
});

const { isAuthenticated, login, logout, user } = useScbdAuth();
const { query } = useRoute();
const skipLoginPage = useCookie('skip-login-page');

const returnUrl = computed(() => query.returnUrl as string || '/');
</script>

<style scoped>
.card-body .row {
  padding: 0.5rem;
}

.form-check {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  justify-content: center;
}
</style>
