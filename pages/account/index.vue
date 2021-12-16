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
        <div v-if="orders && !ordersLoading" class="lg:col-span-2">
          <div class="my-12">
            <h2 class="text-lg mb-4 font-semibold">Your Orders</h2>
            <div v-if="orders.edges && orders.edges.length">
              <account-order-card
                v-for="order in orders.edges"
                :key="order.node.id"
                :order="order"
                :access-token="user.accessToken"
                class="mb-4"
              ></account-order-card>
            </div>
            <div v-else>No Orders Yet</div>
          </div>
        </div>
        <div
          v-else
          class="h-full w-full flex justify-center items-center lg:col-span-2"
        >
          <loader />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  middleware: ['signedInUser'],
  data() {
    return {
      orders: null,
      ordersLoading: true,
    }
  },
  async fetch() {
    if (!this.user) return
    const ordersQuery = `
      query ($customerAccessToken: String!) {
        customer(customerAccessToken: $customerAccessToken) {
          orders(first: 5, reverse: true) {
            edges {
              node {
                id
                orderNumber
                customerUrl
                processedAt
                shippingAddress {
                  firstName
                  lastName
                  address1
                  address2
                  city
                  zip
                }
                currentSubtotalPrice {
                  amount
                }
                currentTotalPrice {
                  amount
                }
                fulfillmentStatus
              }
            }
          }
        }
      }
    `
    try {
      const {
        data: {
          customer: { orders },
        },
        errors,
      } = await this.$client(ordersQuery, {
        customerAccessToken: this.$store.getters.user.accessToken,
      }).then((res) => res.json())
      if (errors && errors.length) {
        throw new Error('Error retreiving your orders')
      }
      this.orders = orders
      this.ordersLoading = false
    } catch (err) {
      this.$store.dispatch('setNotification', { message: err.message })
      this.orders = []
      this.ordersLoading = false
    }
  },
  head() {
    return {
      title: 'Your Account | Farm Foods Store',
    }
  },
  computed: {
    user() {
      return this.$store.getters.user
    },
  },
  watch: {
    user(value) {
      if (value && this.ordersLoading) {
        this.getOrders()
      }
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
    getOrders() {
      this.$fetch()
    },
  },
  fetchOnServer: false,
}
</script>

<style scoped></style>
