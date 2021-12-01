<template>
  <div>
    <div class="container">
      <h1 class="my-12 text-4xl font-semibold">Your Shopping Cart</h1>
      <div
        v-if="$fetchState.pending"
        class="h-72 flex justify-center items-center"
      >
        <div class="flex-none">
          <loader />
        </div>
      </div>
      <div v-else class="cart-wrapper">
        <div
          v-if="cart && cart.lines.edges.length"
          class="grid md:grid-cols-3 md:grid-rows-1 md:gap-12"
        >
          <div class="md:col-span-2 divide-y divide-solid">
            <div v-for="line in cart.lines.edges" :key="line.node.id">
              <div
                v-if="line.node.merchandise"
                class="
                  cart-items
                  grid grid-cols-3
                  sm:grid-cols-4
                  md:gap-0 md:grid-cols-4
                "
              >
                <div
                  class="
                    image-container
                    p-2
                    md:py-6 md:px-4
                    w-full
                    h-32
                    md:h-full md:col-span-1
                  "
                >
                  <img
                    :src="line.node.merchandise.image.transformedSrc"
                    :alt="line.node.merchandise.image.altText"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div class="product-details py-6 px-4 md:col-span-1">
                  <h2 class="font-semibold">
                    {{ line.node.merchandise.title }}
                  </h2>
                  <div class="divide-x divide-solid text-xs text-gray-400">
                    <span class="inline-block px-2 my-2">Tag1</span>
                    <span class="inline-block px-2 my-2">Tag2</span>
                  </div>
                  <span class="block font-semibold"
                    >£{{
                      parseFloat(
                        line.node.estimatedCost.totalAmount.amount
                      ).toFixed(2)
                    }}</span
                  >
                </div>
                <div
                  class="product-quantity py-6 px-4 md:col-span-1 text-center"
                >
                  <select
                    class="bg-white border border-gray-400 p-2 text-center"
                    name="quantity"
                    @change="(e) => handleQuantityChange(e, line.node.id)"
                  >
                    <option
                      v-for="num in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
                      :key="num"
                      :value="num"
                      :selected="line.node.quantity === num"
                    >
                      {{ num }}
                    </option>
                    <img src="~assets/icons/expand.svg" alt="Expand" />
                  </select>
                </div>
                <div class="remove-product py-6 px-4 text-right">
                  <div
                    class="inline-block cursor-pointer"
                    @click="handleRemoveLineItem(line.node.id)"
                  >
                    <img src="~assets/icons/close.svg" alt="Close" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="order-summary md:col-start-3 md:row-start-1">
            <div
              class="
                order-summary-inner
                sticky
                top-32
                bg-orange-50 bg-opacity-25
                p-6
              "
            >
              <h2 class="text-xl font-semibold mb-6">Order Summary</h2>
              <div class="divide-y divide-solid">
                <div class="flex justify-between items-center py-2">
                  <span>Sub-Total:</span
                  ><span class="font-semibold text-lg"
                    >&pound;{{
                      parseFloat(
                        cart.estimatedCost.subtotalAmount.amount
                      ).toFixed(2)
                    }}</span
                  >
                </div>
                <div class="flex justify-between items-center py-2">
                  <span>Shipping:</span
                  ><span class="text-xs font-semibold"
                    >Calculated At Checkout</span
                  >
                </div>
                <div
                  class="
                    flex
                    justify-between
                    items-center
                    font-semibold
                    text-lg
                    py-4
                  "
                >
                  <span>Total:</span
                  ><span
                    >&pound;{{
                      parseFloat(cart.estimatedCost.totalAmount.amount).toFixed(
                        2
                      )
                    }}</span
                  >
                </div>
              </div>
              <div class="mt-6 text-right">
                <a :href="cart.checkoutUrl" class="button">Checkout</a>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="flex justify-center items-center">
          <div class="w-full bg-orange-50 bg-opacity-25 p-24 text-center">
            <p class="text-2xl mb-4">Your cart is empty</p>
            <nuxt-link to="/products" class="button">Start Shopping</nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // cart: null,
      errors: [],
    }
  },
  computed: {
    cart() {
      return this.$store.getters['cart/cart'] || null
    },
  },
  async fetch() {
    const query = `
      query ($id: ID!) {
        cart (id: $id) {
          id
          checkoutUrl
          estimatedCost {
            subtotalAmount {
              amount
              currencyCode
            }
            totalAmount {
              amount
              currencyCode
            }
          }
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                estimatedCost {
                  totalAmount {
                    amount
                    currencyCode
                  }
                }
                merchandise {
                  ... on ProductVariant {
                    title
                    priceV2 {
                      amount
                      currencyCode
                    }
                    product {
                      id
                      title
                    }
                    image {
                      transformedSrc(crop: CENTER, maxHeight: 200, maxWidth: 300)
                      altText
                    }
                  }
                }
              }
            }
          }
        }
      }
    `
    // Get cart id from localStorage
    const localCart = JSON.parse(window.localStorage.getItem('farmfoods:cart'))
    if (!localCart) {
      this.errors = ['No Cart present']
      return
    }
    const variables = {
      id: localCart.id,
    }
    const { data, errors } = await this.$client(query, variables).then((res) =>
      res.json()
    )
    if (errors && errors.length) {
      this.errors = errors
      return
    }
    this.$store.commit('cart/updateCart', data.cart)
  },
  fetchOnServer: false,
  methods: {
    handleQuantityChange(e, id) {
      console.log(e.target.value, id, 'click')
    },
    async handleRemoveLineItem(id) {
      await this.$store.dispatch('cart/removeFromCart', id)
    },
  },
}
</script>

<style scoped>
/* .cart-wrapper {
  @apply container bg-gray-100;
}
.cart-wrapper .cart-items {
} */
</style>
