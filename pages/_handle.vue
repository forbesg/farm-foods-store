<template>
  <div>
    <div class="container lg:my-24">
      <main>
        <h1>{{ page.title }}</h1>
        <div class="page-body" v-html="page.body"></div>
        <!-- Clear fix to handle potential floated elements from page.body -->
        <div class="clearfix"></div>
      </main>
    </div>
  </div>
</template>

<script>
export default {
  async asyncData({ app, params: { handle }, $client, error }) {
    console.log(app)
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
      console.log(page)
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
    @apply text-4xl;
  }
  .page-body {
    h2 {
    }
  }
}
</style>
