<template id="layout">
  <div class="relative main-container">
    <header>
      <button
        type="button"
        name="button"
        class="absolute top-4 left-4 text lg:hidden"
        @click="handleNav"
      >
        <img
          v-if="!navOpen"
          src="~assets/icons/menu.svg"
          alt="Menu"
          aria-label="main menu"
          width="32"
          height="32"
        />
        <img
          v-else
          src="~assets/icons/close-white.svg"
          alt="Menu"
          aria-label="main menu"
          width="32"
          height="32"
        />
      </button>
      <nuxt-link to="/" class="logo-container">
        <img
          src="~assets/images/logo.svg"
          alt="Farm Food Store"
          width="200"
          height="200"
        />
      </nuxt-link>
      <button
        type="button"
        name="button"
        class="text absolute top-4 right-4 text lg:hidden"
        aria-label="main menu"
        @click="handleShowCart"
      >
        <img
          src="~assets/icons/cart.svg"
          alt="Shopping Cart"
          width="32"
          height="32"
        />
        <span
          v-if="cart && cart.lines && cart.lines.edges.length"
          class="bg-orange bg-opacity-75 flex justify-center items-center text-black w-5 h-5 rounded-full font-bold absolute top-0 right-0 transform translate-y-2 -translate-x-3"
          >{{ cart.lines.edges.length }}</span
        >
      </button>
      <div class="relative mx-auto" :class="[{ open: navOpen }]">
        <nuxt-link to="/" class="logo-container">
          <logo />
        </nuxt-link>
        <div class="m-12 mb-6">
          <hr />
        </div>
        <nav>
          <nuxt-link to="/" class="home">Home</nuxt-link>
          <nuxt-link to="/products">Products</nuxt-link>
          <nuxt-link
            v-for="page in pages"
            :key="page.node.id"
            :to="`/${page.node.handle}`"
            >{{ page.node.title }}</nuxt-link
          >
        </nav>
        <div class="m-12 mt-6">
          <hr />
        </div>
        <div class="icon-links">
          <nuxt-link to="/account">
            <img src="~assets/icons/user.svg" alt="Account" />
          </nuxt-link>
          <nuxt-link to="#search">
            <img src="~assets/icons/search.svg" alt="Search" />
          </nuxt-link>
          <nuxt-link to="/trolly" @click="handleShowCart">
            <img
              src="~assets/icons/shopping_trolly.svg"
              alt="Shopping Trolly"
            />
            <span
              v-if="cart && cart.lines && cart.lines.edges.length"
              class="bg-orange bg-opacity-75 flex justify-center items-center text-black w-5 h-5 rounded-full font-bold absolute top-0 right-0 transform -translate-y-1 -translate-x-1"
              >{{ cart.lines.edges.length }}</span
            >
          </nuxt-link>
        </div>
      </div>
    </header>
    <div class="relative z-0">
      <transition name="slideDownTrolly">
        <span
          v-if="
            cart &&
            cart.lines &&
            cart.lines.edges.length &&
            $route.path !== '/trolly' &&
            !showCart
          "
          class="hidden md:flex fixed top-0 right-0 z-20 cursor-pointer bg-green min-content h-12 pl-4 pr-8 justify-between items-center rounded-b text-white transform -translate-x-12 focus:hover:shadow-md active:shadow-none"
          @click.prevent.stop="handleShowCart"
        >
          <span class="mx-1">Trolly</span>
          <img src="~assets/icons/shopping_trolly.svg" alt="Shopping Trolly" />
          <span
            class="bg-orange bg-opacity-75 flex justify-center items-center text-black w-5 h-5 rounded-full font-bold absolute right-0 transform -translate-x-5 -translate-y-2"
          >
            {{ cart.lines.edges.length }}
          </span>
        </span>
      </transition>
      <div class="min-h-screen">
        <Nuxt />
      </div>
      <transition name="cartFlip">
        <cart v-if="cart && cart.lines.edges.length && showCart" />
      </transition>
      <footer>
        <div class="container">
          <div class="">
            <nav>
              <nuxt-link to="/" class="block my-4">Home</nuxt-link>
              <nuxt-link to="/products" class="block my-4">Products</nuxt-link>
              <nuxt-link
                v-for="page in pages"
                :key="page.node.id"
                :to="`/${page.node.handle}`"
                class="block my-4"
                >{{ page.node.title }}</nuxt-link
              >
            </nav>
          </div>
          <!-- <div class=""></div>
          <div class=""></div> -->
        </div>
      </footer>
    </div>
    <transition name="slideInRight">
      <quick-view-product
        v-if="quickViewProduct"
        :quick-product="quickViewProduct"
      ></quick-view-product>
    </transition>

    <transition name="slideUp">
      <notification v-if="notification" :notification="notification" />
    </transition>
  </div>
</template>

<script>
import fixBody from '@/plugins/fix-body.client.js'
export default {
  data() {
    return {
      navOpen: false,
    }
  },
  computed: {
    pages() {
      const pages = this.$store.getters.pages
      return pages
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
        this.navOpen = false
      }
    },
    quickViewProduct(value) {
      // If quick view is displayed, set document positioning to fixed
      fixBody(value)
    },
    // showCart(value) {
    //   // If cart is displayed, set document positioning to fixed
    //   fixBody(value)
    // },
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
        // if (!user) return
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
                            transformedSrc(crop: CENTER, maxHeight: 200, maxWidth: 300)
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
    handleNav() {
      this.navOpen = !this.navOpen
    },
    handleShowCart() {
      this.$store.commit('setShowCart', !this.showCart)
      this.navOpen = false
    },
  },
}
</script>

<style lang="scss" scoped>
.main-container {
  display: grid;
  position: relative;
  @apply min-h-screen;
  header {
    @apply bg-green-800 sticky top-0 text-white z-20;
    > .logo-container {
      @apply block w-20 h-20 py-4 mx-auto;
      svg,
      img {
        @apply block w-auto h-full mx-auto;
      }
    }
    > div {
      @apply fixed inset-0 top-20 transform -translate-x-full bg-green-800;
      &.open {
        @apply translate-x-0;
      }
      > .logo-container {
        @apply hidden;
      }
      nav {
        a {
          @apply block text-center text-gray-300 hover:text-white transition-colors duration-500 p-4;
          &:active {
            @apply font-semibold;
          }
          &.nuxt-link-exact-active {
            @apply text-orange font-bold;
          }
        }
      }
      .icon-links {
        @apply flex justify-center mx-auto;
        > a,
        > span {
          @apply inline-block cursor-pointer relative px-4;
        }
      }
    }
    hr {
      @apply border-orange;
    }
  }
  @screen lg {
    grid-template-columns: 340px 1fr;
    header {
      @apply bg-green-800 sticky top-0 text-white;
      > .logo-container {
        @apply hidden;
      }
      > div {
        @apply sticky top-0 transform-none px-12 py-1;
        > .logo-container {
          @apply block w-32 h-32 my-12 mx-auto;
          svg {
            @apply block w-auto h-full mx-auto;
          }
        }
      }
    }
  }
  footer {
    @apply bg-green-900 text-white py-12;
  }
}
</style>
