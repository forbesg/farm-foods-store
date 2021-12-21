<template>
  <div>
    <div class="container my-12 mt-4 md:mt-12">
      <div class="w-auto sm:max-w-lg mx-auto">
        <form
          class="green-gradient"
          action="index.html"
          method="post"
          @submit.prevent="handleRegistration"
        >
          <img
            src="~assets/images/logo.svg"
            alt="Logo"
            class="w-16 h-16 mb-4 mx-auto"
          />
          <h1 class="text-2xl text-center font-medium mb-8">
            Create an account
          </h1>
          <div class="form-group green-label">
            <label for="firstName">First Name</label>
            <input
              id="firstName"
              v-model="registerForm.firstName"
              type="text"
              name="firstName"
              autocomplete="firstName"
            />
          </div>
          <div class="form-group green-label">
            <label for="lastName">Last Name</label>
            <input
              id="lastName"
              v-model="registerForm.lastName"
              type="text"
              name="lastName"
              autocomplete="lastName"
            />
          </div>
          <div class="form-group green-label">
            <label for="email">Email</label>
            <input
              id="email"
              v-model="registerForm.email"
              type="email"
              name="email"
              autocomplete="username"
            />
          </div>
          <div class="form-group green-label">
            <label for="password">Password</label>
            <input
              id="password"
              v-model="registerForm.password"
              type="password"
              name="password"
              autocomplete="new-password"
            />
          </div>
          <div class="form-group green-label">
            <label for="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              v-model="registerForm.confirmPassword"
              type="password"
              name="confirmPassword"
              autocomplete="new-password"
            />
          </div>
          <div class="form-group green-label-submit">
            <button
              type="submit"
              :class="[{ loading: loading }]"
              class="w-full"
            >
              Submit
            </button>
            <div v-if="error" class="mt-4">
              {{ error }}
            </div>
            <span class="block mt-4 text-sm"
              >Already have an account.
              <nuxt-link to="/login" class="text-orange font-semibold"
                >Login Here</nuxt-link
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
  mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
        displayName
        email
        firstName
        lastName
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`
export default {
  data() {
    return {
      registerForm: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
      },
      error: '',
      loading: false,
    }
  },
  head() {
    return {
      title: 'Register | Farm Foods Store',
    }
  },
  // TODO: Need to make sure that the users accessToken is being written to
  // Vuex (user) and to localStorage
  methods: {
    async handleRegistration() {
      this.loading = true
      const { firstName, lastName, email, password, confirmPassword } =
        this.registerForm
      if (!firstName || !lastName || !email || !password || !confirmPassword) {
        this.loading = false
        return (this.error = 'Please complete all fields above')
      }
      if (password !== confirmPassword) {
        this.loading = false
        return (this.error = 'Passwords do not match')
      }
      const variables = {
        input: { firstName, lastName, email, password },
      }
      const {
        data: {
          customerCreate: { customer, customerUserErrors },
        },
      } = await this.$client(createCustomerMutation, variables).then((res) =>
        res.json()
      )
      if (customerUserErrors && customerUserErrors.length) {
        this.error = customerUserErrors[0].message
        this.loading = false
        return
      }
      /**
        Redirect to Store / Account Page ?
      **/
      this.$store.dispatch('setUser', customer)
      this.$store.dispatch('setNotification', {
        message: `Welcome ${firstName}, your are now logged in.`,
      })
      this.$router.push('/')
    },
  },
}
</script>

<style scoped></style>
