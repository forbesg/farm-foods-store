<template>
  <div class="product-card relative">
    <div class="image-container">
      <img
        :src="product.media.edges[0].node.image.src"
        :alt="product.media.edges[0].node.alt"
        width="product.media.edges[0].node.image.width"
        height="product.media.edges[0].node.image.height"
      />
    </div>
    <div
      class="
        text-container
        absolute
        inset-0
        bg-black bg-opacity-50
        text-white
        flex flex-col
        justify-center
        items-center
        p-4
      "
    >
      <div class="text-container--content">
        <h3 class="text-lg font-semibold sm:text-xl">{{ product.title }}</h3>
        <p class="text-xs">
          {{ product.description }}
        </p>
      </div>
      <nuxt-link
        :to="`/products/${product.collections.edges[0].node.handle}/${product.handle}`"
        class="text text-xs font-semibold text-orange-500 mt-2"
        >Quick View</nuxt-link
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
.product-card .image-container {
  @apply h-full w-full;
  aspect-ratio: 3 / 2;
}
.product-card .image-container img {
  @apply h-full w-full object-cover;
}
.product-card .text-container .text-container--content {
  @apply transform translate-y-2 transition-all duration-200 text-center;
}
.product-card .text-container a {
  @apply opacity-0 transform translate-y-2 transition-all duration-200;
}
.product-card .text-container:hover .text-container--content {
  @apply transform translate-y-0 transition-all duration-200 text-center;
}
.product-card .text-container:hover a {
  @apply opacity-100 transform translate-y-0 delay-200;
}
</style>
