<template>
  <div class="">
    <div class="hero relative overflow-hidden">
      <img
        src="/food-banner.jpg"
        alt="Farm Foods Delivery To Your Door"
        width="1600"
        height="1067"
        class="hero-image"
      />
      <div
        class="overlay absolute inset-0 text-white md:flex justify-start items-center"
      >
        <div class="h-full md:container md:h-auto">
          <div
            class="mx-auto h-full bg-black bg-opacity-0 flex items-center md:inline-block md:h-auto md:flex-grow-0"
          >
            <div
              class="relative grid md:flex items-center justify-center text-overlay inline-block p-6 md:p-12"
            >
              <div class="relative z-10 flex flex-col flex-0 max-w-xl">
                <h1
                  class="brand-shadow text-orange-400 text-sm mb-4 font-semibold"
                >
                  From Farm <span class="text-white">2</span> Door
                </h1>
                <h2
                  class="text-3xl mb-4 md:text-4xl 2xl:text-5xl font-display font-semibold"
                >
                  Locally Grown Food Delivery Service
                </h2>
                <h3 class="text-xl 2xl:text-2xl font-semibold mb-4">
                  Great Produce Without the Footprint
                </h3>
                <p class="mb-4">
                  The best local farmers supply freshly produced and locally
                  grown produce straight to your door. Better quality produce
                  with a lower carbon footprint.
                </p>
                <div class="mt-4">
                  <nuxt-link
                    to="/products"
                    class="button large text-white text-xl"
                    >Start Shopping</nuxt-link
                  >
                </div>
                <div class="mt-4">
                  <nuxt-link to="/our-suppliers" class="button text"
                    >View Our Suppliers</nuxt-link
                  >
                </div>
              </div>
              <div
                class="absolute lg:relative p-12 z-0 opacity-25 lg:opacity-75"
              >
                <img
                  src="~assets/images/logo.svg"
                  class="w-full h-full md:w-96 md:h-96"
                  width="200"
                  height="200"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <section>
      <div class="py-24">
        <div class="container">
          <h2 class="font-display font-semibold text-3xl mb-6">
            Featured Fresh Produce
          </h2>
        </div>
        <div class="w-screen lg:container">
          <div
            class="flex overflow-x-auto pb-10 hide-scrollbars lg:overflow-visible"
          >
            <div
              class="flex flex-nowrap space-x-4 lg:grid lg:grid-cols-3 xl:grid-cols-4 lg:gap-4 lg:ml-0 lg:space-x-0 md:ml-20 ml-4"
            >
              <div
                v-for="product in featuredProducts"
                :key="product.node.id"
                class="inline-block w-64 lg:w-full min-h-content"
              >
                <overlay-product-card
                  :product="product.node"
                  class="bg-white text-green-800 w-full max-w-xs"
                >
                  <div class="p-4">
                    <h3 class="text-base font-semibold mb-2">
                      {{ product.node.title }}
                    </h3>
                    <p class="text-sm">
                      {{ product.node.description }}
                    </p>
                    <nuxt-link
                      :to="`/products/${product.node.collections.edges[0].node.handle}/${product.node.handle}`"
                      class="inline-block text text-xs font-semibold text-orange-500 mt-4"
                      >View {{ product.node.title }}</nuxt-link
                    >
                  </div>
                </overlay-product-card>
              </div>
              <div class="block w-1 lg:hidden"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section>
      <pre>
        {{ collections }}
      </pre>
    </section>
  </div>
</template>

<script>
export default {
  async asyncData({ $client }) {
    const collectionsQuery = `
      query {
        collections(first: 10, query: "tag: Homepage" ) {
          edges {
            node {
              title
              handle
            }
          }
        }
      }
    `
    const {
      data: { collections },
    } = await $client(collectionsQuery).then((res) => res.json())
    return {
      collections,
    }
  },
  data() {
    return {
      collections: null,
    }
  },
  head() {
    return {
      link: [
        {
          rel: 'preload',
          as: 'image',
          href: `${this.$config.hostname}/food-banner.jpg`,
        },
      ],
    }
  },
  computed: {
    featuredProducts() {
      return this.$store.getters.featuredProducts
    },
  },
}
</script>

<style lang="scss" media="screen">
.brand-shadow {
  text-shadow: 0.035em 0.035em 0 #000;
}
.hero {
  // background-image: url(/food-banner.jpg);
  // background-repeat: no-repeat;
  // background-size: cover;
  // background-position: center;
  min-height: calc(100vh - var(--header-height));
  > .hero-image {
    min-height: calc(100vh - var(--header-height));
    @apply w-full object-cover;
  }
  @screen lg {
    @apply min-h-screen bg-fixed;
    > .hero-image {
      @apply min-h-screen;
    }
  }
  .overlay {
    background-color: rgba(#000, 0.5);
  }
}
</style>
