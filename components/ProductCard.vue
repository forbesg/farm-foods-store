<template>
  <div class="product-card">
    <div class="image-container relative">
      <img
        :src="product.media.edges[0].node.image.src"
        :alt="product.media.edges[0].node.image.altText"
        :width="product.media.edges[0].node.image.width"
        :height="product.media.edges[0].node.image.height"
        :loading="index < 4 ? 'eager' : 'lazy'"
        :class="[{ loaded: imageLoaded }]"
        @load="handleImageLoad"
      />
      <!-- <button
        class="quick-view absolute right-0 bottom-0"
        @click="$store.dispatch('setQuickViewProduct', product)"
      >
        <img src="~assets/icons/add.svg" alt="Quick Add" />
      </button> -->
      <button
        class="quick-view-button"
        @click="$store.dispatch('setQuickViewProduct', product)"
      >
        <img src="~assets/icons/add.svg" alt="Quick Add" class="h-4 w-4" />
        Quick Add
      </button>
    </div>
    <div class="text-container">
      <h2 class="font-semibold lg:text-lg">{{ product.title }}</h2>
      <p v-if="product.description" class="text-xs sm:text-sm my-4">
        {{ product.description }}
      </p>
      <nuxt-link
        :to="`/products/${$route.params.collection}/${product.handle}`"
        class="inline-block brand text-sm capitalize mt-4"
        >{{ product.handle | humanizeSlug }}</nuxt-link
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
    index: {
      type: Number,
      required: false,
      default: 100,
    },
  },
  data() {
    return {
      imageLoaded: false,
    }
  },
  methods: {
    handleImageLoad() {
      this.imageLoaded = true
    },
  },
}
</script>

<style lang="scss" scoped>
button,
.button {
  &.quick-view-button {
    @apply absolute bottom-0 right-0 flex items-center bg-none bg-white bg-opacity-75 border border-orange border-opacity-50 text-sm transform -translate-x-2 -translate-y-2;
  }
}
</style>
