<template>
  <div
    class="
      bg-orange-50
      text-black
      cart
      fixed
      top-0
      right-0
      transform
      lg:-translate-x-4 lg:translate-y-4
      p-6
      border border-gray-50 border-opacity-25
      w-full
      sm:w-2/3
      lg:w-1/2
      xl:w-2/5
      z-10
    "
  >
    <div
      class="
        absolute
        top-0
        right-0
        h-6
        w-6
        flex
        justify-center
        items-center
        rounded-full
        transform
        -translate-x-6
        translate-y-6
        text-lg
        close
        cursor-pointer
        hover:text-white
      "
      @click="closeCart"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 0 24 24"
        width="24px"
        fill="currentColor"
      >
        <path d="M0 0h24v24H0V0z" fill="none" />
        <path
          d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
        />
      </svg>
    </div>
    <div class="text-2xl font-bold mb-4">Cart</div>
    <div
      v-for="item in cart.lines.edges"
      :key="item.node.id"
      class="py-2 flex text-base items-center"
    >
      <span class="flex-1"
        >{{ item.node.merchandise.product.title }} -
        {{ item.node.merchandise.title }}</span
      >
      <div class="bg-orange-50 flex items-center col-span-auto w-auto">
        <button class="white p-1">
          <img
            src="~assets/icons/remove.svg"
            alt="Decrement Quantity"
            class="w-6 h-6"
            @click="(e) => decrementLineQuantity(item.node, e)"
          />
        </button>
        <span
          class="
            inline-block
            flex
            items-center
            justify-center
            text-center
            font-bold
            p-1
            w-6
            h-6
          "
          >{{ item.node.quantity }}</span
        >
        <button class="white p-1">
          <img
            src="~assets/icons/add.svg"
            alt="Increment Quantity"
            class="w-6 h-6"
            @click="(e) => incrementLineQuantity(item.node, e)"
          />
        </button>
      </div>
      <button
        class="text-xs cursor-pointer p-2 text"
        @click="(e) => removeFromCart(item.node.id, e)"
      >
        Remove
      </button>
    </div>
    <div
      v-if="cart.estimatedCost"
      class="totals flex items-center justify-end mt-8 text-xl font-bold"
    >
      <span>Total: </span>
      <span class="ml-4"
        >&pound;{{
          parseFloat(cart.estimatedCost.totalAmount.amount).toFixed(2)
        }}</span
      >
    </div>
    <div v-if="cart.checkoutUrl" class="flex justify-end mt-6">
      <nuxt-link v-if="$route.path !== '/cart'" to="/cart" class="button text"
        >View Your Cart</nuxt-link
      >
      <a :href="cart.checkoutUrl" class="button white">Checkout</a>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      removing: false,
    }
  },
  computed: {
    cart() {
      return this.$store.getters['cart/cart']
    },
  },
  methods: {
    closeCart() {
      this.$store.commit('setShowCart', false)
    },
    async removeFromCart(id, e) {
      e.target.classList.add('loading')
      await this.$store.dispatch('cart/removeFromCart', id)
    },
    async decrementLineQuantity(item, e) {
      const { id, quantity } = item
      const button = e.target.closest('button')
      button.classList.add('loading')
      if (quantity === 1) {
        this.$store.dispatch('cart/removeFromCart', id)
        return
      }

      const newQuantity = quantity - 1
      await this.$store.dispatch('cart/updateCartLine', {
        id,
        type: 'decrement',
        newQuantity,
      })
      button.classList.remove('loading')
    },
    async incrementLineQuantity(item, e) {
      const { id, quantity } = item
      const button = e.target.closest('button')
      button.classList.add('loading')
      const newQuantity = quantity + 1
      await this.$store.dispatch('cart/updateCartLine', {
        id,
        type: 'increment',
        newQuantity,
      })
      button.classList.remove('loading')
    },
  },
}
</script>
