import fetch from 'isomorphic-fetch'
const pagesQuery = `
  query {
    pages(first: 10) {
      edges {
        node {
          handle
        }
      }
    }
  }
`
const storeUrl =
  process.env.NUXT_STORE_URL || 'https://test-storefront-store.myshopify.com'
const storeAPIEndpoint =
  process.env.NUXT_STORE_API_ENDPOINT ||
  'https://test-storefront-store.myshopify.com/api/2021-10/graphql.json'
const storeAccessToken =
  process.env.NUXT_STORE_ACCESS_TOKEN || 'e06866f44ba45b337c4d2802d30b8e78'

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  target: 'static',
  server: {
    host: '0.0.0.0',
  },
  loading: {
    color: '#F17621', //Orange
    background: '#000',
  },
  head: {
    title: 'TestStorefront',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
      { name: 'theme-color', content: '#0a231e' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: true,
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Lato:wght@400;700&family=Montserrat:wght@400;500;600&display=swap',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/icon?family=Material+Icons',
      },
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['@/assets/css/style.scss', '@/assets/css/forms.scss'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ['@/plugins/shopify'],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // router: {
  //   middleware: 'signedInUser',
  // },

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
  ],

  // tailwindcss: {
  //   jit: process.env.NODE_ENV === 'development',
  // },
  publicRuntimeConfig: {
    storeUrl,
    storeAPIEndpoint,
    storeAccessToken,
  },

  generate: {
    routes() {
      return fetch(storeAPIEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': storeAccessToken,
        },
        body: JSON.stringify({ query: pagesQuery }),
      })
        .then((res) => {
          return res.json()
        })
        .then(({ data: { pages } }) => {
          return pages.edges.map((page) => page.node.handle)
        })
    },
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
}
