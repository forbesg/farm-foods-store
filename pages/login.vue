<template>
  <div>
    <div class="container">
      <h1>Create An Account</h1>
      <div class="">
        <form
          class="border border-gray-100 p-12 max-w-lg mx-auto"
          action="index.html"
          method="post"
          @submit.prevent="handleLogin"
        >
          <div class="form-group">
            <label for="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              autocomplete="username"
              v-model="loginForm.email"
            />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              autocomplete="current-password"
              v-model="loginForm.password"
            />
          </div>
          <button type="submit" :class="[{ loading: loading }]" class="w-full">
            Submit
          </button>
          <div class="form-group w-full">
            <!-- <input
              id="submit"
              type="submit"
              name="submit"
              value="Submit"
              class="button"
            /> -->
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
  methods: {
    async handleLogin() {
      this.loading = true
      const { loginForm } = this
      if (!loginForm.email || !loginForm.password) {
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
