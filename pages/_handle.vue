<template>
  <div>
    <main class="container">
      <div class="my-12">
        <h1>{{ page.title }}</h1>
        <div class="page-body" v-html="page.body"></div>
        <!-- Clear fix to handle potential floated elements from page.body -->
        <div class="clearfix"></div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  async asyncData({ params: { handle }, $client, error }) {
    const handleQuery = `
      query($handle: String!) {
        page(handle: $handle) {
          title
          seo {
            title
            description
          }
          body
          handle
        }
      }
    `
    const variables = {
      handle,
    }
    try {
      const {
        data: { page },
      } = await $client(handleQuery, variables).then((res) => res.json())
      if (!page) {
        throw new Error('Page not found')
      }
      return {
        page,
      }
    } catch (err) {
      console.log(err)
      error({ statusCode: 404, message: 'Page Not Found' })
    }
  },
  data() {
    return {
      page: null,
    }
  },
}
</script>

<style lang="scss">
main {
  h1 {
    @apply font-display font-semibold text-3xl mb-6;
  }
  .page-body {
    h2 {
      @apply font-semibold;
    }
    p {
      @apply my-4;
    }
    img {
      @apply w-full;
      @screen md {
        @apply w-auto;
      }
    }
  }
}
</style>
