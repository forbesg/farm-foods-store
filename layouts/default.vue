<template id="layout">
  <div class="relative">
    <header class="sticky top-0 z-10 bg-white px-4">
      <div
        class="
          container
          bg-white
          relative
          mx-auto
          flex
          justify-between
          items-center
        "
      >
        <nuxt-link to="/" class="logo-container py-4">
          <logo class="w-12 h-12 md:w-16 md:h-16" />
        </nuxt-link>
        <nav class="flex items-center">
          <nuxt-link to="/">Home</nuxt-link>
          <nuxt-link to="/products">Products</nuxt-link>
          <nuxt-link
            v-for="page in pages"
            :key="page.node.id"
            :to="`/${page.node.handle}`"
            >{{ page.node.title }}</nuxt-link
          >
          <div class="icon-links ml-6">
            <nuxt-link to="/account" class="inline-block">
              <img src="~assets/icons/user.svg" alt="Account" />
            </nuxt-link>
            <nuxt-link to="#search" class="inline-block">
              <img src="~assets/icons/search.svg" alt="Search" />
            </nuxt-link>
            <span
              to="#cart"
              class="inline-block cursor-pointer relative"
              @click="handleShowCart"
            >
              <img src="~assets/icons/cart.svg" alt="Shopping Cart" />
              <span
                v-if="cart && cart.lines && cart.lines.edges.length"
                class="
                  bg-orange bg-opacity-75
                  flex
                  justify-center
                  items-center
                  text-black
                  w-5
                  h-5
                  rounded-full
                  font-bold
                  absolute
                  top-0
                  right-0
                  transform
                  -translate-y-1
                  translate-x-1
                "
                >{{ cart.lines.edges.length }}</span
              >
            </span>
          </div>
        </nav>
        <transition name="cartFlip">
          <cart v-if="cart && cart.lines.edges.length && showCart" />
        </transition>
      </div>
    </header>

    <Nuxt />
    <transition name="slideInRight">
      <quick-view-product
        v-if="quickViewProduct"
        :quick-product="quickViewProduct"
      ></quick-view-product>
    </transition>
    <footer class="h-48 mt-24">
      <div class="container">The Footer</div>
    </footer>
    <transition name="slideUp">
      <notification v-if="notification" :notification="notification" />
    </transition>
  </div>
</template>

<script>
export default {
  computed: {
    pages() {
      return this.$store.getters.pages
    },
    quickViewProduct() {
      return this.$store.getters.quickViewProduct
    },
    cart() {
      return this.$store.getters['cart/cart']
    },
    showCart() {
      return this.$store.getters.showCart
    },
    notification() {
      return this.$store.getters.notification
    },
  },
  watch: {
    $route(newRoute, oldRoute) {
      if (newRoute.path !== oldRoute.path) {
        this.$store.commit('setShowCart', false)
      }
    },
  },
  async mounted() {
    const localCart = window.localStorage.getItem('farmfoods:cart')
    const customerAccessToken = window.localStorage.getItem(
      'farmfoods:customer-accessToken'
    )
    if (customerAccessToken) {
      const credentials = JSON.parse(customerAccessToken)
      const customerQuery = `
        query($customerAccessToken: String!) {
          customer(customerAccessToken: $customerAccessToken) {
            id
            displayName
            email
            orders(first: 10) {
              edges {
                node {
                  id
                }
              }
            }
          }
        }
      `
      const {
        data: { customer, customerUserErrors },
      } = await this.$client(customerQuery, {
        customerAccessToken: credentials.accessToken,
      }).then((res) => res.json())
      if (customerUserErrors && customerUserErrors.length) {
        // eslint-disable-next-line
        console.log(customerUserErrors)
      }
      customer.accessToken = credentials.accessToken
      this.$store.dispatch('setUser', customer)
    }
    if (localCart) {
      // If there is an access token we can update the cart buyers identity
      const cart = JSON.parse(localCart)
      if (customerAccessToken) {
        const user = this.$store.getters.user
        const updateCartBuyersIdentityMutation = `
          mutation cartBuyerIdentityUpdate($cartId: ID!, $buyerIdentity: CartBuyerIdentityInput!) {
            cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) {
              cart {
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
                          id
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
                            transformedSrc(crop: CENTER, maxHeight: 200, maxWidth: 200)
                            altText
                          }
                        }
                      }
                    }
                  }
                }
              }
              userErrors {
                code
                field
                message
              }
            }
          }
        `
        const variables = {
          cartId: cart.id,
          buyerIdentity: {
            customerAccessToken: user.accessToken,
            email: user.email,
          },
        }
        const {
          data: { cartBuyerIdentityUpdate },
        } = await this.$client(
          updateCartBuyersIdentityMutation,
          variables
        ).then((res) => res.json())
        if (
          cartBuyerIdentityUpdate.userErrors &&
          cartBuyerIdentityUpdate.userErrors.length
        ) {
          // eslint-disable-next-line
          console.log(cartBuyerIdentityUpdate.userErrors[0].message)
          return
        }
        this.$store.commit('cart/updateCart', cartBuyerIdentityUpdate.cart)
      } else {
        this.$store.commit('cart/updateCart', cart)
      }
    }
  },
  methods: {
    handleShowCart() {
      this.$store.commit('setShowCart', !this.showCart)
    },
  },
}
</script>
