<template>
  <div class="">
    <div class="hero relative min-h-screen overflow-hidden">
      <div
        class="
          overlay
          absolute
          inset-0
          text-white
          md:flex
          justify-start
          items-center
        "
      >
        <div class="h-full md:container md:h-auto">
          <div
            class="
              mx-auto
              h-full
              bg-black bg-opacity-0
              flex
              items-center
              md:inline-block md:h-auto md:flex-grow-0
            "
          >
            <div
              class="
                grid
                md:flex
                items-center
                justify-center
                text-overlay
                inline-block
                p-6
                md:p-12
              "
            >
              <div class="flex flex-col flex-0 mt-6 max-w-xl">
                <h1
                  class="
                    brand-shadow
                    text-orange-400 text-sm
                    mb-4
                    font-semibold
                  "
                >
                  From Farm <span class="text-white">2</span> Door
                </h1>
                <h2
                  class="text-3xl mb-4 md:text-4xl font-display font-semibold"
                >
                  Locally Grown Food Delivery Service
                </h2>
                <h3 class="text-xl mb-4">
                  Great Produce Without the Footprint
                </h3>
                <p class="mb-4">
                  The best local farmers supply freshly produced and locally
                  grown produce straight to your door. Better quality produce
                  with a lower carbon footprint.
                </p>
                <div class="flex items-center mt-4">
                  <nuxt-link to="/products" class="button text-white text-xl"
                    >Start Shopping</nuxt-link
                  >
                  <nuxt-link to="/our-suppliers" class="button text ml-6"
                    >View Our Suppliers</nuxt-link
                  >
                </div>
              </div>
              <div class="p-12">
                <logo class="w-24 h-24 md:w-48 md:h-48"></logo>
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
        <div
          class="
            container
            products
            grid grid-cols-1
            gap-4
            grid-cols-2
            sm:grid-cols-3
            md:grid-cols-4
            2xl:grid-cols-4
          "
        >
          <overlay-product-card
            v-for="product in featuredProducts"
            :key="product.node.id"
            :product="product.node"
          >
          </overlay-product-card>
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
  background-image: url(/food-banner.jpg);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  @screen lg {
    background-attachment: fixed;
  }
  .overlay {
    // background-color: rgba(var(--color-racing-green), 0.25);
    background-color: rgba(#000, 0.5);
  }
}
</style>
