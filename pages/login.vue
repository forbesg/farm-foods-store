<template>
  <div>
    <div class="container my-12">
      <div class="max-w-lg mx-auto">
        <form
          class="
            border border-gray-100
            bg-gradient-to-br
            from-green
            to-green-400
            text-white
            p-12
            max-w-lg
            mx-auto
          "
          action="index.html"
          method="post"
          @submit.prevent="handleLogin"
        >
          <img
            src="~assets/images/logo.svg"
            alt="Logo"
            class="w-20 h-20 mb-6 mx-auto"
          />
          <h1 class="text-2xl text-center font-medium mb-12">
            Login to your account
          </h1>
          <div class="form-group">
            <input
              id="email"
              type="email"
              name="email"
              v-model="loginForm.email"
              autocomplete="username"
            />
            <label for="email">Email</label>
          </div>
          <div class="form-group">
            <input
              id="password"
              type="password"
              name="password"
              v-model="loginForm.password"
              autocomplete="current-password"
            />
            <label for="password">Password</label>
          </div>
          <button type="submit" :class="[{ loading: loading }]" class="w-full">
            Login
          </button>
          <div v-if="error" class="text-red-400 mt-4">
            <span>{{ error }}</span>
          </div>
          <div class="form-group w-full">
            <span class="block"
              >No account yet.
              <nuxt-link to="/register" class="text-orange font-semibold"
                >Register Here</nuxt-link
              ></span
            >
          </div>
        </form>
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
        this.error = customerUserErrors[0].message
        return
      }

      const {
        data: { customer, customerUserErrors: errors },
      } = await this.$client(customerQuery, {
        customerAccessToken: customerAccessToken.accessToken,
      }).then((res) => res.json())

      if (errors && errors.length) {
        console.log(errors[0].message)
        this.error = errors[0].message
        return
      }

      this.$store.dispatch('setUser', customer)
      localStorage.setItem(
        'farmfoods:customer-accessToken',
        JSON.stringify(customerAccessToken)
      )
      this.$router.replace('/account')
    },
  },
}
</script>

<style scoped></style>
