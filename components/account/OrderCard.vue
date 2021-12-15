<template>
  <div class="order-card">
    <div class="">
      <h3>Order Details</h3>
      <p>
        <span>Order Number:</span> <span>#{{ order.node.orderNumber }}</span>
      </p>
      <p>
        <span>Order Date:</span>
        <span>{{ order.node.processedAt | formatDate }}</span>
      </p>
      <p>
        <span>Sub-Total:</span>
        <span>{{ order.node.currentSubtotalPrice.amount | currency }}</span>
      </p>
      <p>
        <span>Total:</span>
        <span>{{ order.node.currentTotalPrice.amount | currency }}</span>
      </p>
    </div>
    <div v-if="order.node.shippingAddress">
      <h3>Shipping Address</h3>
      <address>
        {{ order.node.shippingAddress.firstName }}
        {{ order.node.shippingAddress.lastName }} <br />
        {{ order.node.shippingAddress.address1 }} <br />
        <span v-if="order.node.shippingAddress.address2"
          >{{ order.node.shippingAddress.address2 }} <br
        /></span>
        {{ order.node.shippingAddress.city }} <br />
        <span v-if="order.node.shippingAddress.zip"
          >{{ order.node.shippingAddress.zip }} <br
        /></span>
      </address>
    </div>
    <div class="">
      <nuxt-link
        :to="`/account/orders/${order.node.orderNumber}?id=${order.node.id}`"
        class="brand"
        >View Order</nuxt-link
      >
    </div>
  </div>
</template>

<script>
export default {
  props: {
    accessToken: {
      type: String,
      required: true,
    },
    order: {
      type: Object,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.order-card {
  @apply bg-white p-6 grid gap-6 text-sm;
  @screen md {
    @apply p-12 gap-12 grid-cols-2;
  }
  @screen lg {
    @apply p-6 gap-6 grid-cols-1;
  }
  @screen xl {
    @apply p-12 gap-12 grid-cols-2;
  }
  h3 {
    @apply text-base font-semibold mb-4;
  }
  p {
    @apply flex justify-between items-center;
  }
}
</style>
