<template>
  <div>
    <!-- <div :style="backgroundStyle" class="hero h-64">
      <div class="container h-full flex items-center text-white">
        <div class="title-content">
          <h1 class="text-6xl">{{ collection.title }}</h1>
        </div>
      </div>
    </div> -->
    <div class="container my-12 title-content">
      <div class="breadcrumbs">
        <nuxt-link to="/products">Products</nuxt-link>
        <nuxt-link :to="`/products/${collection.handle}`">{{
          collection.title
        }}</nuxt-link>
      </div>
      <h1 class="font-display font-semibold text-3xl lg:5xl mt-6">
        {{ collection.title }}
      </h1>
    </div>
    <div class="">
      <div class="container">
        <div
          class="grid gap-2 sm:gap-4 grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
        >
          <product-card
            v-for="product in collection.products.edges"
            :key="product.node.id"
            :product="product.node"
          ></product-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  async asyncData({ params, error, $client }) {
    const collectionQuery = `
      {
        collection: collectionByHandle(handle: "${params.collection}") {
          id
          title
          description
          handle
          image {
            src
            transformedSrc(crop: CENTER, maxHeight: 400, maxWidth: 800)
          }
          products(first: 10) {
            edges {
              node {
                id
                title
                description
                handle
                media(first: 1) {
                  edges {
                    node {
                      mediaContentType
                      ...on MediaImage {
                        alt
                        image {
                          src: transformedSrc(crop: CENTER, maxHeight: 400, maxWidth: 600)
                          height
                          width
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `
    try {
      const response = await $client(collectionQuery)
      const {
        data: { collection },
      } = await response.json()
      return {
        collection,
        backgroundStyle: {
          backgroundImage: `linear-gradient(45deg, #000, transparent), url(${collection.image.transformedSrc})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        },
      }
    } catch (err) {
      // eslint-disable-next-line
      console.log(err)
      error({ statusCode: 404, message: 'Page Not Found' })
    }
  },
  data() {
    return {}
  },
}
</script>

<style scoped></style>
