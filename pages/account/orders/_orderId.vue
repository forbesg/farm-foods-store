<template>
  <div class="container my-12 h-full">
    <div v-if="order && !$fetchState.pending" class="my-6">
      <h1 class="text-2xl font-display font-bold mb-12">
        Order &mdash; {{ order.name }}
      </h1>
      <div class="order-summary">
        <div class="">
          <div class="order-details sticky top-12 h-auto">
            <h3>Order Details</h3>
            <p>
              <span>Date of order:</span
              ><span>{{ order.processedAt | formatDate }}</span>
            </p>
            <p>
              <span>Order Number:</span><span>{{ order.orderNumber }}</span>
            </p>
            <p>
              <span>Sub-Total:</span
              ><span>{{ order.subtotalPriceV2.amount | currency }}</span>
            </p>
            <p>
              <span>Total:</span
              ><span>{{ order.totalPriceV2.amount | currency }}</span>
            </p>
            <p>
              <span>Payment Status:</span
              ><span>{{ order.financialStatus }}</span>
            </p>
            <p>
              <span>Order Status:</span
              ><span>{{ order.fulfillmentStatus }}</span>
            </p>
            <h3 class="mt-6">Shipping Details</h3>
            <p>
              <span>Name:</span
              ><span
                >{{ order.shippingAddress.firstName }}
                {{ order.shippingAddress.lastName }}</span
              >
            </p>
            <span>
              <span>Address: </span>
              <address>
                <span>{{ order.shippingAddress.address1 }} <br /></span>
                <span v-if="order.shippingAddress.address2"
                  >{{ order.shippingAddress.address2 }} <br
                /></span>
                <span>{{ order.shippingAddress.city }} <br /></span>
                <span>{{ order.shippingAddress.zip }} <br /></span>
              </address>
            </span>
          </div>
        </div>
        <div class="order-line-items">
          <h3>Your Order</h3>
          <div
            v-for="item in order.lineItems.edges"
            :key="item.node.id"
            class=""
          >
            <div class="image-container">
              <img
                :src="item.node.variant.image.src"
                :alt="item.node.variant.image.altText"
                loading="lazy"
              />
            </div>
            <div class="detail">
              <h3>{{ item.node.title }} - {{ item.node.variant.title }}</h3>
              <p>Quantity: {{ item.node.quantity }}</p>
              <p>
                Unit Price: {{ item.node.variant.priceV2.amount | currency }}
              </p>
              <p>
                Total Price:
                {{ item.node.originalTotalPrice.amount | currency }}
              </p>
            </div>
          </div>
        </div>
        <!-- <div class="">
          <h3>Shipping Address</h3>
          <p>
            <span>Name:</span
            ><span
              >{{ order.shippingAddress.firstName }}
              {{ order.shippingAddress.lastName }}</span
            >
          </p>
          <span>
            <span>Address: </span>
            <address>
              <span>{{ order.shippingAddress.address1 }} <br /></span>
              <span v-if="order.shippingAddress.address2"
                >{{ order.shippingAddress.address2 }} <br
              /></span>
              <span>{{ order.shippingAddress.city }} <br /></span>
              <span>{{ order.shippingAddress.zip }} <br /></span>
            </address>
          </span>
        </div> -->
        <!-- <div class="">
          <h3>Billing Address</h3>
          <p>
            <span>Order Date:</span><span>{{ order.processedAt }}</span>
          </p>
          <p>
            <span>Order Date:</span><span>{{ order.processedAt }}</span>
          </p>
        </div> -->
      </div>
    </div>
    <div v-else class="h-96 w-full flex justify-center items-center">
      <loader />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      order: null,
    }
  },
  async fetch() {
    const {
      query: { id },
    } = this.$nuxt.context
    const ordersQuery = `
      query($id: ID!) {
        order: node(id: $id) {
          ... on Order {
            id
            name
            orderNumber
            processedAt
            subtotalPriceV2 {
              amount
            }
            totalPriceV2 {
              amount
            }
            fulfillmentStatus
            financialStatus
            shippingAddress {
              firstName
              lastName
              address1
              address2
              city
              zip
            }
            lineItems(first: 250) {
              edges {
                node {
                  title
                  quantity
                  originalTotalPrice {
                    amount
                  }
                  variant {
                    title
                    priceV2 {
                      amount
                    }
                    image {
                      altText
                      src: transformedSrc(crop:CENTER,maxWidth:100,maxHeight:100)
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
      const {
        data: { order },
        errors,
      } = await this.$client(ordersQuery, {
        id,
      }).then((res) => res.json())
      if (errors) {
        throw new Error(errors[0].message)
      }
      this.order = order
    } catch (err) {
      // eslint-disable-next-line
      console.log(err)
    }
  },
  fetchOnServer: false,
}
</script>

<style lang="scss" scoped>
.order-summary {
  @apply bg-white p-6 grid gap-6 text-sm;
  @screen md {
    @apply p-12 gap-12 grid-cols-2;
  }
  @screen lg {
    @apply p-6 gap-6 grid-cols-1;
  }
  @screen xl {
    @apply p-12 gap-12 grid-cols-2;
  }
  @screen 2xl {
    @apply gap-24 grid-cols-3;
  }
  h3 {
    @apply text-base font-semibold mb-4;
  }
  p,
  span {
    @apply flex justify-between mb-1;
  }
  .order-line-items {
    @screen 2xl {
      @apply col-span-2;
    }
    > div {
      @apply grid gap-6 mb-4;
      grid-template-columns: 100px 1fr;
      h3 {
        @apply mb-2;
      }
      .image-container {
      }
      .detail {
        p {
          @apply text-xs;
          @screen md {
            @apply text-sm;
          }
        }
      }
    }
  }
}
</style>
