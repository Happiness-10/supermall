<template>
  <div class="bottom-bar">
    <div class="check-content">
      <check-button
        class="check-button"
        :is-checked="isAll"
        @click.native="checkClick"></check-button>
      <span>全选</span>
    </div>
    <div class="price">
      合计：{{totalPrice}}
    </div>
    <div class="calculate" @click="calcClick">
      去计算：({{checkLength}})
    </div>
  </div>
</template>

<script>
import CheckButton from "@/components/content/checkButton/CheckButton"
export default {
  name: "CartBottomBar",
  components: {
    CheckButton
  },
  computed: {
    totalPrice() {
      return '￥' + this.$store.state.cartList.filter(item => {
        return item.checked
      }).reduce((preValue,item) => {
        return preValue + item.price * item.count
      },0)
    },
    checkLength() {
      return this.$store.state.cartList.filter(item => item.checked).length
    },
    isAll() {
      if(this.$store.state.cartList.length === 0) return false
        return !this.$store.state.cartList.find(item => !item.checked)
    }
  },
  methods: {
    checkClick() {
      if (this.isAll) {
        //全部选中
        this.$store.state.cartList.forEach(item => item.checked = false)
      } else {
        //部分或全部不选中
        this.$store.state.cartList.forEach(item => item.checked = true)
      }
    },
    calcClick() {
      if (this.checkLength === 0) {
        this.$toast.show('请选择购买的商品',2000)
      }
    }
  }
}
</script>

<style scoped>
.bottom-bar {
  display: flex;
  position: relative;
  background-color: #eee;

  height: 40px;
  line-height: 40px;
  font-size: 14px;
}

.check-content {
  display: flex;
  align-items: center;

  margin-left: 8px;
  width: 60px;
}

.check-button {
  width: 20px;
  height: 20px;
  line-height: 20px;

  margin-right: 5px;

}

.price {
  margin-left: 50px;
  flex: 1;
}

.calculate {
  width: 90px;
  background-color: red;
  color: #eee;
  text-align: center;
}
</style>
