<template>
  <div class="container my-12">
    <h1 class="text-3xl font-display font-semibold">Checkout</h1>
    <div class="shipping-address my-6">
      <h2>Shipping Address</h2>
      <div class="bg-orange-50 bg-opacity-25 max-w-lg p-6 my-6">
        <form action="">
          <div class="form-group">
            <label for="firstName">First Name</label>
            <input id="firstName" type="text" />
          </div>
          <div class="form-group">
            <label for="lastName">Last Name</label>
            <input id="lastName" type="text" />
          </div>
          <div class="form-group">
            <label for="address1">Address Line 1</label>
            <input id="address1" type="text" />
          </div>
          <div class="form-group">
            <label for="address2">Address Line 2</label>
            <input id="address2" type="text" />
          </div>
          <div class="form-group">
            <label for="city">City</label>
            <input id="city" type="text" />
          </div>
          <div class="form-group">
            <label for="post_code">Post Code</label>
            <input id="post_code" type="text" />
          </div>
          <div class="form-group justify-end">
            <button type="submit" name="button">Continue To Payment</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style scoped></style>
