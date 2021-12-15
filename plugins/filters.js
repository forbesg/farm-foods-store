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
