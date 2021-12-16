<template>
  <div class="error">
    <div class="container my-12 py-24 h-full text-center divider">
      <h1 class="text-7xl text-green-800 font-display font-bold">404</h1>
      <h2 class="text-2xl mt-4">Page Not Found</h2>
      <nuxt-link to="/" class="button large my-12"
        >Back to the Homepage</nuxt-link
      >
    </div>
  </div>
</template>

<script>
export default {
  scrollToTop: true,
  head() {
    return {
      title: 'Page Not Found',
    }
  },
}
</script>
