<template>
  <div class="product-card relative">
    <div class="image-container relative">
      <img
        :src="product.media.edges[0].node.image.src"
        :alt="product.media.edges[0].node.image.altText"
        :width="product.media.edges[0].node.image.width"
        :height="product.media.edges[0].node.image.height"
        :class="[{ loaded: imageLoaded }]"
        @load="handleImageLoaded"
      />
      <div
        class="text-container absolute inset-0 bg-black bg-opacity-50 text-white flex flex-col justify-center items-center p-4"
      >
        <div class="text-container--content">
          <h3 class="text-lg font-semibold sm:text-xl">{{ product.title }}</h3>
        </div>
      </div>
    </div>
    <slot />
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
  data() {
    return {
      imageLoaded: false,
    }
  },
  methods: {
    handleImageLoaded() {
      this.imageLoaded = true
    },
  },
}
</script>

<style lang="scss" scoped>
.product-card {
  .image-container {
    @apply h-full w-full;
    aspect-ratio: 3 / 2;
    img {
      @apply h-full w-full object-cover opacity-0 transition-all duration-200;
      &.loaded {
        @apply opacity-100;
      }
    }
  }
  .text-container .text-container--content {
    @apply text-center;
  }
}
</style>
