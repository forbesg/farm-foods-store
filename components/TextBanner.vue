<template>
  <div class="text-banner bg-green">
    <div class="container py-6 text-white text-center">
      <span class="text-sm sm:text-base"
        >{{ text }}
        <nuxt-link :to="link.path" class="brand">{{
          link.text
        }}</nuxt-link></span
      >
    </div>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      required: true,
    },
    link: {
      type: Object, // { path: String, text: String }
      required: true,
    },
  },
}
</script>
