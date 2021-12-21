<template>
  <div>
    <div class="container my-8 mt-4 md:mt-12">
      <div class="w-auto sm:max-w-lg mx-auto">
        <form
          class="green-gradient"
          action="index.html"
          method="post"
          @submit.prevent="handleLogin"
        >
          <img
            src="~assets/images/logo.svg"
            alt="Logo"
            class="w-16 h-16 mb-4 mx-auto"
          />
          <h1 class="text-xl sm:text-2xl text-center font-medium mb-8">
            Login to your account
          </h1>
          <div class="form-group green-label">
            <label for="email">Email</label>
            <input
              id="email"
              v-model="loginForm.email"
              type="email"
              name="email"
              autocomplete="username"
            />
          </div>
          <div class="form-group green-label">
            <label for="password">Password</label>
            <input
              id="password"
              v-model="loginForm.password"
              type="password"
              name="password"
              autocomplete="current-password"
            />
          </div>
          <div class="text-right">
            <a
              href="#"
              class="font-bold text-xs text-orange"
              @click.prevent="showForgottenPasswordPanel = true"
              >Forgotten Your Password?</a
            >
          </div>

          <div class="form-group green-label-submit">
            <button type="submit" :class="[{ loading: loading }]" class="mr-0">
              Login
            </button>
            <div v-if="error" class="mt-4">
              <span>{{ error }}</span>
            </div>
            <span class="block text-center mt-4 text-sm"
              >No account yet.
              <nuxt-link to="/register" class="text-orange font-semibold"
                >Register Here</nuxt-link
              ></span
            >
          </div>
        </form>
      </div>
      <div class="panel-wrapper">
        <transition name="slideInUp">
          <div
            v-if="showForgottenPasswordPanel"
            class="forgotten-password-panel fixed md:relative inset-0 top-auto w-auto sm:max-w-lg mx-auto bg-white h-auto p-6 sm:p-12 z-90"
          >
            <button
              type="button"
              name="button"
              class="text absolute top-2 right-2"
              @click="showForgottenPasswordPanel = false"
            >
              <img src="~assets/icons/close.svg" alt="Close" />
            </button>
            <p class="font-display font-semibold text-lg mb-4">
              Forgotten your password?
            </p>
            <p class="mb-4 text-sm">
              Enter your email click on the link below and we will email you a
              link to reset your password.
            </p>
            <div class="form-group">
              <label for="reset-email">Enter your Email:</label>
              <input
                id="reset-email"
                type="email"
                name=""
                autocomplete="email"
                v-model="resetEmail"
                class="border border-orange-200"
              />
            </div>
            <div class="text-right">
              <!-- <a href="#" class="text-orange font-bold"
                >Send password reset email</a
              > -->
              <button
                type="button"
                name="button"
                class=""
                @click="handleResetEmail"
              >
                Send password reset email
              </button>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
const createCustomerMutation = `
  mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`
const customerQuery = `
  query($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      displayName
      email
      orders(first: 10) {
        edges {
          node {
            id
          }
        }
      }
    }
  }
`
export default {
  middleware: ['signedInUser'],
  data() {
    return {
      loginForm: {
        email: '',
        password: '',
      },
      error: '',
      loading: false,
      showForgottenPasswordPanel: false,
      resetEmail: '',
    }
  },
  head() {
    return {
      title: 'Login | Farm Foods Store',
      meta: [
        {
          name: 'description',
          hid: 'description',
          content: 'Login to your Farm Food Store Account',
        },
      ],
    }
  },
  computed: {
    user() {
      return this.$store.getters.user
    },
  },
  watch: {
    user(value) {
      if (value) {
        this.$router.replace('/account')
      }
    },
  },
  methods: {
    async handleLogin() {
      this.loading = true
      const { loginForm } = this
      if (!loginForm.email || !loginForm.password) {
        this.loading = false
        return (this.error = 'Both email and password are required')
      }

      const variables = { input: loginForm }
      const {
        data: {
          customerAccessTokenCreate: {
            customerAccessToken,
            customerUserErrors,
          },
        },
      } = await this.$client(createCustomerMutation, variables).then((res) =>
        res.json()
      )

      if (customerUserErrors && customerUserErrors.length) {
        this.loading = false
        switch (customerUserErrors[0].code) {
          case 'UNIDENTIFIED_CUSTOMER':
            this.error = 'Email or password is incorrect.'
            break
          default:
            this.error = 'Error logging in. Please check and try again.'
        }
        return
      }

      const {
        data: { customer, customerUserErrors: errors },
      } = await this.$client(customerQuery, {
        customerAccessToken: customerAccessToken.accessToken,
      }).then((res) => res.json())

      if (errors && errors.length) {
        this.error = errors[0].message
        return
      }
      customer.accessToken = customerAccessToken.accessToken
      this.$store.dispatch('setUser', customer)
      localStorage.setItem(
        'farmfoods:customer-accessToken',
        JSON.stringify(customerAccessToken)
      )
      this.$router.push('/account')
    },
    async handleResetEmail() {
      await console.log(this.resetEmail)
    },
  },
}
</script>

<style lang="scss" scoped>
.panel-wrapper {
  @screen md {
    perspective: 800px;
  }
}
</style>
