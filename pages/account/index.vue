<template>
  <div class="">
    <div class="container my-12">
      <h1 class="text-3xl font-display font-semibold">Your Account</h1>
      <div v-if="user" class="grid lg:grid-cols-3 gap-12">
        <div class="">
          <div class="my-12">
            <h2 class="text-lg mb-4 font-semibold">Customer Details</h2>
            <p>Name: {{ user.displayName }}</p>
            <p>Email: {{ user.email }}</p>
            <p v-if="user.phone">Phone: {{ user.phone }}</p>
          </div>
          <button class="white" @click="handleLogout">Logout</button>
        </div>
        <div v-if="user.orders" class="lg:col-span-2">
          <div class="my-12">
            <h2 class="text-lg mb-4 font-semibold">Your Orders</h2>
            <div
              v-if="user.orders.edges && user.orders.edges.length"
              class=""
            ></div>
            <div v-else>No Orders Yet</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  middleware: ['signedInUser'],
  computed: {
    user() {
      return this.$store.getters.user
    },
  },
  methods: {
    handleLogout() {
      this.$store.dispatch('setUser', null)
      this.$store.dispatch('cart/resetCart')
      localStorage.removeItem('farmfoods:cart')
      localStorage.removeItem('farmfoods:customer-accessToken')
      this.$router.replace('/')
      this.$store.dispatch('setNotification', {
        message: 'You have been logged out',
      })
    },
  },
}
</script>

<style scoped></style>
