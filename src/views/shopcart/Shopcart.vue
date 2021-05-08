<template>
  <div class="cart">
    <nav-bar class="nar-bar">
      <div slot="center">购物车({{cartLength}})</div>
    </nav-bar>
    <shop-cart-list/>
    <cart-bottom-bar/>
  </div>
</template>

<script>
import NavBar from "@/components/common/navbar/NavBar";
import ShopCartList from "@/views/shopcart/childComps/ShopCartList";
import CartBottomBar from "@/views/shopcart/childComps/CartBottomBar";

import {mapGetters} from "vuex"


export default {
  name: "Shopcart",
  components: {
    NavBar,
    ShopCartList,
    CartBottomBar
  },
  computed: {
    ...mapGetters(['cartLength'])

  }
}
</script>

<style scoped>
.cart {
  position: relative;
  height: 100vh;
}

.nar-bar {
  background-color: var(--color-tint);
  color: #fff;
}

/*.content {*/
/*  overflow: hidden;*/

/*  position: absolute;*/
/*  top: 44px;*/
/*  bottom: 49px;*/
/*  left: 0;*/
/*  right: 0;*/
/*}*/
</style>
