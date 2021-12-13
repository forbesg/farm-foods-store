<template>
  <div class="product-card">
    <div class="image-container relative">
      <img
        :src="collection.image.src"
        :alt="collection.image.altText"
        :width="collection.image.width"
        :height="collection.image.height"
        :loading="index < 4 ? 'eager' : 'lazy'"
        :class="[{ loaded: imageLoaded }]"
        @load="handleImageLoad"
      />
    </div>
    <div class="text-container">
      <h2 class="font-semibold lg:text-lg">{{ collection.title }}</h2>
      <p v-if="collection.description" class="text-xs sm:text-sm my-4">
        {{ collection.description }}
      </p>
      <nuxt-link
        :to="`/products/${collection.handle}`"
        class="inline-block brand text-sm capitalize mt-4"
        >{{ collection.handle }}</nuxt-link
      >
    </div>
  </div>
</template>

<script>
export default {
  props: {
    collection: {
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

//
<style lang="scss" scoped>
// .product-card {
//   @apply bg-white;
//   .image-container {
//     aspect-ratio: 3 / 2;
//     overflow: hidden;
//
//     img {
//       @apply w-full h-full opacity-0 transition-all duration-200;
//       &.loaded {
//         @apply opacity-100;
//       }
//     }
//
//     &:hover {
//       img.loaded {
//         @apply scale-105;
//       }
//     }
//   }
//   .text-container {
//     @apply p-4;
//   }
// }
//
</style>
