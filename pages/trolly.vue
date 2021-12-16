<template>
  <div>
    <div class="container">
      <h1 class="my-12 text-3xl font-display font-semibold">
        Your Shopping Trolly
      </h1>
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
          class="grid md:grid-cols-1 md:grid-rows-1 md:gap-6 lg:grid-cols-2 xl:grid-cols-3"
        >
          <div class="lg:col-span-2 divide-y divide-solid">
            <cart-table-row
              v-for="line in cart.lines.edges"
              :key="line.node.id"
              :line="line"
              class=""
            ></cart-table-row>
          </div>
          <div
            class="order-summary my-12 md:mt-0 md:col-start-3 md:row-start-1 lg:col-span-2 lg:col-start-1 lg:row-start-auto xl:col-start-3"
          >
            <div
              class="order-summary-inner sticky top-32 bg-orange-50 bg-opacity-25 p-6"
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
                  class="flex justify-between items-center font-semibold text-lg py-4"
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
                <nuxt-link to="/checkout" class="button">Checkout</nuxt-link>
                <!-- <a :href="cart.checkoutUrl" class="button">Checkout</a> -->
              </div>
            </div>
          </div>
        </div>

        <div v-else class="flex justify-center items-center">
          <div class="w-full bg-orange-50 bg-opacity-25 p-24 text-center">
            <p class="text-2xl mb-4">Your trolly is empty</p>
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
      errors: [],
    }
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
  computed: {
    cart() {
      return this.$store.getters['cart/cart']
    },
  },
  fetchOnServer: false,
}
</script>
