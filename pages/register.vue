<template>
  <div>
    <div class="container">
      <h1>Create An Account</h1>
      <div class="">
        <form
          class="border border-gray-100 p-12 max-w-lg mx-auto"
          action="index.html"
          method="post"
          @submit.prevent="handleRegistration"
        >
          <div class="form-group">
            <label for="firstName">First Name</label>
            <input
              id="firstName"
              type="text"
              name="firstName"
              v-model="registerForm.firstName"
            />
          </div>
          <div class="form-group">
            <label for="lastName">Last Name</label>
            <input
              id="lastName"
              type="text"
              name="lastName"
              v-model="registerForm.lastName"
            />
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              v-model="registerForm.email"
            />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              autocomplete="new-password"
              v-model="registerForm.password"
            />
          </div>
          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              autocomplete="new-password"
              v-model="registerForm.confirmPassword"
            />
          </div>
          <div v-if="error" class="">
            {{ error }}
          </div>
          <button type="submit" :class="[{ loading: loading }]" class="w-full">
            Submit
          </button>
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
