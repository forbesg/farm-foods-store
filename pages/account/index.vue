<template>
  <div class="py-24">
    <div class="container">
      <div v-if="user" class="grid">
        <div class="">
          <h1 class="text-3xl">Your Account</h1>
          <div class="my-12">
            <h2 class="text-lg mb-4">Customer Details</h2>
            <p>Name: {{ user.displayName }}</p>
            <p>Email: {{ user.email }}</p>
            <p v-if="user.phone">Phone: {{ user.phone }}</p>
          </div>
          <button class="white" @click="handleLogout">Logout</button>
        </div>
        <div v-if="user.orders" class="">
          <h2>Your Orders</h2>
          <div
            v-if="user.orders.edges && user.orders.edges.length"
            class=""
          ></div>
          <div v-else>No Orders Yet</div>
        </div>
      </div>

      {{ user }}
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    user() {
      return this.$store.getters.user
    },
  },
  mounted() {
    const activeUser = localStorage.getItem('farmfoods:customer-accessToken')
    if (!this.user && !activeUser) {
      this.$router.replace('/login')
    }
  },
  methods: {
    handleLogout() {
      this.$store.dispatch('setUser', null)
      this.$store.dispatch('cart/resetCart')
      localStorage.removeItem('farmfoods:cart')
      this.$router.replace('/')
      this.$store.dispatch('setNotification', {
        message: 'You have been logged out',
      })
    },
  },
}
</script>

<style scoped></style>
