<template>
  <div class="py-4 lg:py-24">
    <div class="container grid md:grid-cols-2 md:mt-12">
      <div class="image-container">
        <img
          :src="product.media.edges[0].node.image.src"
          :alt="product.media.edges[0].node.alt"
          width="800"
          height="800"
        />
      </div>
      <div class="product-detail py-4 lg:p-6">
        <h1 class="font-semibold text-3xl mb-4">{{ product.title }}</h1>
        <div v-html="product.descriptionHtml"></div>
        <add-to-cart :product="product"></add-to-cart>
      </div>
    </div>
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
              }
            }
          }
          media(first: 1) {
            edges {
              node {
                mediaContentType
                ...on MediaImage {
                  alt
                  image {
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
    try {
      const response = await $client(productQuery)
      const {
        data: { product },
      } = await response.json()
      return {
        product,
        backgroundStyle: {
          backgroundImage: `linear-gradient(45deg, #000 50%, transparent), url(${product.media.edges[0].node.image.transformedSrc})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        },
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
}
</script>

<style scoped>
.image-container {
  @apply w-full h-full;
  aspect-ratio: 16 / 10;
}
@screen lg {
  .image-container {
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
