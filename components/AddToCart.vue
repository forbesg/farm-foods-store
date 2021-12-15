<template>
  <div>
    <div v-if="product.variants.edges && product.variants.edges.length > 1">
      <div
        v-for="variant in product.variants.edges"
        :key="variant.node.id"
        class="form-group radio"
      >
        <input
          :id="variant.node.title.split(' ').join('-').toLowerCase()"
          v-model="order.variant"
          type="radio"
          name="variant"
          :value="variant"
        />
        <label
          :for="variant.node.title.split(' ').join('-').toLowerCase()"
          class="pl-4"
          >{{ variant.node.title }} -
          <span class="text-sm text-gray-700"
            >{{ variant.node.priceV2.amount | currency }} each</span
          ></label
        >
      </div>
    </div>
    <div class="form-group my-6 flex justify-between">
      <label for="quantity" class="mr-4">Quantity:</label>
      <div
        class="quantity-input-wrapper border border-gray-100 flex justify-start items-center"
      >
        <button
          type="button"
          name="button"
          class="touch"
          @click="updateQuantity(-1)"
        >
          <img src="~assets/icons/remove.svg" alt="Decrement quantity" />
        </button>
        <input
          id="quantity"
          v-model="order.quantity"
          type="number"
          name="quantity"
          min="1"
        />
        <button
          type="button"
          name="button"
          class="touch"
          @click="updateQuantity(1)"
        >
          <img src="~assets/icons/add.svg" alt="Increment quantity" />
        </button>
      </div>
    </div>

    <div class="totals text-xl font-semibold">
      <span class="inline-block text-sm">Total:</span
      ><span class="inline-block ml-4">£{{ total }}</span>
    </div>
    <button
      class="button full-width mt-6"
      :class="[{ loading }]"
      @click="addToCart"
    >
      Add To Cart
    </button>
    <div v-if="error" class="text-red-500">
      {{ error }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      order: {
        quantity: 1,
        variant: this.product?.variants?.edges[0],
      },
      error: null,
      loading: false,
    }
  },
  computed: {
    total() {
      return (
        (
          this.order.quantity * this.order.variant?.node?.priceV2?.amount
        ).toFixed(2) ?? 0
      )
    },
  },
  methods: {
    updateQuantity(quantity) {
      if (!quantity || !(this.order.quantity + quantity)) return
      this.order.quantity += quantity
    },
    addToCart() {
      // Bail if the button is in a loading state to prevent multiple submissions
      if (this.loading) return
      this.loading = true
      // Construct the line to add to the cart
      const newLine = {
        lines: [
          {
            quantity: parseInt(this.order.quantity, 10),
            merchandiseId: this.order.variant.node.id,
          },
        ],
      }

      this.$store.dispatch('cart/addToCart', newLine).then((res) => {
        if (res.errors && res.errors.length) {
          this.error = 'There was an error adding your item to your trolly'
          this.loading = false
          return
        }

        this.$store.dispatch('setNotification', {
          style: 'default',
          message: 'Your item has been added to your shopping trolly.',
        })
        // Reset quantity & loading state
        this.order.quantity = 1
        this.loading = false
        this.$emit('productAdded')
      })
    },
  },
  watch: {
    'order.variant'(variant) {
      this.$emit('setSelectedVariantImage', variant.node.image)
    },
  },
}
</script>
