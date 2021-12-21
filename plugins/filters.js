import Vue from 'vue'

Vue.filter('formatDate', (value) => {
  const date = new Date(value)
  return date.toLocaleString(['en-GB'], {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  })
})

// Recieves a float value from shopify
Vue.filter('currency', (value) => {
  return `£${parseFloat(value).toFixed(2)}`
})

// Recieves a shopify handle value from shopify
Vue.filter('humanizeSlug', (value) => {
  const title = value
    .split('-')
    .map((c) => c.charAt(0).toUpperCase().concat(c.slice(1)))
    .join(' ')
  return title
})
