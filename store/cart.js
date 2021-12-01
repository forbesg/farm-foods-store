export const state = () => ({
  cart: null,
})

export const mutations = {
  updateCart(state, cart) {
    state.cart = cart
  },
  resetCart(state) {
    state.cart = null
  },
}

export const actions = {
  async addToCart({ commit, state }, lines) {
    /* If there is no cart we need to set one up and save it's detail to localStorage */
    if (!state.cart) {
      const query = `
        mutation cartCreate($cartInput: CartInput) {
          cartCreate(input: $cartInput) {
            cart {
              id
              checkoutUrl
              estimatedCost {
                subtotalAmount {
                  amount
                  currencyCode
                }
                totalAmount {
                  amount
                  currencyCode
                }
              }
              lines(first: 100) {
                edges {
                  node {
                    id
                    quantity
                    estimatedCost {
                      totalAmount {
                        amount
                        currencyCode
                      }
                    }
                    merchandise {
                      ... on ProductVariant {
                        id
                        title
                        priceV2 {
                          amount
                          currencyCode
                        }
                        product {
                          id
                          title
                        }
                        image {
                          transformedSrc(crop: CENTER, maxHeight: 200, maxWidth: 300)
                          altText
                        }
                      }
                    }
                  }
                }
              }
            }
            userErrors {
              code
              field
              message
            }
          }
        }
      `
      const variables = {
        cartInput: {
          ...lines,
          buyerIdentity: {
            customerAccessToken: this.state.user
              ? this.state.user.accessToken
              : null,
            email: this.state.user ? this.state.user.email : null,
          },
        },
      }

      const {
        data: {
          cartCreate: { cart, userErrors },
        },
      } = await this.$client(query, variables).then((res) => res.json())
      if (userErrors && userErrors.length) {
        return { errors: userErrors }
      }
      commit('updateCart', cart)
      window.localStorage.setItem('farmfoods:cart', JSON.stringify(cart))
      return cart
    } else {
      // We have a cart already so we will use this
      const { id } = state.cart
      const query = `
        mutation cartLinesAdd($lines: [CartLineInput!]!, $cartId: ID!) {
          cartLinesAdd(lines: $lines, cartId: $cartId) {
            cart {
              id
              checkoutUrl
              estimatedCost {
                subtotalAmount {
                  amount
                  currencyCode
                }
                totalAmount {
                  amount
                  currencyCode
                }
              }
              lines(first: 100) {
                edges {
                  node {
                    id
                    quantity
                    estimatedCost {
                      totalAmount {
                        amount
                        currencyCode
                      }
                    }
                    merchandise {
                      ... on ProductVariant {
                        id
                        title
                        priceV2 {
                          amount
                          currencyCode
                        }
                        product {
                          id
                          title
                        }
                        image {
                          transformedSrc(crop: CENTER, maxHeight: 200, maxWidth: 300)
                          altText
                        }
                      }
                    }
                  }
                }
              }
            }
            userErrors {
              code
              field
              message
            }
          }
        }
      `

      const variables = {
        ...lines,
        cartId: id,
      }
      const {
        data: {
          cartLinesAdd: { cart, userErrors },
        },
      } = await this.$client(query, variables).then((res) => res.json())
      if (userErrors && userErrors.length) {
        return { errors: userErrors }
      }
      commit('updateCart', cart)
      window.localStorage.setItem('farmfoods:cart', JSON.stringify(cart))
      return { cart }
    }
  },

  async removeFromCart({ commit, state }, merchandiseId) {
    const query = `
      mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
        cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
          cart {
            id
            checkoutUrl
            estimatedCost {
              subtotalAmount {
                amount
                currencyCode
              }
              totalAmount {
                amount
                currencyCode
              }
            }
            lines(first: 100) {
              edges {
                node {
                  id
                  quantity
                  estimatedCost {
                    totalAmount {
                      amount
                      currencyCode
                    }
                  }
                  merchandise {
                    ... on ProductVariant {
                      id
                      title
                      priceV2 {
                        amount
                        currencyCode
                      }
                      product {
                        id
                        title
                      }
                      image {
                        transformedSrc(crop: CENTER, maxHeight: 200, maxWidth: 300)
                        altText
                      }
                    }
                  }
                }
              }
            }
          }
          userErrors {
            code
            field
            message
          }
        }
      }
    `
    const variables = {
      cartId: state.cart.id,
      lineIds: [merchandiseId],
    }
    const {
      data: {
        cartLinesRemove: { cart, userErrors },
      },
    } = await this.$client(query, variables).then((res) => res.json())

    if (userErrors && userErrors.length) {
      return { errors: userErrors }
    }
    commit('updateCart', cart)
    window.localStorage.setItem('farmfoods:cart', JSON.stringify(cart))
    return { cart }
  },

  async updateCartLine({ commit, state }, payload) {
    const { id, newQuantity } = payload
    const query = `
      mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
        cartLinesUpdate(cartId: $cartId, lines: $lines) {
          cart {
            id
            checkoutUrl
            estimatedCost {
              subtotalAmount {
                amount
                currencyCode
              }
              totalAmount {
                amount
                currencyCode
              }
            }
            lines(first: 100) {
              edges {
                node {
                  id
                  quantity
                  estimatedCost {
                    totalAmount {
                      amount
                      currencyCode
                    }
                  }
                  merchandise {
                    ... on ProductVariant {
                      id
                      title
                      priceV2 {
                        amount
                        currencyCode
                      }
                      product {
                        id
                        title
                      }
                      image {
                        transformedSrc(crop: CENTER, maxHeight: 200, maxWidth: 300)
                        altText
                      }
                    }
                  }
                }
              }
            }
          }
          userErrors {
            code
            field
            message
          }
        }
      }
    `
    const variables = {
      cartId: state.cart.id,
      lines: [
        {
          id,
          quantity: newQuantity,
        },
      ],
    }
    const {
      data: {
        cartLinesUpdate: { cart, userErrors },
      },
    } = await this.$client(query, variables).then((res) => res.json())
    // const response = await this.$client(query, variables).then((res) => res.json())

    if (userErrors && userErrors.length) {
      return { errors: userErrors }
    }
    commit('updateCart', cart)
    window.localStorage.setItem('farmfoods:cart', JSON.stringify(cart))
    return { cart }
  },
  resetCart({ commit }) {
    commit('resetCart')
  },
}

export const getters = {
  cart(state) {
    return state.cart
  },
}
