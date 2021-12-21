<template>
  <div class="cart-table--row">
    <div v-if="line.node.merchandise" class="cart-item">
      <div class="image-container">
        <img
          :src="line.node.merchandise.image.transformedSrc"
          :alt="line.node.merchandise.image.altText"
          class="w-full h-full object-cover"
        />
      </div>
      <div class="product-details">
        <h2 class="font-semibold">
          {{ line.node.merchandise.product.title }} -
          {{ line.node.merchandise.title }}
        </h2>
        <div class="divide-x divide-solid text-xs text-gray-400">
          <span class="inline-block px-2 my-2">Tag1</span>
          <span class="inline-block px-2 my-2">Tag2</span>
        </div>
        <span class="block font-semibold">{{
          line.node.estimatedCost.totalAmount.amount | currency
        }}</span>
      </div>
      <div class="product-quantity">
        <div class="select-container">
          <select
            class="bg-white border border-gray-400"
            name="quantity"
            @change="(e) => handleQuantityChange(e, line.node.id)"
          >
            <option
              v-for="num in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
              :key="num"
              :value="num"
              :selected="line.node.quantity === num"
            >
              {{ num }}
            </option>
          </select>
        </div>
      </div>
      <div class="remove-product">
        <div
          class="inline-block cursor-pointer"
          @click="handleRemoveLineItem(line.node.id)"
        >
          <img
            v-if="removingItem"
            src="~assets/icons/hourglass.svg"
            alt="deleting item"
            class="flip"
          />
          <img v-else src="~assets/icons/delete.svg" alt="delete" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    line: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      removingItem: false,
    }
  },
  methods: {
    async handleQuantityChange(e, id) {
      await this.$store.dispatch('cart/updateCartLine', {
        id,
        newQuantity: parseInt(e.target.value, 10),
      })
      this.$store.dispatch('setNotification', {
        message: `Your cart has been updated`,
      })
    },
    async handleRemoveLineItem(id) {
      this.removingItem = true
      await this.$store.dispatch('cart/removeFromCart', id)
      this.removingItem = false
    },
  },
}
</script>

<style lang="scss" scoped>
.cart-table--row {
  .cart-item {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-areas:
      'image details'
      'image details'
      'quantity remove';
    grid-gap: 1rem;
    padding: 0.5rem;
    @screen xs {
      grid-template-areas:
        'image image'
        'details details'
        'quantity remove';
      padding: 1rem;
    }
    @screen sm {
      grid-template-columns: repeat(5, 1fr);
      grid-template-areas:
        'image details details quantity remove'
        'image details details quantity remove';
      @apply p-4;
    }
    .image-container {
      grid-area: image;
      img {
        @apply h-auto;
        aspect-ratio: 4 / 3;
        @screen sm {
          aspect-ratio: 4 / 3;
        }
        @screen md {
          aspect-ratio: 1 / 1;
        }
        @screen lg {
          aspect-ratio: 4 / 3;
        }
      }
    }
    .product-details {
      grid-area: details;
    }
    .product-quantity {
      grid-area: quantity;
      .select-container {
        @apply relative bg-white;
        &:after {
          content: '';
          background-image: url(~assets/icons/expand.svg);
          background-repeat: no-repeat;
          background-size: cover;
          background-position: center;
          @apply absolute right-0 top-0 transform translate-y-2 -translate-x-2 block h-4 w-4 z-0;
        }
        select {
          @apply relative z-10 inline-block bg-transparent border-gray-200 w-full;
          -webkit-appearance: none;
          appearance: none;
          padding: 0.25rem 15%;
          &:active,
          &:focus-visible {
            @apply outline-none;
          }
        }
      }
    }
    .remove-product {
      grid-area: remove;
      @apply text-right;
      @keyframes flip {
        from {
          transform: rotateX(0);
        }
        50% {
          transform: rotateX(180deg);
        }
        to {
          transform: rotateX(360deg);
        }
      }
      img.flip {
        animation: flip 2s linear infinite;
      }
    }
  }
}
</style>
