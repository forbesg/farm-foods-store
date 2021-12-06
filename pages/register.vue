<template>
  <div>
    <div class="container my-12">
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
            class="w-20 h-20 mb-6 mx-auto"
          />
          <h1 class="text-2xl text-center font-medium mb-12">
            Create an account
          </h1>
          <div class="form-group green-label">
            <label for="firstName">First Name</label>
            <input
              id="firstName"
              type="text"
              name="firstName"
              v-model="registerForm.firstName"
            />
          </div>
          <div class="form-group green-label">
            <label for="lastName">Last Name</label>
            <input
              id="lastName"
              type="text"
              name="lastName"
              v-model="registerForm.lastName"
            />
          </div>
          <div class="form-group green-label">
            <label for="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              v-model="registerForm.email"
            />
          </div>
          <div class="form-group green-label">
            <label for="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              autocomplete="new-password"
              v-model="registerForm.password"
            />
          </div>
          <div class="form-group green-label">
            <label for="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              autocomplete="new-password"
              v-model="registerForm.confirmPassword"
            />
          </div>
          <div class="text-right">
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
  methods: {
    async handleRegistration() {
      this.loading = true
      const { firstName, lastName, email, password, confirmPassword } =
        this.registerForm
      if (!firstName || !lastName || !email || !password || !confirmPassword) {
        this.loading = false
        return (this.error = 'Complete all required fields')
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
      console.log('Register', customer)
      /**
        Redirect to Store / Account Page ?
      **/
    },
  },
}
</script>

<style scoped></style>
