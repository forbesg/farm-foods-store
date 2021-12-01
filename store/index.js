export const state = () => ({
  featuredProducts: null,
  showCart: false,
  notification: null,
  user: null,
  quickViewProduct: null,
})
export const mutations = {
  addFeaturedProducts(state, payload) {
    state.featuredProducts = payload
  },
  setQuickViewProduct(state, product) {
    state.quickViewProduct = product
  },
  setShowCart(state, payload) {
    state.showCart = payload
  },
  setNotification(state, notification) {
    state.notification = notification
  },
  setUser(state, customer) {
    state.user = customer
  },
}
export const actions = {
  async nuxtServerInit({ commit }, { $client }) {
    const query = `
      {
        products(first: 5) {
          edges {
            node {
              id
              title
              description
              handle
              seo {
                title
                description
              }
              totalInventory
              collections(first: 1) {
                edges {
                  node {
                    handle
                  }
                }
              }
              media(first: 1) {
                edges {
                  node {
                    mediaContentType
                    ...on MediaImage {
                      alt
                      image {
                        src: transformedSrc(crop: CENTER, maxWidth: 400, maxHeight: 400)
                        height
                        width
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `
    try {
      const response = await $client(query)
      const {
        data: { products },
      } = await response.json()
      commit('addFeaturedProducts', products.edges)
    } catch (err) {
      // eslint-disable-nextline
      console.log(err)
    }
  },
  setUser({ commit }, customer) {
    commit('setUser', customer)
  },
  setQuickViewProduct({ commit }, product) {
    commit('setQuickViewProduct', product)
  },
  setNotification({ commit }, notification) {
    commit('setNotification', notification)
    setTimeout(() => commit('setNotification', null), 3000)
  },
}

export const getters = {
  featuredProducts(state) {
    return state.featuredProducts
  },
  quickViewProduct(state) {
    return state.quickViewProduct
  },
  showCart(state) {
    return state.showCart
  },
  notification(state) {
    return state.notification
  },
  user(state) {
    return state.user
  },
}
