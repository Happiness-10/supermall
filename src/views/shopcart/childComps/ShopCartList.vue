<template>
  <div class="shopCartList">
    <scroll class="content" ref="scroll">
      <shop-cart-list-item v-for="(item,index) in cartList" :key="index" :item-info="item"/>
    </scroll>
  </div>
</template>

<script>
import Scroll from "@/components/common/scroll/Scroll";
import ShopCartListItem from "@/views/shopcart/childComps/ShopCartListItem";

import { mapGetters } from "vuex"

export default {
name: "ShopCartList",
  components: {
    Scroll,
    ShopCartListItem
  },
  computed: {
    ...mapGetters(['cartList'])
  },
  activated() {
    this.$refs.scroll.refresh()
  }
}
</script>

<style scoped>
.shopCartList {

  height: calc(100% - 44px - 49px - 40px);
}

.content {
  overflow: hidden;
  height: 100%;
}

</style>
