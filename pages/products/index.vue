<template>
  <div>
    <div>
      <div class="container my-12">
        <h1 class="font-display font-semibold text-5xl">Products</h1>
      </div>
      <div class="container my-24">
        <div
          class="
            category-cards
            grid
            md:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-4
            lg:gap-6
          "
        >
          <div
            v-for="(collection, index) in collections.edges"
            :key="collection.node.id"
            :image="collection.node.image ? collection.node.image : ''"
            :index="index"
            class="category-cards--card"
          >
            <div class="image-container">
              <img
                :src="collection.node.image.src"
                alt="collection.node.image.altText"
                width="296"
                height="197"
                loading="lazy"
              />
            </div>
            <div class="text-container py-4">
              <h2 class="text-2xl lg:text-2xl mb-4">
                {{ collection.node.title }}
              </h2>
              <h3 class="text-base mb-8">
                {{ collection.node.description }}
              </h3>
              <nuxt-link
                :to="`/products/${collection.node.handle}`"
                class="brand capitalize"
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
            src
            transformedSrc(crop: CENTER, maxHeight: 400, maxWidth: 600)
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
