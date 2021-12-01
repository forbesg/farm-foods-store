<template>
  <div class="feature">
    <div class="grid sm:grid-cols-2">
      <div class="image-container">
        <img
          v-if="image"
          :src="image.transformedSrc"
          alt="image.alt"
          class="w-full h-full"
        />
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    image: {
      type: Object,
      required: true,
    },
    index: {
      type: Number,
      required: false,
    },
  },
  data() {
    return {}
  },
}
</script>

<style scoped>
.feature .image-container {
  @apply w-full h-full;
  aspect-ratio: 16 / 10;
}
.feature .image-container img {
  @apply w-full h-full object-cover;
}
</style>
