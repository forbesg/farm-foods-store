<template>
  <div class="notification">
    {{ notification.message }}
  </div>
</template>

<script>
export default {
  props: {
    notification: {
      type: Object /** { style: String, message: String  } **/,
      required: true,
    },
  },
}
</script>

<style scoped>
.notification {
  @apply fixed right-0 bottom-0 left-0 bg-orange-500 p-6 text-center z-20;
}
</style>
