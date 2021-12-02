export const state = () => ({
  pages: null,
  featuredProducts: null,
  showCart: false,
  notification: null,
  // notification: {
  //   style: '',
  //   message: 'This is a notification message',
  // },
  user: null,
  quickViewProduct: null,
})
export const mutations = {
  setPages(state, pages) {
    state.pages = pages
  },
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
        products(first: 4) {
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
    const pagesQuery = `
      query {
        pages(first: 10) {
          edges {
            node {
              id
              title
              handle
            }
          }
        }
      }
    `

    try {
      const {
        data: { pages },
      } = await $client(pagesQuery).then((res) => res.json())
      const {
        data: { products },
      } = await $client(query).then((res) => res.json())
      commit('setPages', pages.edges)
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
  pages(state) {
    return state.pages
  },
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
