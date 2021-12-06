<template>
  <div class="product-card">
    <div class="image-container relative">
      <img
        :src="product.media.edges[0].node.image.src"
        :alt="product.media.edges[0].node.alt"
        width="product.media.edges[0].node.image.width"
        height="product.media.edges[0].node.image.height"
      />
      <button
        class="quick-view absolute right-0 bottom-0"
        @click="$store.dispatch('setQuickViewProduct', product)"
      >
        <img src="~assets/icons/add.svg" alt="Quick Add" />
      </button>
    </div>
    <div class="text-container">
      <h3 class="font-semibold lg:text-lg mb-4">{{ product.title }}</h3>
      <p class="text-xs sm:text-sm">
        {{ product.description }}
      </p>
      <nuxt-link
        :to="`/products/${$route.params.collection}/${product.handle}`"
        class="inline-block brand text-sm capitalize mt-4"
        >{{ product.handle }}</nuxt-link
      >
    </div>
  </div>
</template>

<script>
export default {
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
}
</script>

<style scoped>
.product-card {
  @apply bg-white;
}
.product-card .image-container {
  aspect-ratio: 3 / 2;
}
.product-card .image-container img {
  @apply w-full h-full;
}
.product-card .text-container {
  @apply p-4;
}
</style>
