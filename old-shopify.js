const client = function (query, variables) {
  console.log(this)
  return fetch(process.env.NUXT_STORE_API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': process.env.NUXT_STORE_ACCESS_TOKEN,
    },
    body: JSON.stringify({ query, variables: variables || null }),
  })
}

export default client
