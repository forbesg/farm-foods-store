<template>
  <div class="cart-table--row">
    <div
      v-if="line.node.merchandise"
      class="cart-items grid grid-cols-3 sm:grid-cols-4 md:gap-0 md:grid-cols-4"
    >
      <div
        class="
          image-container
          p-2
          md:py-6 md:px-4
          w-full
          h-auto
          md:h-full md:col-span-1
        "
      >
        <img
          :src="line.node.merchandise.image.transformedSrc"
          :alt="line.node.merchandise.image.altText"
          class="w-full h-full object-cover"
        />
      </div>
      <div class="product-details py-2 px-4 md:py-6 md:col-span-1">
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
      <div class="product-quantity py-6 px-4 md:col-span-1 text-center">
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
      <div class="remove-product py-6 px-4 text-right">
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

<style scoped></style>
