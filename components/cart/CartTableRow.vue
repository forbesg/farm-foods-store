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
          {{ line.node.merchandise.title }}
        </h2>
        <div class="divide-x divide-solid text-xs text-gray-400">
          <span class="inline-block px-2 my-2">Tag1</span>
          <span class="inline-block px-2 my-2">Tag2</span>
        </div>
        <span class="block font-semibold"
          >£{{
            parseFloat(line.node.estimatedCost.totalAmount.amount).toFixed(2)
          }}</span
        >
      </div>
      <div class="product-quantity">
        <select
          class="bg-white border border-gray-400 p-2 text-center"
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
          <img src="~assets/icons/expand.svg" alt="Expand" />
        </select>
      </div>
      <div class="remove-product">
        <div
          class="inline-block cursor-pointer"
          @click="handleRemoveLineItem(line.node.id)"
        >
          <img src="~assets/icons/close.svg" alt="Close" />
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
}
</script>

<style lang="scss" scoped>
.cart-table--row {
  .cart-item {
    display: grid;
    grid-template-columns: repeat(2, 1fr) 50px;
    grid-template-areas:
      'image details details'
      'image details details'
      'quantity quantity remove';
    @screen sm {
      grid-template-columns: repeat(5, 1fr);
      grid-template-areas:
        'image details details quantity remove'
        'image details details quantity remove';
    }
    > * {
      @apply p-4;
    }
    .image-container {
      grid-area: image;
      @apply p-4;
    }
    .product-details {
      grid-area: details;
    }
    .product-quantity {
      grid-area: quantity;
    }
    .remove-product {
      grid-area: remove;
      @apply text-right;
    }
  }
}
</style>
