<template>
  <div>
    <div class="container">
      {{ user }}
      <div class="">
        <button type="button" name="button" @click="handleLogout">
          Logout
        </button>
      </div>
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
  created() {
    if (!this.user) {
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
