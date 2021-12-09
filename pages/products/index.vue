<template>
  <div>
    <div>
      <div class="container my-12">
        <div class="breadcrumbs">
          <nuxt-link to="/products">Products</nuxt-link>
        </div>
        <h1 class="font-display font-semibold text-3xl lg:5xl mt-6">
          Products
        </h1>
      </div>
      <div class="container">
        <div
          class="category-cards grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4"
        >
          <div
            v-for="(collection, index) in collections.edges"
            :key="collection.node.id"
            :image="collection.node.image ? collection.node.image : ''"
            :index="index"
            class="category-cards--card bg-white"
          >
            <div class="image-container">
              <img
                :src="collection.node.image.src"
                :alt="collection.node.image.altText"
                width="296"
                height="197"
                class="w-full h-full"
                loading="lazy"
              />
            </div>
            <div class="text-container p-4">
              <h2 class="font-semibold lg:text-lg mb-4">
                {{ collection.node.title }}
              </h2>
              <h3 class="text-xs sm:text-sm mb-8">
                {{ collection.node.description }}
              </h3>
              <nuxt-link
                :to="`/products/${collection.node.handle}`"
                class="brand capitalize text-sm"
                >View {{ collection.node.handle }}</nuxt-link
              >
            </div>
          </div>
        </div>
        <!-- <feature
          v-for="(collection, index) in collections.edges"
          :key="collection.node.id"
          :image="collection.node.image ? collection.node.image : ''"
          :index="index"
        >
          <div
            class="
              w-full
              h-full
              flex flex-col
              justify-center
              items-center
              text-center
              p-12
            "
            :class="[{ 'md:col-start-1 md:row-start-1': index % 2 }]"
          >
            <h2 class="text-2xl md:text-5xl mb-4">
              {{ collection.node.title }}
            </h2>
            <h3 class="text-base md:text-xl mb-8">
              {{ collection.node.description }}
            </h3>
            <nuxt-link
              :to="`/products/${collection.node.handle}`"
              class="brand capitalize"
              >View {{ collection.node.handle }}</nuxt-link
            >
          </div>
        </feature> -->
      </div>
    </div>
  </div>
</template>

<script>
const collectionQuery = `
  {
    collections(first: 2) {
      edges {
        node {
          id
          title
          description
          handle
          image {
            src: transformedSrc(crop: CENTER, maxHeight: 400, maxWidth: 600)
            altText
          }
          products(first: 5) {
            edges {
              node {
                id
                title
              }
            }
          }
        }
      }
    }
  }
`
export default {
  async asyncData({ $client, error }) {
    try {
      const response = await $client(collectionQuery)
      const {
        data: { collections },
      } = await response.json()
      return {
        collections,
      }
    } catch (err) {
      error({ statusCode: 404, message: err.message })
    }
  },
}
</script>

<style scoped></style>
