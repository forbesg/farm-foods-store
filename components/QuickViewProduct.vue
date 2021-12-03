<template>
  <div class="quick-view" @click="$store.dispatch('setQuickViewProduct', null)">
    <div class="inner-wrapper" @click.stop>
      <div v-if="product">
        <div class="image-container">
          <img :src="product.images.edges[0].node.transformedSrc" alt="" />
        </div>
        <h2 class="text-4xl mb-4">{{ product.title }}</h2>
        <p>{{ product.description }}</p>
        <add-to-cart
          :product="product"
          @productAdded="$store.dispatch('setQuickViewProduct', null)"
        ></add-to-cart>
        <!-- <pre>
          {{ product }}
        </pre> -->
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
      product: null,
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
                transformedSrc(crop: CENTER, maxWidth: 300, maxHeight: 300)
                altText
              }
            }
          }
          variants(first: 10) {
            edges {
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
        }
      }
    `
    const variables = {
      id: this.quickProduct.id,
    }
    const { data, errors } = await this.$client(query, variables).then((res) =>
      res.json()
    )
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
    this.product = data.product
  },
}
</script>

<style scoped>
.quick-view {
  @apply fixed inset-0 bg-black bg-opacity-25 z-30;
  backdrop-filter: blur(0.5rem);
}
.quick-view .inner-wrapper {
  @apply fixed top-0 right-0 bottom-0 bg-white p-6 overflow-x-hidden overflow-y-scroll;
  width: 90vw;
}
@screen md {
  .quick-view .inner-wrapper {
    @apply p-12;
    width: 32rem;
  }
}

.quick-view .inner-wrapper .image-container {
  @apply w-full h-auto mb-4;
  aspect-ratio: 4 / 3;
}

.quick-view .inner-wrapper .image-container img {
  @apply w-full h-full object-cover;
}
</style>
