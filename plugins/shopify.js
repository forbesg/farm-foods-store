export default ({ app: { $config } }, inject) => {
  const client = function (query, variables) {
    return fetch($config.storeAPIEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': $config.storeAccessToken,
      },
      body: JSON.stringify({ query, variables: variables || null }),
    })
  }
  inject('client', client)
}
