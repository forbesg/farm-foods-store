<template>
  <div>
    <div class="container my-6 md:my-12">
      <div class="breadcrumbs">
        <nuxt-link to="/products">Products</nuxt-link>
        <nuxt-link :to="`/products/${collection.handle}`">{{
          collection.title
        }}</nuxt-link>
        <nuxt-link :to="`/products/${collection.handle}/${product.handle}`">{{
          product.title
        }}</nuxt-link>
      </div>
    </div>
    <div
      class="container grid lg:grid-cols-1 xl:grid-cols-2 mt-6 md:mt-12 xl:gap-6"
    >
      <div class="image-container">
        <img
          :src="selectedVariantImage ? selectedVariantImage.src : ''"
          :alt="selectedVariantImage ? selectedVariantImage.altText : ''"
          width="800"
          height="800"
        />
      </div>
      <div class="product-detail py-4 md:px-4 lg:p-6 xl:py-0">
        <h1 class="font-semibold text-3xl mb-4">{{ product.title }}</h1>
        <div v-html="product.descriptionHtml"></div>
        <add-to-cart
          :product="product"
          @setSelectedVariantImage="handleSetSelectedVariantImage"
        ></add-to-cart>
      </div>
    </div>
    <div class="other-products bg-green-100 mt-24 py-24">
      <div
        class="container grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        <div v-for="product in collectionProducts" :key="product.node.id">
          <product-card :product="product.node"></product-card>
        </div>
        <div class=""></div>
      </div>
    </div>
    <text-banner
      text="View all products in the"
      :link="{
        path: `/products/${collection.handle}`,
        text: `${collection.title} Collection`,
      }"
    ></text-banner>
  </div>
</template>

<script>
export default {
  async asyncData({ params, $client, error }) {
    const productQuery = `
      {
        product: productByHandle(handle: "${params.product}") {
          id
          title
          descriptionHtml
          handle
          seo {
            title
            description
          }
          variants(first: 10) {
            edges {
              cursor
              node {
                id
                title
                quantityAvailable
                priceV2 {
                  amount
                  currencyCode
                }
                image {
                  altText
                  src: transformedSrc(crop: CENTER, maxHeight: 600, maxWidth: 600)
                }
              }
            }
          }
          media(first: 1) {
            edges {
              node {
                mediaContentType
                ...on MediaImage {
                  image {
                    altText
                    src: transformedSrc(crop: CENTER, maxHeight: 600, maxWidth: 600)
                    height
                    width
                  }
                }
              }
            }
          }
        }
      }
    `
    const collectionQuery = `
      query {
        collection(handle: "${params.collection}") {
          title
          handle
          products(first: 5) {
            edges {
              node {
                id
                title
                handle
                media(first: 1) {
                  edges {
                    node {
                      mediaContentType
                      ...on MediaImage {
                        alt
                        image {
                          src: transformedSrc(crop: CENTER, maxHeight: 200, maxWidth: 300)
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
      const response = await $client(productQuery)
      const {
        data: { product },
      } = await response.json()
      const {
        data: { collection },
      } = await $client(collectionQuery).then((res) => res.json())
      return {
        product,
        collection,
        collectionProducts: collection.products.edges.filter((edge) => {
          return edge.node.id !== product.id
        }),
        selectedVariantImage: product.variants.edges[0].node.image,
        order: {
          quantity: 1,
          variant: product?.variants?.edges[0],
        },
      }
    } catch (err) {
      // eslint-disable-next-line
      console.log(err.message)
      error({ statusCode: 404, message: 'Page Not Found' })
    }
  },
  methods: {
    handleSetSelectedVariantImage(image) {
      this.selectedVariantImage = image
    },
  },
}
</script>

<style scoped>
.image-container {
  @apply w-full h-auto;
  aspect-ratio: 16 / 10;
}
@screen md {
  .image-container {
    aspect-ratio: 16 / 9;
  }
}

@screen xl {
  .image-container {
    @apply h-full;
    aspect-ratio: 1 / 1;
  }
}
@screen 2xl {
  .image-container {
    @apply h-full;
    aspect-ratio: 4 / 3;
  }
}
.image-container img {
  @apply w-full h-full object-cover;
}
.form-group {
  @apply flex flex-wrap items-center my-6;
}
.form-group > label {
  @apply font-semibold text-sm flex-none w-auto pr-4;
}
.form-group > input:not([type='radio']),
.form-group > select {
  @apply font-normal bg-gray-200 flex-1 px-4 py-2 outline-none;
}
.form-group > input:not([type='radio']):active,
.form-group > select:active {
  @apply outline-none;
}
.form-group .quantity-input-wrapper input[type='number'] {
  @apply bg-white flex-initial w-16 px-4 py-2 mx-1 text-center;
}
.form-group .quantity-input-wrapper input[type='number']:focus-visible {
  @apply bg-gray-100 outline-none;
}
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  appearance: none;
  margin: 0;
}
/* Firefox */
input[type='number'] {
  -moz-appearance: textfield;
}
</style>
