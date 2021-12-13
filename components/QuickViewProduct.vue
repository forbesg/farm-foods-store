<template>
  <div class="quick-view" @click="$store.dispatch('setQuickViewProduct', null)">
    <div class="inner-wrapper" @click.stop>
      <div v-if="product">
        <div class="image-container">
          <img
            :src="selectedVariantImage.src"
            :alt="selectedVariantImage.altText"
            width="300"
            height="200"
            :class="[{ loaded: imageLoaded }]"
            @load="handleImageLoaded"
          />
        </div>
        <h2 class="text-2xl md:text-4xl mb-4">{{ product.title }}</h2>
        <p class="mb-4">{{ product.description }}</p>
        <add-to-cart
          :product="product"
          @productAdded="$store.dispatch('setQuickViewProduct', null)"
          @setSelectedVariantImage="handleSetSelectedVariantImage"
        ></add-to-cart>
        <div class="text-center">
          <button
            type="button"
            name="button"
            class="flex justify-center items-center text mx-auto my-4"
            @click="$store.dispatch('setQuickViewProduct', null)"
          >
            <img
              src="~assets/icons/close.svg"
              alt="close icon"
              width="20"
              height="20"
              class="mr-1"
            />
            Close
          </button>
        </div>
      </div>
      <div v-else class="flex justify-center items-center w-full h-full">
        <loader />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    quickProduct: {
      required: true,
      type: Object,
    },
  },
  data() {
    return {
      imageLoaded: false,
      product: null,
      selectedVariantImage: { src: '', alt: '' },
      order: {
        variant: null,
        quantity: 1,
      },
    }
  },
  async fetch() {
    const query = `
      query ($id: ID!) {
        product (id: $id) {
          title
          description
          images(first: 1) {
            edges {
              node {
                id
                transformedSrc(crop: CENTER, maxWidth: 300, maxHeight: 200)
                altText
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                image {
                  altText
                  src: transformedSrc(crop: CENTER, maxWidth: 600, maxHeight: 400)
                }
                priceV2 {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    `
    const variables = {
      id: this.quickProduct.id,
    }
    const {
      data: { product },
      errors,
    } = await this.$client(query, variables).then((res) => res.json())
    if (errors) {
      errors.forEach((err) => {
        // eslint-disable-next-line
        console.log(err.message)
      })
      this.$store.dispatch('setQuickViewProduct', null)
      this.$store.dispatch('setNotification', {
        message: 'There was a problem retrieving product data',
      })
    }
    this.selectedVariantImage = product.variants.edges[0].node.image
    this.product = product
  },
  methods: {
    handleImageLoaded() {
      this.imageLoaded = true
    },
    handleSetSelectedVariantImage(image) {
      this.selectedVariantImage = image
    },
  },
}
</script>

<style lang="scss" scoped>
.quick-view {
  @apply fixed inset-0 bg-black bg-opacity-25 z-30;
  backdrop-filter: blur(0.5rem);
  .inner-wrapper {
    @apply fixed top-0 right-0 bottom-0 bg-white p-6 overflow-x-hidden overflow-y-scroll;
    width: 90vw;
    @screen md {
      @apply p-12;
      width: 32rem;
    }
    .image-container {
      @apply w-full h-auto mb-4;
      aspect-ratio: 3 / 2;
      img {
        @apply w-full h-full object-cover opacity-0 transition-opacity duration-200;
        &.loaded {
          @apply opacity-100;
        }
      }
    }
  }
}
// .quick-view .inner-wrapper {
//   @apply fixed top-0 right-0 bottom-0 bg-white p-6 overflow-x-hidden overflow-y-scroll;
//   width: 90vw;
// }
// @screen md {
//   .quick-view .inner-wrapper {
//     @apply p-12;
//     width: 32rem;
//   }
// }
//
// .quick-view .inner-wrapper .image-container {
//   @apply w-full h-auto mb-4;
//   aspect-ratio: 3 / 2;
// }
//
// .quick-view .inner-wrapper .image-container img {
//   @apply w-full h-full object-cover opacity-0;
// }
</style>
