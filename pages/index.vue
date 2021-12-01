<template>
  <div class="">
    <div class="hero relative max-h-2/3 overflow-hidden">
      <div
        class="
          overlay
          absolute
          inset-0
          bg-black bg-opacity-50
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
              <logo class="w-24 h-24 md:w-48 md:h-48"></logo>
              <div class="flex flex-col mt-6">
                <h1
                  class="
                    brand-shadow
                    text-4xl
                    md:text-6xl
                    font-display font-semibold
                  "
                >
                  From Farm To Door
                </h1>
                <div class="brand-box my-6">
                  <h2 class="text-base md:text-xl font-semibold">
                    Locally Grown Food Delivery Service
                  </h2>
                  <nuxt-link to="/products" class="button text-white mt-4"
                    >View Our Produce</nuxt-link
                  >
                </div>
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

<style media="screen">
.brand-shadow {
  text-shadow: 0.035em 0.035em 0 #000;
}
.brand-box {
  @apply inline-block bg-white bg-opacity-75 text-orange p-6 text-center;
  backdrop-filter: blur(3px);
}
.hero {
  background-image: url(/food-banner.jpg);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  min-height: calc(70vh - 6rem);
}
</style>
