<template>
  <div>
    <div class="container my-12 mt-4 md:mt-12">
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
            class="w-20 h-20 mb-6 mx-auto"
          />
          <h1 class="text-2xl text-center font-medium mb-12">
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
            <button type="submit" :class="[{ loading: loading }]" class="mr-0">
              Login
            </button>
            <div v-if="error" class="mt-4">
              <span>{{ error }}</span>
            </div>
            <span class="block mt-4 text-sm"
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

      this.$store.dispatch('setUser', customer)
      localStorage.setItem(
        'farmfoods:customer-accessToken',
        JSON.stringify(customerAccessToken)
      )
      this.$router.push('/account')
    },
  },
}
</script>

<style scoped></style>
